"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm({ switchToRegister }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // guardar sesión
      localStorage.setItem("isLogged", "true");

      alert("Bienvenido de vuelta a Harvest Coffeehouse");

      //  redirigir al home
      window.location.href = "/";
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#f0ede6" }}
    >
      {/* Contenedor: columna en mobile, fila en desktop */}
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/*  Logo-cafetería: arriba en responsive (h fija), izquierda en desktop */}
        <div
          className="w-full md:w-5/12 flex flex-col items-center justify-center relative overflow-hidden
                     py-10 md:py-14 px-8"
          style={{ background: "linear-gradient(160deg, #3e4323 0%, #2c3018 100%)" }}
        >
          {/* Círculos decorativos */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border-[40px] border-white/5" />
          <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full border-[30px] border-white/5" />

          {/* Logo-cafetería */}
          <img
            src="/logo.jpg"
            alt="Harvest Coffeehouse"
            className="w-28 h-28 md:w-44 md:h-44 object-contain relative z-10"
          />
        </div>

        {/* Panel Formulario: abajo en mobile, derecha en desktop */}
        <div
          className="flex-1 flex items-center justify-center px-6 md:px-8 py-10 md:py-12"
          style={{ background: "#faf8f4" }}
        >
          <div className="w-full max-w-sm">

            <h2
              className="text-3xl font-bold text-gray-900 mb-1 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Bienvenido de{" "}
              <em className="not-italic" style={{ color: "#3e4323" }}>
                vuelta
              </em>
            </h2>
            <p className="text-sm text-gray-400 mb-7 font-light">
              Ingresa tus datos para continuar
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-[1.5px] border-gray-200 bg-white focus-visible:ring-[#3e4323] focus-visible:border-[#3e4323] placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-[1.5px] border-gray-200 bg-white focus-visible:ring-[#3e4323] focus-visible:border-[#3e4323] placeholder:text-gray-300"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                  <input type="checkbox" className="accent-[#3e4323] w-3.5 h-3.5" />
                  Recordarme
                </label>
                <span className="text-[#3e4323] font-medium cursor-pointer hover:underline text-xs">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-[#3e4323] hover:bg-[#2c3018] text-white font-medium tracking-wide transition-all duration-200 active:scale-[0.98]"
              >
                Iniciar sesión
              </Button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              ¿No tienes cuenta?{" "}
              <span
                onClick={switchToRegister}
                className="text-[#3e4323] font-semibold cursor-pointer hover:underline"
              >
                Regístrate
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}