import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google"; // Importamos las nuevas fuentes
import "./globals.css";

// Configuración de Playfair Display (Títulos)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair", // Variable CSS para usar en Tailwind
  weight: ["500", "600"],
});

// Configuración de DM Sans (Cuerpo de texto)
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans", // Variable CSS para usar en Tailwind
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Coffee Hub - Premium Experience",
  description: "Disfruta del mejor café artesanal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
