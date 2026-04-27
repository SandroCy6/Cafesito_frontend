"use client";
import { useState, useId, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Coffee,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Receipt,
  User,
  Phone,
  Home,
  Lock,
  Calendar,
  Hash,
  AlertCircle,
  Truck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useCarritoStore } from "@/store/useCarritoStore";
import { generarBoleta } from "@/lib/generarBoleta";
import type { ItemCarrito } from "@/data/mockData";

// ─── Hook de hidratación (sin useEffect ni setState) ──────────────────────────
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

// ─── Tipos locales ────────────────────────────────────────────────────────────
type MetodoPago = "efectivo" | "tarjeta" | "yape";
type EstadoPedido = "idle" | "procesando" | "exito";

interface FormData {
  nombre: string;
  telefono: string;
  direccion: string;
  metodoPago: MetodoPago;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
  numeroOperacion: string;
}

interface FormErrors {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  numeroTarjeta?: string;
  vencimiento?: string;
  cvv?: string;
  numeroOperacion?: string;
}

// Snapshot: congela los datos del pedido en el momento de confirmar,
// antes de que vaciarCarrito() limpie el store.
interface SnapshotPedido {
  items: ItemCarrito[];
  subtotal: number;
  igv: number;
  total: number;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const IGV_RATE = 0.18;

// ─────────────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const hasHydrated = useIsClient();

  // ── Store ──
  const items = useCarritoStore((s) => s.items);
  const actualizarCantidad = useCarritoStore((s) => s.actualizarCantidad);
  const eliminarProducto = useCarritoStore((s) => s.eliminarProducto);
  const vaciarCarrito = useCarritoStore((s) => s.vaciarCarrito);
  const calcularTotal = useCarritoStore((s) => s.calcularTotal);

  // ── Estado local ──
  const [form, setForm] = useState<FormData>({
    nombre: "",
    telefono: "",
    direccion: "",
    metodoPago: "efectivo",
    numeroTarjeta: "",
    vencimiento: "",
    cvv: "",
    numeroOperacion: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [estado, setEstado] = useState<EstadoPedido>("idle");

  // Guarda una copia inmutable del pedido al confirmar.
  // Así la pantalla de éxito y el PDF siempre muestran los valores reales,
  // aunque el store se vacíe 800ms después.
  const [snapshot, setSnapshot] = useState<SnapshotPedido | null>(null);

  // ── Guard de hidratación ──
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-[#FDFAF4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-[#3B1A08]" />
          <p className="text-sm text-[#6B3A2A]/60 font-medium">
            Cargando pedido...
          </p>
        </div>
      </div>
    );
  }

  // ── Cálculos en vivo (solo para la pantalla del formulario) ──
  const subtotal = calcularTotal();
  const igv = parseFloat((subtotal * IGV_RATE).toFixed(2));
  const total = parseFloat((subtotal + igv).toFixed(2));

  // ── Helpers de formulario ──
  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!/^\d{9,15}$/.test(form.telefono.replace(/\s/g, "")))
      e.telefono = "Ingresa un teléfono válido (9–15 dígitos).";
    if (!form.direccion.trim())
      e.direccion = "La dirección de envío es obligatoria.";

    if (form.metodoPago === "tarjeta") {
      if (!/^\d{16}$/.test(form.numeroTarjeta.replace(/\s/g, "")))
        e.numeroTarjeta = "Número de tarjeta inválido (16 dígitos).";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.vencimiento))
        e.vencimiento = "Formato incorrecto. Usa MM/AA.";
      if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "CVV inválido (3–4 dígitos).";
    }

    if (form.metodoPago === "yape" && !form.numeroOperacion.trim())
      e.numeroOperacion = "Ingresa el número de operación.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Confirmar pedido ──
  const handleConfirmar = async () => {
    if (!validate()) return;
    setEstado("procesando");

    // ✅ Guarda snapshot AHORA, antes del await y antes de vaciarCarrito.
    // A partir de este momento, subtotal/igv/total e items tienen los valores reales.
    const subtotalSnap = calcularTotal();
    const igvSnap = parseFloat((subtotalSnap * IGV_RATE).toFixed(2));
    const totalSnap = parseFloat((subtotalSnap + igvSnap).toFixed(2));
    setSnapshot({
      items: [...items], // copia del array, no referencia
      subtotal: subtotalSnap,
      igv: igvSnap,
      total: totalSnap,
    });

    await new Promise((r) => setTimeout(r, 2200));
    setEstado("exito");
    // Vacía el carrito 800ms después de mostrar la pantalla de éxito
    setTimeout(() => vaciarCarrito(), 800);
  };

  // ── Generar PDF ──
  // Lee siempre desde el snapshot, nunca desde el store (que ya puede estar vacío).
  const handleGenerarBoleta = () => {
    if (!snapshot) return;
    generarBoleta({
      nombre: form.nombre,
      telefono: form.telefono,
      direccion: form.direccion,
      metodoPago: form.metodoPago,
      numeroTarjeta: form.numeroTarjeta,
      numeroOperacion: form.numeroOperacion,
      items: snapshot.items,
      subtotal: snapshot.subtotal,
      igv: snapshot.igv,
      total: snapshot.total,
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PANTALLA DE ÉXITO
  // ─────────────────────────────────────────────────────────────────────────
  if (estado === "exito") {
    // Usa snapshot para mostrar valores reales aunque el store ya esté vacío
    const totalMostrar = snapshot?.total ?? 0;

    return (
      <main className="min-h-screen bg-[#FDFAF4] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F5ECD7]">
            <CheckCircle2
              size={48}
              strokeWidth={1.4}
              className="text-[#C8793A]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#3B1A08] tracking-tight">
              ¡Pedido confirmado!
            </h1>
            <p className="mt-2 text-sm text-[#6B3A2A]/70 leading-relaxed">
              Tu pedido está en camino. Lo recibirás en:{" "}
              <span className="font-semibold text-[#3B1A08]">
                {form.direccion}
              </span>
            </p>
          </div>

          <div className="w-full rounded-2xl border border-[#EAD9BC] bg-white p-4 text-left space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B3A2A]/50">
              Resumen del pedido
            </p>
            {/* ✅ totalMostrar viene del snapshot, nunca del store vacío */}
            <div className="flex justify-between text-sm text-[#3B1A08]">
              <span>Total pagado</span>
              <span className="font-bold">S/ {totalMostrar.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#6B3A2A]/70">
              <span>Método de pago</span>
              <span className="capitalize">
                {form.metodoPago === "yape" ? "Yape / Plin" : form.metodoPago}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#6B3A2A]/70">
              <span>Cliente</span>
              <span>{form.nombre}</span>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-[#EAD9BC] text-[#3B1A08] hover:bg-[#F5ECD7]"
              onClick={() => router.push("/")}
            >
              Volver al menú
            </Button>

            {/* ✅ Llama a handleGenerarBoleta que usa el snapshot */}
            <Button
              className="flex-1 gap-2 rounded-xl bg-[#3B1A08] text-[#F5ECD7] hover:bg-[#6B3A2A]"
              onClick={handleGenerarBoleta}
            >
              <Receipt size={16} strokeWidth={1.8} />
              Ver recibo
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PÁGINA PRINCIPAL
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#FDFAF4]">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-10 border-b border-[#EAD9BC] bg-[#FDFAF4]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-[#6B3A2A]/70 transition-colors hover:text-[#3B1A08]"
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Volver
          </button>

          <div className="flex items-center gap-2 text-[#3B1A08]">
            <Coffee size={18} strokeWidth={1.6} />
            <span className="font-semibold tracking-tight">Checkout</span>
          </div>

          <Badge
            variant="outline"
            className="border-[#EAD9BC] bg-[#F5ECD7] text-[10px] text-[#6B3A2A]"
          >
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </Badge>
        </div>
      </header>

      {/* ── Grid principal ── */}
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1fr_400px]">
        {/* ════ COLUMNA IZQUIERDA — Formulario ════ */}
        <div className="space-y-6">
          {/* 1. Datos de contacto */}
          <SectionCard
            icon={<User size={16} strokeWidth={1.8} />}
            title="Datos de contacto"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldGroup
                label="Nombre completo"
                icon={<User size={13} />}
                error={errors.nombre}
              >
                <Input
                  placeholder="Juan Pérez"
                  value={form.nombre}
                  onChange={(e) => updateForm("nombre", e.target.value)}
                  className={inputCls(!!errors.nombre)}
                />
              </FieldGroup>

              <FieldGroup
                label="Teléfono"
                icon={<Phone size={13} />}
                error={errors.telefono}
              >
                <Input
                  placeholder="+51 999 999 999"
                  value={form.telefono}
                  onChange={(e) => updateForm("telefono", e.target.value)}
                  className={inputCls(!!errors.telefono)}
                />
              </FieldGroup>
            </div>
          </SectionCard>

          {/* 2. Dirección de envío */}
          <SectionCard
            icon={<Truck size={16} strokeWidth={1.8} />}
            title="Dirección de envío"
          >
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#EAD9BC] bg-[#F5ECD7]/60 px-4 py-3">
              <MapPin size={14} className="text-[#C8793A] mt-0.5 shrink-0" />
              <p className="text-xs text-[#6B3A2A]/80 leading-relaxed">
                Este pedido es exclusivo para{" "}
                <span className="font-semibold text-[#3B1A08]">delivery</span>.
                Ingresa la dirección donde recibirás tu pedido.
              </p>
            </div>

            <FieldGroup
              label="Dirección de entrega"
              icon={<Home size={13} />}
              error={errors.direccion}
            >
              <Input
                placeholder="Av. Los Cafetos 123, Ica"
                value={form.direccion}
                onChange={(e) => updateForm("direccion", e.target.value)}
                className={inputCls(!!errors.direccion)}
              />
            </FieldGroup>
          </SectionCard>

          {/* 3. Método de pago */}
          <SectionCard
            icon={<CreditCard size={16} strokeWidth={1.8} />}
            title="Método de pago"
          >
            <RadioGroup
              value={form.metodoPago}
              onValueChange={(v) => {
                updateForm("metodoPago", v as MetodoPago);
                setErrors((prev) => ({
                  nombre: prev.nombre,
                  telefono: prev.telefono,
                  direccion: prev.direccion,
                }));
              }}
              className="grid gap-3 sm:grid-cols-3"
            >
              <PagoOption
                value="efectivo"
                label="Efectivo"
                icon={<Banknote size={20} strokeWidth={1.5} />}
                selected={form.metodoPago === "efectivo"}
              />
              <PagoOption
                value="tarjeta"
                label="Tarjeta"
                icon={<CreditCard size={20} strokeWidth={1.5} />}
                selected={form.metodoPago === "tarjeta"}
              />
              <PagoOption
                value="yape"
                label="Yape / Plin"
                icon={<Smartphone size={20} strokeWidth={1.5} />}
                selected={form.metodoPago === "yape"}
              />
            </RadioGroup>

            {/* Campos condicionales por método */}
            <div className="mt-5">
              {/* Efectivo */}
              {form.metodoPago === "efectivo" && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                  <AlertCircle
                    size={16}
                    className="text-emerald-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Pagas al recibir
                    </p>
                    <p className="text-xs text-emerald-700/80 mt-0.5 leading-relaxed">
                      Nuestro repartidor cobrará el monto exacto al momento de
                      la entrega.
                    </p>
                  </div>
                </div>
              )}

              {/* Tarjeta */}
              {form.metodoPago === "tarjeta" && (
                <div className="space-y-4">
                  <FieldGroup
                    label="Número de tarjeta"
                    icon={<CreditCard size={13} />}
                    error={errors.numeroTarjeta}
                  >
                    <Input
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={form.numeroTarjeta}
                      onChange={(e) => {
                        const raw = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16);
                        updateForm(
                          "numeroTarjeta",
                          raw.replace(/(.{4})/g, "$1 ").trim(),
                        );
                      }}
                      className={inputCls(!!errors.numeroTarjeta)}
                    />
                  </FieldGroup>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup
                      label="Vencimiento"
                      icon={<Calendar size={13} />}
                      error={errors.vencimiento}
                    >
                      <Input
                        placeholder="MM/AA"
                        maxLength={5}
                        value={form.vencimiento}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length >= 3)
                            v = v.slice(0, 2) + "/" + v.slice(2);
                          updateForm("vencimiento", v);
                        }}
                        className={inputCls(!!errors.vencimiento)}
                      />
                    </FieldGroup>

                    <FieldGroup
                      label="CVV"
                      icon={<Lock size={13} />}
                      error={errors.cvv}
                    >
                      <Input
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        value={form.cvv}
                        onChange={(e) =>
                          updateForm(
                            "cvv",
                            e.target.value.replace(/\D/g, "").slice(0, 4),
                          )
                        }
                        className={inputCls(!!errors.cvv)}
                      />
                    </FieldGroup>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#EAD9BC] bg-[#F5ECD7]/40 px-3 py-2.5">
                    <Lock size={13} className="text-[#C8793A] shrink-0" />
                    <p className="text-[11px] text-[#6B3A2A]/70">
                      Datos protegidos con cifrado SSL. No almacenamos
                      información de tarjeta.
                    </p>
                  </div>
                </div>
              )}

              {/* Yape / Plin */}
              {form.metodoPago === "yape" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3.5">
                    <Smartphone
                      size={15}
                      className="text-purple-600 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-purple-800">
                        Paga con Yape o Plin
                      </p>
                      <p className="text-xs text-purple-700/80 mt-0.5 leading-relaxed">
                        Realiza el pago al número{" "}
                        <span className="font-bold">+51 987 654 321</span> y
                        luego ingresa el número de operación de tu app.
                      </p>
                    </div>
                  </div>

                  <FieldGroup
                    label="Número de operación"
                    icon={<Hash size={13} />}
                    error={errors.numeroOperacion}
                  >
                    <Input
                      placeholder="Ej: 123456789"
                      value={form.numeroOperacion}
                      onChange={(e) =>
                        updateForm(
                          "numeroOperacion",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      className={inputCls(!!errors.numeroOperacion)}
                    />
                  </FieldGroup>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* ════ COLUMNA DERECHA — Resumen del pedido ════ */}
        <div className="space-y-4">
          <div className="sticky top-24">
            <Card className="overflow-hidden border-[#EAD9BC] bg-white shadow-none">
              <CardHeader className="border-b border-[#EAD9BC] bg-[#F5ECD7]/40 px-5 py-4">
                <CardTitle className="flex items-center gap-2 text-base text-[#3B1A08]">
                  <ShoppingBag size={16} strokeWidth={1.8} />
                  Tu pedido
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {items.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-[#6B3A2A]/60">
                    No hay productos en el carrito.
                  </p>
                ) : (
                  <ul className="divide-y divide-[#EAD9BC]/60">
                    {items.map((item) => (
                      <li key={item.id} className="flex gap-3 px-5 py-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#EAD9BC]">
                          <Image
                            src={item.imagen}
                            alt={item.nombre}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[13px] font-semibold leading-tight text-[#3B1A08]">
                              {item.nombre}
                            </p>
                            <button
                              aria-label={`Eliminar ${item.nombre}`}
                              onClick={() => eliminarProducto(item.id)}
                              className="shrink-0 rounded p-0.5 text-[#6B3A2A]/30 transition-colors hover:text-red-400"
                            >
                              <Trash2 size={13} strokeWidth={1.8} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-[#EAD9BC] bg-[#FDFAF4] px-1.5 py-0.5">
                              <button
                                aria-label="Disminuir cantidad"
                                onClick={() =>
                                  actualizarCantidad(item.id, item.cantidad - 1)
                                }
                                className="flex h-5 w-5 items-center justify-center rounded-full text-[#6B3A2A] hover:bg-[#F5ECD7]"
                              >
                                <Minus size={10} strokeWidth={2.5} />
                              </button>
                              <span className="w-5 text-center text-xs font-semibold tabular-nums text-[#3B1A08]">
                                {item.cantidad}
                              </span>
                              <button
                                aria-label="Aumentar cantidad"
                                onClick={() =>
                                  actualizarCantidad(item.id, item.cantidad + 1)
                                }
                                disabled={item.cantidad >= item.stock}
                                className="flex h-5 w-5 items-center justify-center rounded-full text-[#6B3A2A] hover:bg-[#F5ECD7] disabled:opacity-30"
                              >
                                <Plus size={10} strokeWidth={2.5} />
                              </button>
                            </div>

                            <p className="text-sm font-bold text-[#3B1A08]">
                              S/ {item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {items.length > 0 && (
                  <div className="border-t border-[#EAD9BC] bg-[#F5ECD7]/30 px-5 py-4 space-y-2">
                    <div className="flex justify-between text-sm text-[#6B3A2A]/70">
                      <span>Subtotal</span>
                      <span>S/ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#6B3A2A]/70">
                      <span>IGV (18%)</span>
                      <span>S/ {igv.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#6B3A2A]/70">
                      <span>Envío</span>
                      <span className="font-medium text-emerald-700">
                        Gratis
                      </span>
                    </div>

                    <Separator className="bg-[#EAD9BC]" />

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-[#3B1A08]">
                        Total
                      </span>
                      <span className="text-xl font-bold tracking-tight text-[#3B1A08]">
                        S/ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              disabled={estado === "procesando" || items.length === 0}
              onClick={handleConfirmar}
              className="
                group mt-4 w-full gap-2 rounded-xl
                bg-[#3B1A08] py-6 text-base font-semibold tracking-wide
                text-[#F5ECD7] shadow-none transition-all
                hover:bg-[#6B3A2A] active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {estado === "procesando" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Procesando pedido…
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} strokeWidth={1.8} />
                  Confirmar pedido · S/ {total.toFixed(2)}
                </>
              )}
            </Button>

            <p className="mt-3 text-center text-[11px] text-[#6B3A2A]/50">
              Al confirmar aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes de UI
// ─────────────────────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-[#EAD9BC] bg-white shadow-none">
      <CardHeader className="border-b border-[#EAD9BC]/60 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-[#3B1A08]">
          <span className="text-[#C8793A]">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-5">{children}</CardContent>
    </Card>
  );
}

function FieldGroup({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-medium text-[#6B3A2A]"
      >
        {icon && <span className="text-[#C8793A]">{icon}</span>}
        {label}
      </Label>
      <div id={id}>{children}</div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function PagoOption({
  value,
  label,
  icon,
  selected,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  selected: boolean;
}) {
  return (
    <Label
      htmlFor={`pago-${value}`}
      className={`
        flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all
        ${
          selected
            ? "border-[#C8793A] bg-[#F5ECD7] text-[#3B1A08]"
            : "border-[#EAD9BC] bg-white text-[#6B3A2A] hover:border-[#C8793A]/40 hover:bg-[#FDFAF4]"
        }
      `}
    >
      <RadioGroupItem id={`pago-${value}`} value={value} className="sr-only" />
      <span className={selected ? "text-[#C8793A]" : "text-[#6B3A2A]/60"}>
        {icon}
      </span>
      <span className="text-xs font-semibold leading-tight">{label}</span>
    </Label>
  );
}

function inputCls(hasError: boolean) {
  return `
    border-[#EAD9BC] bg-[#FDFAF4] text-[#3B1A08] placeholder:text-[#6B3A2A]/30
    focus-visible:ring-1 focus-visible:ring-[#C8793A] focus-visible:border-[#C8793A]
    ${hasError ? "border-red-400 focus-visible:ring-red-400" : ""}
  `;
}
