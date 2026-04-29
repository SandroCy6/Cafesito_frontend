"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

import { cafes, postres } from "@/data/mockData";
import { useCarritoStore } from "@/store/useCarritoStore";
import type { Producto } from "@/data/mockData";

const CarritoSidebar = dynamic(
  () =>
    import("@/components/carrito/CarritoSidebar").then(
      (mod) => mod.CarritoSidebar,
    ),
  { ssr: false },
);

export default function CatalogoPage() {
  const agregarAlCarrito = useCarritoStore((s) => s.agregarProducto);

  const handleAddToCart = (producto: Producto) => {
    agregarAlCarrito(producto);
  };

  return (
    <div className="min-h-screen bg-[#F4F7EE] pb-20">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Encabezado */}
        <div className="py-14 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#4F6130]">
            Carta completa
          </p>
          <h1 className="text-4xl font-black tracking-tight text-[#3D4A24] sm:text-5xl">
            Nuestro Menú
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4F6130]/70">
            Granos especiales de origen único, preparados con técnica y servidos con
            pasión.
          </p>
        </div>

        {/* Sección Cafés */}
        <section className="mb-20">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-[#3D4A24]" />
            <h2 className="text-xl font-bold text-[#3D4A24]">Nuestros Cafés</h2>
            <Badge className="border border-[#C4D4A0]/40 bg-[#EEF3E6] text-[#4F6130] shadow-none">
              {cafes.length} variedades
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cafes.map((cafe) => (
              <ProductoCard
                key={cafe.id}
                producto={cafe}
                onAgregar={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* Sección Postres */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-[#3D4A24]" />
            <h2 className="text-xl font-bold text-[#3D4A24]">
              Dulces Tentaciones
            </h2>
            <Badge className="border border-[#C4D4A0]/40 bg-[#EEF3E6] text-[#4F6130] shadow-none">
              {postres.length} Nuestras opciones
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {postres.map((postre) => (
              <ProductoCard
                key={postre.id}
                producto={postre}
                onAgregar={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ProductoCard({
  producto,
  onAgregar,
}: {
  producto: Producto;
  onAgregar: (p: Producto) => void;
}) {
  const sinStock = producto.stock === 0;

  return (
    <Card className="group overflow-hidden border border-[#C4D4A0]/40 bg-white shadow-none transition-all hover:shadow-md hover:shadow-[#3D4A24]/08">
      <div className="relative h-56 overflow-hidden bg-[#EEF3E6]">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D4A24]/25 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#3D4A24] backdrop-blur-sm">
          {producto.categoria}
        </span>
        {sinStock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            Agotado
          </span>
        )}
      </div>

      <CardHeader className="pb-1 pt-4">
        <CardTitle className="text-base font-semibold leading-tight text-[#3D4A24]">
          {producto.nombre}
        </CardTitle>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[#4F6130]/65">
          {producto.descripcion}
        </p>
      </CardHeader>

      <CardContent className="pb-2 pt-1">
        <p className="text-lg font-bold text-[#3D4A24]">
          S/ {producto.precio.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => onAgregar(producto)}
          disabled={sinStock}
          className="w-full gap-2 rounded-xl bg-[#3D4A24] text-[#F4F7EE] font-semibold shadow-none transition-all hover:bg-[#4F6130] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={15} strokeWidth={1.8} />
          {sinStock ? "Sin stock" : "Añadir al carrito"}
        </Button>
      </CardFooter>
    </Card>
  );
}
