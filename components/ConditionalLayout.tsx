"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RUTAS_SIN_LAYOUT = ["/auth"];

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sinLayout = RUTAS_SIN_LAYOUT.includes(pathname);

  return (
    <>
      {!sinLayout && <Navbar />}
      <main className="flex-1">{children}</main>
      {!sinLayout && <Footer />}
    </>
  );
}