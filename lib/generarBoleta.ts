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

// ─── Paleta de colores en RGB ─────────────────────────────────────────────────
const C = {
  brown: [59, 26, 8] as [number, number, number],
  brownMid: [107, 58, 42] as [number, number, number],
  brownLight: [200, 121, 58] as [number, number, number],
  cream: [245, 236, 215] as [number, number, number],
  gray: [110, 110, 110] as [number, number, number],
  black: [30, 30, 30] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [25, 120, 70] as [number, number, number],
  orange: [180, 90, 0] as [number, number, number],
  purple: [100, 50, 150] as [number, number, number],
};

// ─── Generador de ID de pedido ────────────────────────────────────────────────
function generarIdPedido(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "CAF-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ─── Función principal exportada ──────────────────────────────────────────────
export function generarBoleta(datos: DatosBoleta): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 20; // margen lateral
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

  // ══════════════════════════════════════════════════════════════
  // SECCIÓN 1 — HEADER
  // ══════════════════════════════════════════════════════════════

  // Círculo marrón con ícono de café
  doc.setFillColor(...C.brown);
  doc.circle(M + 9, y + 9, 9, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.white);
  doc.text("\u2615", M + 5.2, y + 13);

  // Nombre y subtítulo
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.brown);
  doc.text("Cafecito", M + 22, y + 8);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.gray);
  doc.text("Cafetería · Servicio de Delivery", M + 22, y + 14);

  // Bloque ID/fecha a la derecha
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.brown);
  doc.text("BOLETA", W - M, y + 6, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.gray);
  doc.text(`ID Pedido: ${idPedido}`, W - M, y + 13, { align: "right" });
  doc.text(`Fecha:     ${fecha}`, W - M, y + 19, { align: "right" });
  doc.text(`Hora:      ${hora}`, W - M, y + 25, { align: "right" });

  y += 34;

  // Línea divisoria
  doc.setDrawColor(...C.brownLight);
  doc.setLineWidth(0.6);
  doc.line(M, y, W - M, y);
  y += 9;

  // ══════════════════════════════════════════════════════════════
  // SECCIÓN 2 — DATOS DEL CLIENTE
  // ══════════════════════════════════════════════════════════════
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.brownMid);
  doc.text("DATOS DEL CLIENTE", M, y);
  y += 6;

  const campos: [string, string][] = [
    ["Cliente:", datos.nombre],
    ["Teléfono:", datos.telefono],
    ["Dirección de envío:", datos.direccion],
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
  // SECCIÓN 3 — TABLA DE PRODUCTOS
  // ══════════════════════════════════════════════════════════════
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.brownMid);
  doc.text("DETALLE DEL PEDIDO", M, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [["Producto", "Cant.", "Precio Unit.", "Subtotal"]],
    // ✅ Usa directamente los campos de ItemCarrito (precio viene de Producto)
    body: datos.items.map((item) => [
      item.nombre,
      item.cantidad.toString(),
      `S/ ${item.precio.toFixed(2)}`,
      `S/ ${item.subtotal.toFixed(2)}`,
    ]),
    headStyles: {
      fillColor: C.brown,
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
    alternateRowStyles: { fillColor: [253, 250, 244] },
    tableLineColor: [220, 205, 185],
    tableLineWidth: 0.2,
  });

  y =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 5;

  // ══════════════════════════════════════════════════════════════
  // SECCIÓN 4 — TOTALES
  // ══════════════════════════════════════════════════════════════
  const colVal = W - M;
  const colLbl = W - M - 55;

  doc.setFontSize(9);

  const filasTotales: [string, string, [number, number, number]][] = [
    ["Subtotal:", `S/ ${datos.subtotal.toFixed(2)}`, C.gray],
    ["IGV (18%):", `S/ ${datos.igv.toFixed(2)}`, C.gray],
    ["Envío:", "Gratis", C.green],
  ];

  filasTotales.forEach(([label, valor, color]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.gray);
    doc.text(label, colLbl, y);
    doc.setTextColor(...color);
    doc.text(valor, colVal, y, { align: "right" });
    y += 5.5;
  });

  doc.setDrawColor(...C.brownLight);
  doc.setLineWidth(0.4);
  doc.line(colLbl, y, colVal, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...C.brown);
  doc.text("TOTAL A PAGAR:", colLbl, y);
  doc.text(`S/ ${datos.total.toFixed(2)}`, colVal, y, { align: "right" });
  y += 12;

  // ══════════════════════════════════════════════════════════════
  // SECCIÓN 5 — ESTADO DE PAGO
  // ══════════════════════════════════════════════════════════════
  doc.setDrawColor(...C.brownLight);
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.brownMid);
  doc.text("ESTADO DE PAGO", M, y);
  y += 6;

  let textoEstado = "";
  let colorEstado: [number, number, number] = C.black;
  let bgEstado: [number, number, number] = C.cream;

  if (datos.metodoPago === "tarjeta") {
    const ultimos4 = datos.numeroTarjeta
      ? datos.numeroTarjeta.replace(/\s/g, "").slice(-4)
      : "****";
    textoEstado = `PAGADO — Tarjeta terminada en ${ultimos4}`;
    colorEstado = C.green;
    bgEstado = [230, 245, 235];
  } else if (datos.metodoPago === "yape") {
    textoEstado = `PAGADO — Transferencia Yape/Plin · Operación: ${datos.numeroOperacion ?? "—"}`;
    colorEstado = C.purple;
    bgEstado = [240, 232, 250];
  } else {
    textoEstado =
      "PAGO PENDIENTE — Contra entrega · El repartidor cobrará el monto total al llegar";
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
  // SECCIÓN 6 — FOOTER
  // ══════════════════════════════════════════════════════════════
  doc.setDrawColor(...C.brownLight);
  doc.setLineWidth(0.4);
  doc.line(M, y, W - M, y);
  y += 7;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...C.brownMid);
  doc.text(
    "\u2615  ¡Gracias por tu pedido! Que disfrutes tu café.  \u2615",
    W / 2,
    y,
    { align: "center" },
  );
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);
  doc.text(
    `Cafecito · ID de verificación: ${idPedido} · ${fecha} ${hora}`,
    W / 2,
    y,
    { align: "center" },
  );

  // ── Descarga el archivo ──
  doc.save(`boleta-cafecito-${idPedido}.pdf`);
}
