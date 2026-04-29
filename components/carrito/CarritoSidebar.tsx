"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CupSoda,
  CreditCard,
  ArrowRight,
  Coffee,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useCarritoStore } from "@/store/useCarritoStore";

// ─────────────────────────────────────────────────────────────────────────────
// Paleta Harbest
//   verde oscuro : #3D4A24  |  verde medio : #4F6130
//   salvia claro : #C4D4A0  |  crema verdosa : #F4F7EE  |  borde : #C4D4A0/30
// ─────────────────────────────────────────────────────────────────────────────

export function CarritoSidebar() {
  const items = useCarritoStore((s) => s.items);
  const eliminarProducto = useCarritoStore((s) => s.eliminarProducto);
  const actualizarCantidad = useCarritoStore((s) => s.actualizarCantidad);
  const vaciarCarrito = useCarritoStore((s) => s.vaciarCarrito);
  const calcularTotal = useCarritoStore((s) => s.calcularTotal);
  const cantidadTotal = useCarritoStore((s) => s.cantidadTotal);

  const total = calcularTotal();
  const totalUnidades = cantidadTotal();
  const carritoVacio = items.length === 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir carrito"
          className="
            relative flex h-10 w-10 items-center justify-center rounded-full
            bg-[#3D4A24] text-[#F4F7EE]
            transition-all hover:bg-[#4F6130] active:scale-95
          "
        >
          <ShoppingCart size={18} strokeWidth={1.8} />

          {totalUnidades > 0 && (
            <span
              className="
                absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center
                rounded-full bg-[#C4D4A0] text-[10px] font-semibold text-[#3D4A24]
              "
            >
              {totalUnidades > 99 ? "99+" : totalUnidades}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="
          flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-sm
          border-l border-[#C4D4A0]/30 bg-[#F8FAF3]
        "
      >
        <SheetHeader className="px-6 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2.5 text-[#3D4A24]">
              <Coffee size={20} strokeWidth={1.6} />
              <span className="text-xl font-semibold tracking-tight">
                Mi Pedido
              </span>
            </SheetTitle>

            {!carritoVacio && (
              <button
                onClick={vaciarCarrito}
                className="
                  text-xs text-[#4F6130]/60 underline-offset-2
                  transition-colors hover:text-[#4F6130] hover:underline
                "
              >
                Vaciar todo
              </button>
            )}
          </div>

          {!carritoVacio && (
            <p className="mt-1 text-sm text-[#4F6130]/70">
              {totalUnidades} {totalUnidades === 1 ? "producto" : "productos"}{" "}
              en tu carrito
            </p>
          )}
        </SheetHeader>

        <Separator className="bg-[#C4D4A0]/40" />

        {carritoVacio ? (
          <CarritoVacio />
        ) : (
          <>
            <ScrollArea className="min-h-0 flex-1">
              <ul className="divide-y divide-[#C4D4A0]/30 px-6">
                {items.map((item) => (
                  <li key={item.id} className="py-5">
                    <div className="flex gap-4">
                      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-[#C4D4A0]/40">
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      </div>

                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold leading-tight text-[#3D4A24]">
                              {item.nombre}
                            </p>
                            <Badge
                              variant="outline"
                              className="
                                mt-0.5 border-[#C4D4A0]/40 bg-[#EEF3E6]
                                px-1.5 py-0 text-[10px] font-normal text-[#4F6130]
                              "
                            >
                              {item.categoria}
                            </Badge>
                          </div>

                          <button
                            aria-label={`Eliminar ${item.nombre}`}
                            onClick={() => eliminarProducto(item.id)}
                            className="
                              mt-0.5 rounded-md p-1 text-[#4F6130]/40
                              transition-colors hover:bg-red-50 hover:text-red-500
                            "
                          >
                            <Trash2 size={14} strokeWidth={1.8} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-[#C4D4A0]/40 bg-white px-1.5 py-1">
                            <button
                              aria-label="Disminuir cantidad"
                              onClick={() =>
                                actualizarCantidad(item.id, item.cantidad - 1)
                              }
                              className="
                                flex h-6 w-6 items-center justify-center rounded-full text-[#4F6130]
                                transition-colors hover:bg-[#EEF3E6]
                              "
                            >
                              <Minus size={12} strokeWidth={2.5} />
                            </button>

                            <span className="w-6 text-center text-sm font-semibold tabular-nums text-[#3D4A24]">
                              {item.cantidad}
                            </span>

                            <button
                              aria-label="Aumentar cantidad"
                              onClick={() =>
                                actualizarCantidad(item.id, item.cantidad + 1)
                              }
                              disabled={item.cantidad >= item.stock}
                              className="
                                flex h-6 w-6 items-center justify-center rounded-full text-[#4F6130]
                                transition-colors hover:bg-[#EEF3E6]
                                disabled:cursor-not-allowed disabled:opacity-30
                              "
                            >
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-[#3D4A24]">
                              S/.{item.subtotal.toFixed(2)}
                            </p>
                            <p className="text-[11px] text-[#4F6130]/50">
                              S/.{item.precio.toFixed(2)} c/u
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <div className="space-y-4 border-t border-[#C4D4A0]/40 bg-[#EEF3E6]/60 px-6 py-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#4F6130]/70">
                  <span>Subtotal</span>
                  <span>S/.{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#4F6130]/70">
                  <span>Envío</span>
                  <span className="font-medium text-emerald-700">Gratis</span>
                </div>
              </div>

              <Separator className="bg-[#C4D4A0]/40" />

              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-[#3D4A24]">
                  Total
                </span>
                <span className="text-2xl font-bold tracking-tight text-[#3D4A24]">
                  S/.{total.toFixed(2)}
                </span>
              </div>

              <Link href="/checkout" className="w-full">
                <Button
                  className="
                    group w-full gap-2 rounded-xl
                    bg-[#3D4A24] py-6 text-[#F4F7EE]
                    text-base font-semibold tracking-wide shadow-none
                    transition-all hover:bg-[#4F6130] active:scale-[0.98]
                  "
                >
                  <CreditCard size={18} strokeWidth={1.8} />
                  Finalizar compra
                  <ArrowRight
                    size={16}
                    className="ml-auto transition-transform group-hover:translate-x-0.5"
                  />
                </Button>
              </Link>

              <p className="text-center text-[11px] text-[#4F6130]/50">
                Pago seguro · Retiro en tienda disponible
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CarritoVacio() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF3E6]">
        <CupSoda size={40} strokeWidth={1.2} className="text-[#4F6130]" />
      </div>

      <div className="space-y-1.5">
        <p className="text-lg font-semibold text-[#3D4A24]">
          Tu carrito está vacío
        </p>
        <p className="text-sm leading-relaxed text-[#4F6130]/60">
          Aún no has agregado nada. Explora nuestro menú y encuentra tu bebida
          favorita.
        </p>
      </div>

      <SheetClose asChild>
        <Button
          variant="outline"
          className="
            mt-2 rounded-xl border-[#C4D4A0]/40 bg-white px-6
            text-[#3D4A24] transition-colors
            hover:border-[#4F6130] hover:bg-[#EEF3E6]
          "
        >
          Ver el menú
        </Button>
      </SheetClose>
    </div>
  );
}
