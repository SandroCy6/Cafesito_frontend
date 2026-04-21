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
  password?: string; // El ? significa que es opcional
  nombre: string;
  rol: string;
  avatar: string;
}

// 2. Datos de Productos (Para Persona 2 y 3)
export const PRODUCTOS: Producto[] = [
  {
    id: "1",
    nombre: "Espresso Italiano",
    precio: 2.50,
    categoria: "Clásicos",
    descripcion: "Un disparo de café puro, intenso y con una capa de crema dorada perfecta. Ideal para empezar el día con energía.",
    ingredientes: ["Granos Arábica", "Agua filtrada"],
    imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800",
    stock: 20
  },
  {
    id: "2",
    nombre: "Capuccino de Canela",
    precio: 3.80,
    categoria: "Con Leche",
    descripcion: "Equilibrio ideal entre café espresso, leche vaporizada y una espuma densa espolvoreada con canela fina.",
    ingredientes: ["Espresso", "Leche entera", "Espuma de leche", "Canela"],
    imagen: "https://images.unsplash.com/photo-1534706936160-d5ee67737249?w=800",
    stock: 15
  },
  {
    id: "3",
    nombre: "Latte Macchiato",
    precio: 4.00,
    categoria: "Con Leche",
    descripcion: "Tres capas de puro placer: leche caliente, una mancha de espresso y espuma suave arriba.",
    ingredientes: ["Leche vaporizada", "Espresso", "Espuma de leche"],
    imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
    stock: 12
  },
  {
    id: "4",
    nombre: "Mocha Blanco",
    precio: 4.50,
    categoria: "Especialidades",
    descripcion: "Para los amantes del dulce: espresso combinado con chocolate blanco premium y leche cremosa.",
    ingredientes: ["Espresso", "Chocolate blanco", "Leche", "Crema batida"],
    imagen: "https://images.unsplash.com/photo-1572442313531-901763133649?w=800",
    stock: 8
  },
  {
    id: "5",
    nombre: "Cold Brew Vainilla",
    precio: 4.20,
    categoria: "Fríos",
    descripcion: "Café extraído en frío por 12 horas, resultando en un sabor suave y menos ácido, con un toque de vainilla.",
    ingredientes: ["Café concentrado", "Hielo", "Jarabe de vainilla"],
    imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800",
    stock: 10
  },
  {
    id: "6",
    nombre: "Muffin de Arándanos",
    precio: 2.75,
    categoria: "Repostería",
    descripcion: "El acompañamiento perfecto. Muffin esponjoso relleno de arándanos frescos y toque de limón.",
    ingredientes: ["Harina", "Arándanos", "Azúcar", "Huevo"],
    imagen: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800",
    stock: 25
  }
];

// 3. Datos de Usuario para pruebas (Para Persona 5)
export const MOCK_USER: Usuario = {
  email: "admin@cafeteria.com",
  password: "password123",
  nombre: "Juan Valdez",
  rol: "Cliente Premium",
  avatar: "https://github.com/shadcn.png"
};

// 4. Datos del Carrito (Para Persona 4)
export const MOCK_CARRITO: ItemCarrito[] = [
  {
    ...PRODUCTOS[0], // Copia los datos del Espresso
    cantidad: 2,
    subtotal: 5.00
  },
  {
    ...PRODUCTOS[5], // Copia los datos del Muffin
    cantidad: 1,
    subtotal: 2.75
  }
];