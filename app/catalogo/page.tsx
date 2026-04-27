"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cafes, postres } from "@/data/mockData"; 

export default function CatalogoPage() {
  // Esta funcion es para conectar al carrito
  const handleAddToCart = (productName: string) => {
    console.log(`Añadido al carrito: ${productName}`);
    // Aqui falta la logica del carrito  
  };

  return (
    <div className="min-h-screen bg-white pb-20" style={{ fontFamily: 'Verdana, sans-serif' }}>
      
      {/* Encabezado principal */}
      <div className="bg-[#f1e9dd] py-10 mb-10 shadow-inner">
        <h2 className="text-center text-5xl font-black text-[#6f4e37] tracking-tighter">
          PRODUCTOS
        </h2>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* SECCIÓN BEBIDAS */}
        <section className="mb-16">
          <h3 className="text-center text-3xl font-bold text-[#6f4e37] mb-12">
            Nuestros Cafés
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {cafes.map((cafe) => (
              <Card key={cafe.id} className="w-full max-w-[400px] overflow-hidden shadow-lg border-none hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]">
                <div className="h-[300px] overflow-hidden">
                  <img 
                    src={cafe.imagen} 
                    alt={cafe.nombre} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">{cafe.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-black text-gray-900">S/ {cafe.precio.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="pb-6">
                  <Button 
                    onClick={() => handleAddToCart(cafe.nombre)}
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-7 text-lg font-bold"
                  >
                    Añadir al carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* SECCIÓN POSTRES */}
        <section>
          <h3 className="text-center text-3xl font-bold text-[#6f4e37] mb-12">
            Nuestros Postres
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {postres.map((postre) => (
              <Card key={postre.id} className="w-full max-w-[400px] overflow-hidden shadow-lg border-none hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]">
                <div className="h-[300px] overflow-hidden">
                  <img 
                    src={postre.imagen} 
                    alt={postre.nombre} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">{postre.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-black text-gray-900">S/ {postre.precio.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="pb-6">
                  <Button 
                    onClick={() => handleAddToCart(postre.nombre)}
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-7 text-lg font-bold"
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