import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ItemCarrito } from "@/data/mockData";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface DatosBoleta {
  nombre: string;
  telefono: string;
  direccion: string;
  metodoPago: "efectivo" | "tarjeta" | "yape";
  numeroTarjeta?: string;
  numeroOperacion?: string;
  items: ItemCarrito[];
  subtotal: number;
  igv: number;
  total: number;
}

// ─── Paleta Harvest en RGB ────────────────────────────────────────────────────
const C = {
  darkGreen: [61, 74, 36] as [number, number, number], // #3D4A24
  medGreen: [79, 97, 48] as [number, number, number], // #4F6130
  sageLight: [196, 212, 160] as [number, number, number], // #C4D4A0
  creamGreen: [238, 243, 230] as [number, number, number], // #EEF3E6
  bgPage: [248, 250, 243] as [number, number, number], // #F8FAF3
  gray: [110, 110, 110] as [number, number, number],
  black: [30, 30, 30] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [25, 120, 70] as [number, number, number],
  orange: [180, 90, 0] as [number, number, number],
  purple: [100, 50, 150] as [number, number, number],
};

// ─── Generador de ID ──────────────────────────────────────────────────────────
function generarIdPedido(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "HRV-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ─── Carga /public/logo.png como base64 ──────────────────────────────────────
async function cargarLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch("/logo.png");
    if (!res.ok) return null;
    const blob = await res.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── Fallback si logo.png no carga ───────────────────────────────────────────
function drawLogoFallback(doc: jsPDF, cx: number, cy: number, r: number) {
  doc.setFillColor(...C.darkGreen);
  doc.circle(cx, cy, r, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text("H", cx, cy + 3.5, { align: "center" });
}

// ─── Funcion principal ───────────────────────────────────────────────────────
export async function generarBoleta(datos: DatosBoleta): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 20;
  let y = 18;

  const idPedido = generarIdPedido();
  const ahora = new Date();

  const fecha = ahora.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hora = ahora.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Carga el logo ANTES de construir el PDF
  const logoBase64 = await cargarLogoBase64();

  // ══════════════════════════════════════════════════════════════
  // SECCION 1 - HEADER
  // ══════════════════════════════════════════════════════════════

  // Franja de fondo crema verdosa
  doc.setFillColor(...C.creamGreen);
  doc.rect(0, 0, W, 54, "F");

  // Logo: imagen real o fallback
  const logoSize = 18;
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", M, y, logoSize, logoSize);
  } else {
    drawLogoFallback(doc, M + logoSize / 2, y + logoSize / 2, logoSize / 2);
  }

  // Nombre y subtitulo: comienzan DESPUES del logo
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.darkGreen);
  doc.text("Harvest", M + logoSize + 4, y + 8);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.medGreen);
  doc.text("Cafeteria - Servicio de Delivery", M + logoSize + 4, y + 14);

  // Bloque derecha
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.darkGreen);
  doc.text("BOLETA", W - M, y + 6, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.gray);
  doc.text(`ID Pedido: ${idPedido}`, W - M, y + 13, { align: "right" });
  doc.text(`Fecha:     ${fecha}`, W - M, y + 19, { align: "right" });
  doc.text(`Hora:      ${hora}`, W - M, y + 25, { align: "right" });

  y += 36;

  doc.setDrawColor(...C.sageLight);
  doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 9;

  // ══════════════════════════════════════════════════════════════
  // SECCION 2 - DATOS DEL CLIENTE
  // ══════════════════════════════════════════════════════════════
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.medGreen);
  doc.text("DATOS DEL CLIENTE", M, y);
  y += 6;

  // Sin tildes ni caracteres especiales: Helvetica no los soporta
  const campos: [string, string][] = [
    ["Cliente:", datos.nombre],
    ["Telefono:", datos.telefono],
    ["Direccion de envio:", datos.direccion],
  ];

  campos.forEach(([label, valor]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.gray);
    doc.text(label, M, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.black);
    const lines = doc.splitTextToSize(valor, W - M - 55);
    doc.text(lines, M + 50, y);

    y += lines.length > 1 ? lines.length * 5 : 6;
  });

  y += 4;

  // ══════════════════════════════════════════════════════════════
  // SECCION 3 - TABLA DE PRODUCTOS
  // ══════════════════════════════════════════════════════════════
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.medGreen);
  doc.text("DETALLE DEL PEDIDO", M, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [["Producto", "Cant.", "Precio Unit.", "Subtotal"]],
    body: datos.items.map((item) => [
      item.nombre,
      item.cantidad.toString(),
      `S/ ${item.precio.toFixed(2)}`,
      `S/ ${item.subtotal.toFixed(2)}`,
    ]),
    headStyles: {
      fillColor: C.darkGreen,
      textColor: C.white,
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
      cellPadding: 3.5,
    },
    bodyStyles: {
      textColor: C.black,
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center", cellWidth: 16 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 28 },
    },
    alternateRowStyles: { fillColor: C.bgPage },
    tableLineColor: C.sageLight,
    tableLineWidth: 0.2,
  });

  y =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 5;

  // ══════════════════════════════════════════════════════════════
  // SECCION 4 - TOTALES
  // ══════════════════════════════════════════════════════════════
  const colVal = W - M;
  const colLbl = W - M - 55;

  doc.setFontSize(9);

  const filasTotales: [string, string, [number, number, number]][] = [
    ["Subtotal:", `S/ ${datos.subtotal.toFixed(2)}`, C.gray],
    ["IGV (18%):", `S/ ${datos.igv.toFixed(2)}`, C.gray],
    ["Envio:", "Gratis", C.green],
  ];

  filasTotales.forEach(([label, valor, color]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray);
    doc.text(label, colLbl, y);

    doc.setTextColor(...color);
    doc.text(valor, colVal, y, { align: "right" });

    y += 5.5;
  });

  doc.setDrawColor(...C.sageLight);
  doc.setLineWidth(0.4);
  doc.line(colLbl, y, colVal, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...C.darkGreen);
  doc.text("TOTAL A PAGAR:", colLbl, y);
  doc.text(`S/ ${datos.total.toFixed(2)}`, colVal, y, { align: "right" });
  y += 12;

  // ══════════════════════════════════════════════════════════════
  // SECCION 5 - ESTADO DE PAGO
  // ══════════════════════════════════════════════════════════════
  doc.setDrawColor(...C.sageLight);
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.medGreen);
  doc.text("ESTADO DE PAGO", M, y);
  y += 6;

  let textoEstado = "";
  let colorEstado: [number, number, number] = C.black;
  let bgEstado: [number, number, number] = C.creamGreen;

  if (datos.metodoPago === "tarjeta") {
    const ultimos4 = datos.numeroTarjeta
      ? datos.numeroTarjeta.replace(/\s/g, "").slice(-4)
      : "****";
    textoEstado = `PAGADO - Tarjeta terminada en ${ultimos4}`;
    colorEstado = C.green;
    bgEstado = [230, 245, 235];
  } else if (datos.metodoPago === "yape") {
    textoEstado = `PAGADO - Transferencia Yape/Plin - Operacion: ${datos.numeroOperacion ?? "-"}`;
    colorEstado = C.purple;
    bgEstado = [240, 232, 250];
  } else {
    textoEstado =
      "PAGO PENDIENTE - Contra entrega. El repartidor cobrara el monto total al llegar.";
    colorEstado = C.orange;
    bgEstado = [252, 240, 220];
  }

  const lines = doc.splitTextToSize(textoEstado, W - M * 2 - 12);
  const boxH = lines.length * 5.5 + 8;

  doc.setFillColor(...bgEstado);
  doc.setDrawColor(...colorEstado);
  doc.setLineWidth(0.4);
  doc.roundedRect(M, y, W - M * 2, boxH, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...colorEstado);
  doc.text(lines, M + 6, y + 6);

  y += boxH + 10;

  // ══════════════════════════════════════════════════════════════
  // SECCION 6 - FOOTER
  // ══════════════════════════════════════════════════════════════
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...C.creamGreen);
  doc.rect(0, pageH - 22, W, 22, "F");

  doc.setDrawColor(...C.sageLight);
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.medGreen);
  doc.text("-- Gracias por tu pedido! Que disfrutes tu cafe. --", W / 2, y, {
    align: "center",
  });
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);
  doc.text(
    `Harvest | ID de verificacion: ${idPedido} | ${fecha} ${hora}`,
    W / 2,
    y,
    { align: "center" },
  );

  doc.save(`boleta-Harvest-${idPedido}.pdf`);
}
