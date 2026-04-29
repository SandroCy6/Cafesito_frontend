"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged");

    if (!isLogged) {
      router.push("/auth"); 
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f2]">
      <h1 className="text-3xl font-bold">
        Bienvenido a Cafesito 
      </h1>
    </div>
  );
}