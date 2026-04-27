import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
// Playfair Display → títulos (--font-playfair)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600"],
  display: "swap",
});

// DM Sans → cuerpo de texto (--font-dm-sans)
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Un Cafecito... | Café Artesanal en Ica",
  description:
    "Celebramos los pequeños momentos con el sabor del mejor café artesanal. Delivery en toda la ciudad de Ica, Perú.",
  keywords: ["café", "artesanal", "Ica", "Perú", "delivery", "cafetería"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F5ECD7] font-sans text-[#3B1A08]">
        <Navbar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
