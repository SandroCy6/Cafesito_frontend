import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

// Estos son los productos del catálogo con sus rutas originales
const PRODUCTOS_DATA = [
  { id: "1", name: "Café Americano", price: "S/ 3.50", image: "/imagenes/americano.jpg", categoria: "Nuestros Cafés", desc: "Café negro clásico, suave y equilibrado." },
  { id: "2", name: "Café Espresso", price: "S/ 4.50", image: "/imagenes/Espresso.jpg", categoria: "Nuestros Cafés", desc: "Un disparo de energía puro e intenso." },
  { id: "3", name: "Café Latte-Small", price: "S/ 6.00", image: "/imagenes/latte-small.jpg", categoria: "Nuestros Cafés", desc: "Espresso con leche vaporizada y una fina capa de espuma." },
  { id: "4", name: "Galleta Chocochips", price: "S/ 2.00", image: "/imagenes/Chocochip.jpg", categoria: "Nuestros Postres", desc: "Galleta crocante rellena de abundantes chispas de chocolate." },
  { id: "5", name: "Cinnamon Roll", price: "S/ 3.50", image: "/imagenes/cinamon_roll.jpg", categoria: "Nuestros Postres", desc: "Rollo de canela glaseado, recién horneado y esponjoso." },
  { id: "6", name: "Galleta Red Velvet", price: "S/ 7.00", image: "/imagenes/Red_velvet.jpg", categoria: "Nuestros Postres", desc: "Galleta suave de red velvet con chips de chocolate blanco premium." },
];

export default async function DetallePage({ params }: Props) {
  // SOLUCIÓN AL ERROR: Esperamos a que los params carguen
  const resolvedParams = await params; 
  const id = resolvedParams.id;

  const producto = PRODUCTOS_DATA.find((p) => p.id === id);

  if (!producto) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-800">PRODUCTO NO ENCONTRADO</h1>
        <Link href="/catalogo" className="mt-4 text-[#6f4e37] underline font-bold uppercase tracking-widest text-xs">
          Regresar al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf7] py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid md:grid-cols-2 border border-[#f1e9dd]">
        
        {/* SECCIÓN DE IMAGEN: Vinculada al catálogo */}
        <div className="relative h-[450px] md:h-full bg-[#f8f5f0]">
          <img 
            src={producto.image} 
            alt={producto.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
          />
        </div>

        {/* SECCIÓN DE INFORMACIÓN */}
        <div className="p-8 md:p-14 flex flex-col justify-between bg-white">
          <div>
            <div className="flex justify-between items-center mb-8">
              <span className="bg-[#f1e9dd] text-[#6f4e37] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-[#e5d9c5]">
                {producto.categoria}
              </span>
              <span className="text-gray-300 text-xs font-mono font-bold">#00{producto.id}</span>
            </div>

            <h1 className="text-5xl font-black text-[#2d1b0d] mb-6 leading-[0.9] tracking-tighter">
              {producto.name}
            </h1>

            <p className="text-gray-500 text-xl leading-relaxed font-medium italic">
              "{producto.desc}"
            </p>
          </div>

          <div className="border-t-2 border-[#fcfaf7] pt-10 mt-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.3em]">Precio Final</p>
                <p className="text-5xl font-black text-[#6f4e37]">{producto.price}</p>
              </div>
              
              <button className="bg-[#2d1b0d] hover:bg-[#6f4e37] text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest">
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4 flex justify-between items-center">
        <Link href="/catalogo" className="text-gray-400 hover:text-[#6f4e37] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
          ← Regresar a la carta
        </Link>
        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Artia Pastelería • Detalle</span>
      </div>
    </main>
  );
}