"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm({ switchToLogin }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: any) => {
  e.preventDefault();

  if (!name || !phone || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  // Leer usuarios guardados en localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const exists = users.find((u: any) => u.email === email);

  if (exists) {
    alert("El usuario ya existe");
    return;
  }

  // Guardar con el mismo formato que USUARIOS_MOCK
  const nuevoUsuario = {
    email,
    password,
    nombre: name,
    telefono: phone,
    rol: "Cliente",
    avatar: "https://github.com/shadcn.png"
  };

  users.push(nuevoUsuario);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Usuario registrado correctamente");
  switchToLogin();
};
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#f0ede6" }}
    >
      {/* contenedor */}
      <div className="w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/* izquierda (formulario_registro) — responsive va abajo del logo */}
        <div
          className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-10 md:py-12"
          style={{ background: "#faf8f4" }}
        >
          <div className="w-full max-w-sm">

            <h2
              className="text-3xl font-bold text-gray-900 mb-1 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Crear{" "}
              <em className="not-italic" style={{ color: "#3e4323" }}>
                cuenta
              </em>
            </h2>
            <p className="text-sm text-gray-400 mb-7 font-light">
              Registra tus datos para continuar
            </p>

            <form onSubmit={handleRegister} className="space-y-5">

              {/* campo_nombre */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Nombre
                </label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-[1.5px] border-gray-200 bg-white focus-visible:ring-[#3e4323] focus-visible:border-[#3e4323] placeholder:text-gray-300"
                />
              </div>

              {/* campo_telef */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                  Teléfono
                </label>
                <Input
                  type="text"
                  placeholder="999 999 999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border-[1.5px] border-gray-200 bg-white focus-visible:ring-[#3e4323] focus-visible:border-[#3e4323] placeholder:text-gray-300"
                />
              </div>

              {/* campo_email */}
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

              {/* campo_password */}
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

              {/* botón_registro */}
              <Button
                type="submit"
                className="w-full rounded-xl bg-[#3e4323] hover:bg-[#2c3018] text-white font-medium tracking-wide transition-all duration-200 active:scale-[0.98]"
              >
                Registrarse
              </Button>

            </form>

            {/*footer */}
            <p className="text-xs text-gray-400 text-center mt-6">
              ¿Ya tienes cuenta?{" "}
              <span
                onClick={switchToLogin}
                className="text-[#3e4323] font-semibold cursor-pointer hover:underline"
              >
                Inicia sesión
              </span>
            </p>

          </div>
        </div>

        {/* derecha (logo-harvest) — en mobile va arriba */}
        <div
          className="w-full md:w-1/2 flex flex-col items-center justify-center relative overflow-hidden
                     py-10 md:py-14 px-8 order-first md:order-last"
          style={{ background: "linear-gradient(160deg, #3e4323 0%, #2c3018 100%)" }}
        >
          {/* Círculos decorativos */}
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border-[40px] border-white/5" />
          <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full border-[30px] border-white/5" />

          <img
            src="/logo.jpg"
            alt="Harvest Coffeehouse"
            className="w-28 h-28 md:w-44 md:h-44 object-contain relative z-10"
          />
        </div>

      </div>
    </div>
  );
}