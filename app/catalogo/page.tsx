"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cafes = [
  { id: 1, name: "Café Americano", price: "S/ 3.50", image: "/imagenes/americano.jpg" },
  { id: 2, name: "Café Espresso", price: "S/ 4.50", image: "/imagenes/Espresso.jpg" },
  { id: 3, name: "Café Latte-Small", price: "S/ 6.00", image: "/imagenes/latte-small.jpg" },
];

const postres = [
  { id: 4, name: "Galleta Chocochips", price: "S/ 2.00", image: "/imagenes/Chocochip.jpg" },
  { id: 5, name: "Cinnamon Roll", price: "S/ 3.50", image: "/imagenes/cinamon_roll.jpg" },
  { id: 6, name: "Galleta Red Velvet", price: "S/ 7.00", image: "/imagenes/Red_velvet.jpg" },
];

export default function CatalogoPage() {
  
  // Esta función luego la conectará la Persona 4 (Carrito)
  const handleAddToCart = (productName: string) => {
    console.log(`Añadido al carrito: ${productName}`);
    // Aquí la Persona 4 agregará la lógica del estado global o context
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Encabezado principal */}
      <div className="bg-[#f1e9dd] py-6 mb-10">
        <h2 className="text-center text-3xl font-bold text-[#6f4e37] tracking-wider">
          PRODUCTOS
        </h2>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* SECCIÓN BEBIDAS */}
        <section className="mb-16">
          <h3 className="text-center text-2xl font-bold text-[#6f4e37] mb-8">
            Nuestros Cafés
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {cafes.map((cafe) => (
              <Card key={cafe.id} className="w-full max-w-[400px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="h-[300px] overflow-hidden">
                  <img 
                    src={cafe.image} 
                    alt={cafe.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-800">{cafe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black text-gray-900">{cafe.price}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleAddToCart(cafe.name)}
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-6 text-md"
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
          <h3 className="text-center text-2xl font-bold text-[#6f4e37] mb-8">
            Nuestros Postres
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {postres.map((postre) => (
              <Card key={postre.id} className="w-full max-w-[400px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="h-[300px] overflow-hidden">
                  <img 
                    src={postre.image} 
                    alt={postre.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-800">{postre.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-black text-gray-900">{postre.price}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleAddToCart(postre.name)}
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-6 text-md"
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