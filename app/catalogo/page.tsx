"use client";

import React from "react";
import dynamic from "next/dynamic"; // 1. Importamos dynamic
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cafes, postres } from "@/data/mockData";
import { useCarritoStore } from "@/store/useCarritoStore";
import type { Producto } from "@/data/mockData";

// 2. Cargamos el Sidebar de forma dinámica
const CarritoSidebar = dynamic(
  () =>
    import("@/components/carrito/CarritoSidebar").then(
      (mod) => mod.CarritoSidebar,
    ),
  { ssr: false }, // Esto desactiva el renderizado en el servidor para este componente
);

export default function CatalogoPage() {
  const agregarAlCarrito = useCarritoStore((s) => s.agregarProducto);

  const handleAddToCart = (producto: Producto) => {
    agregarAlCarrito(producto);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <header className="sticky top-0 z-50 bg-[#f1e9dd] py-4 mb-10 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
          <h2 className="text-2xl font-black text-[#6f4e37]">COFFEE HUB</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[#6f4e37] hidden sm:block">
              TU PEDIDO
            </span>
            {/* 3. Ahora este componente no causará errores de hidratación */}
            <CarritoSidebar />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-center text-4xl font-black text-[#6f4e37] mb-12">
          NUESTRO MENÚ
        </h1>

        {/* Sección Cafés */}
        <section className="mb-20">
          <h3 className="text-xl font-bold text-[#6f4e37] mb-6 border-l-4 border-[#6f4e37] pl-3">
            Nuestros Cafés
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cafes.map((cafe) => (
              <Card
                key={cafe.id}
                className="overflow-hidden shadow-md border-none"
              >
                <div className="h-64 overflow-hidden">
                  {/* Nota: Aquí usamos img normal para no pelear con la config de Next Image por ahora */}
                  <img
                    src={cafe.imagen}
                    alt={cafe.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    {cafe.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-[#6f4e37]">
                    S/ {cafe.precio.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleAddToCart(cafe)}
                    className="w-full bg-[#3B1A08] hover:bg-[#6B3A2A] text-white font-bold"
                  >
                    Añadir al carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Sección Postres */}
        <section>
          <h3 className="text-xl font-bold text-[#6f4e37] mb-6 border-l-4 border-[#6f4e37] pl-3">
            Dulces Tentaciones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {postres.map((postre) => (
              <Card
                key={postre.id}
                className="overflow-hidden shadow-md border-none"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={postre.imagen}
                    alt={postre.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    {postre.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-[#6f4e37]">
                    S/ {postre.precio.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleAddToCart(postre)}
                    className="w-full bg-[#3B1A08] hover:bg-[#6B3A2A] text-white font-bold"
                  >
                    Añadir al carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
