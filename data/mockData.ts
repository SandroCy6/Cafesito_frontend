// 1. Definimos el "molde" de los datos para que todo el equipo lo use
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion: string;
  ingredientes: string[];
  imagen: string;
  stock: number;
}

export interface ItemCarrito extends Producto {
  cantidad: number;
  subtotal: number;
}

export interface Usuario {
  email: string;
  password?: string;
  nombre: string;
  rol: string;
  avatar: string;
}

// 2. Datos de Productos Unificados (Originales + Compañero)
export const PRODUCTOS: Producto[] = [
  // --- PRODUCTOS ORIGINALES (IDs 1-6) ---
  {
    id: "1",
    nombre: "Espresso Italiano",
    precio: 2.50,
    categoria: "Clásicos",
    descripcion: "Un disparo de café puro, intenso y con una capa de crema dorada perfecta.",
    ingredientes: ["Granos Arábica", "Agua filtrada"],
    imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800",
    stock: 20
  },
  {
    id: "2",
    nombre: "Capuccino de Canela",
    precio: 3.80,
    categoria: "Con Leche",
    descripcion: "Equilibrio ideal entre café espresso, leche vaporizada y una espuma densa.",
    ingredientes: ["Espresso", "Leche entera", "Espuma de leche", "Canela"],
    imagen: "https://images.unsplash.com/photo-1534706936160-d5ee67737249?w=800",
    stock: 15
  },
  {
    id: "3",
    nombre: "Latte Macchiato",
    precio: 4.00,
    categoria: "Con Leche",
    descripcion: "Tres capas de puro placer: leche caliente, una mancha de espresso y espuma suave.",
    ingredientes: ["Leche vaporizada", "Espresso", "Espuma de leche"],
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
    stock: 12
  },
  {
    id: "4",
    nombre: "Mocha Blanco",
    precio: 4.50,
    categoria: "Especialidades",
    descripcion: "Espresso combinado con chocolate blanco premium y leche cremosa.",
    ingredientes: ["Espresso", "Chocolate blanco", "Leche", "Crema batida"],
    imagen: "https://images.unsplash.com/photo-1572442313531-901763133649?w=800",
    stock: 8
  },
  {
    id: "5",
    nombre: "Cold Brew Vainilla",
    precio: 4.20,
    categoria: "Fríos",
    descripcion: "Café extraído en frío por 12 horas, suave y con un toque de vainilla.",
    ingredientes: ["Café concentrado", "Hielo", "Jarabe de vainilla"],
    imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800",
    stock: 10
  },
  {
    id: "6",
    nombre: "Muffin de Arándanos",
    precio: 2.75,
    categoria: "Repostería",
    descripcion: "Muffin esponjoso relleno de arándanos frescos y toque de limón.",
    ingredientes: ["Harina", "Arándanos", "Azúcar", "Huevo"],
    imagen: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800",
    stock: 25
  },

  // --- PRODUCTOS NUEVOS DEL COMPAÑERO ---
  {
    id: "7",
    nombre: "Café Americano",
    precio: 3.50,
    categoria: "Clásicos",
    descripcion: "Café suave y equilibrado, ideal para disfrutar en cualquier momento.",
    ingredientes: ["Espresso", "Agua caliente"],
    imagen: "/imagenes/americano.jpg",
    stock: 20
  },
  {
    id: "8",
    nombre: "Café Espresso Local",
    precio: 4.50,
    categoria: "Clásicos",
    descripcion: "Espresso intenso con granos de selección local.",
    ingredientes: ["Granos locales", "Agua filtrada"],
    imagen: "/imagenes/Espresso.jpg",
    stock: 15
  },
  {
    id: "9",
    nombre: "Café Latte-Small",
    precio: 6.00,
    categoria: "Con Leche",
    descripcion: "Versión pequeña de nuestro latte clásico con leche vaporizada.",
    ingredientes: ["Leche", "Espresso"],
    imagen: "/imagenes/latte-small.jpg",
    stock: 12
  },
  {
    id: "10",
    nombre: "Galleta Chocochips",
    precio: 2.00,
    categoria: "Repostería",
    descripcion: "Clásica galleta con trozos generosos de chocolate.",
    ingredientes: ["Harina", "Chocolate"],
    imagen: "/imagenes/Chocochip.jpg",
    stock: 30
  },
  {
    id: "11",
    nombre: "Cinnamon Roll",
    precio: 3.50,
    categoria: "Repostería",
    descripcion: "Rollito de canela recién horneado con glaseado suave.",
    ingredientes: ["Canela", "Masa madre"],
    imagen: "/imagenes/cinamon_roll.jpg",
    stock: 10
  },
  {
    id: "12",
    nombre: "Galleta Red Velvet",
    precio: 7.00,
    categoria: "Repostería",
    descripcion: "Galleta gourmet de terciopelo rojo y chispas de chocolate blanco.",
    ingredientes: ["Cacao", "Chocolate blanco"],
    imagen: "/imagenes/Red_velvet.jpg",
    stock: 15
  }
];

// 3. Exportamos las listas filtradas (Esto evita que el compañero rompa su catálogo)
export const cafes = PRODUCTOS.filter(p => p.categoria !== "Repostería");
export const postres = PRODUCTOS.filter(p => p.categoria === "Repostería");

// 4. Datos de Usuario y Carrito para pruebas
export const MOCK_USER: Usuario = {
  email: "admin@cafeteria.com",
  nombre: "Juan Valdez",
  rol: "Cliente Premium",
  avatar: "https://github.com/shadcn.png"
};

export const MOCK_CARRITO: ItemCarrito[] = [
  { ...PRODUCTOS[0], cantidad: 2, subtotal: 5.00 },
  { ...PRODUCTOS[5], cantidad: 1, subtotal: 2.75 }
];