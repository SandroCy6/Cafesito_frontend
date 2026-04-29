"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

// Importación dinámica del Sidebar para evitar errores de hidratación
const CarritoSidebar = dynamic(
  () =>
    import("@/components/carrito/CarritoSidebar").then(
      (mod) => mod.CarritoSidebar,
    ),
  { ssr: false },
);

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#4F6130]/30 bg-[#3D4A24]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/logo.png"
              alt="Logo Cafetería Harvest"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-[12px] font-semibold tracking-wide text-[#C4D4A0]">
              Cafetería
            </p>
            <p className="text-[15px] font-extrabold tracking-widest text-white">
              HARVEST
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? "bg-[#C4D4A0] text-[#3D4A24]"
                  : "text-[#C4D4A0]/80 hover:bg-[#4F6130] hover:text-[#C4D4A0]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* USAMOS TU COMPONENTE PROFESIONAL AQUÍ */}
          <CarritoSidebar />

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B3A2A] md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-[#4F6130]/40 bg-[#3D4A24] px-6 pb-4 md:hidden">
          <ul className="mt-3 space-y-1">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium ${
                    pathname === href
                      ? "bg-[#C4D4A0] text-[#3D4A24]"
                      : "text-[#C4D4A0]/70 hover:bg-[#4F6130] hover:text-[#C4D4A0]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
