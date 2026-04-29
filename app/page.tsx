"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Coffee,
  CheckCircle2,
  Smile,
  Zap,
  Users,
  Leaf,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

// ── Importamos los datos reales ──────────────────────────────────────────────
import { PRODUCTOS, cafes } from "@/data/mockData";

// ── Variantes de animación ────────────────────────────────────────────────────
// ease debe ser una tupla [number,number,number,number] (cubic-bezier), no number[]
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// ── Datos de beneficios ───────────────────────────────────────────────────────
const BENEFICIOS = [
  {
    icon: Zap,
    titulo: "Energía y concentración",
    desc: "La cafeína activa tu mente y mejora el rendimiento cognitivo para afrontar el día.",
  },
  {
    icon: Users,
    titulo: "Interacción social",
    desc: "El café crea momentos de conexión real; una excusa perfecta para reunirse.",
  },
  {
    icon: Leaf,
    titulo: "Rico en antioxidantes",
    desc: "Nuestros granos artesanales están cargados de compuestos que cuidan tu salud.",
  },
  {
    icon: Smile,
    titulo: "Mejora el estado de ánimo",
    desc: "Cada taza libera dopamina de forma natural, haciendo tu día más luminoso.",
  },
];

// ── Productos destacados: primeros 3 cafés de mockData ───────────────────────
const DESTACADOS = cafes.slice(0, 3);

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLogged = localStorage.getItem("isLogged");
    if (!isLogged) {
      router.replace("/auth"); // replace en vez de push
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) return null;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO — Dos columnas
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#F4F7EE]">
        {/* Decoración de fondo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#C4D4A0]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#4F6130]/15 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* Texto */}
          <motion.div
            variants={stagger}
            initial={false}
            animate="show"
            className="space-y-7"
          >
            <motion.div variants={fadeUp}>
              <Badge className="border-[#C4D4A0]/40 bg-white text-[#3D4A24] text-xs font-medium px-3 py-1 shadow-none">
                <Coffee size={11} className="mr-1.5 text-[#4F6130]" />
                Cafetería de especialidad · Ica, Perú
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-[#3D4A24] sm:text-5xl lg:text-[3.4rem]"
            >
              Bienvenidos a{" "}
              <span className="relative inline-block">
                Cafetería Harbest
                <span className="text-[#4F6130]">.</span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[#4F6130]/30"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-md text-base leading-relaxed text-[#4F6130]/85"
            >
              En nuestra cafetería celebramos los pequeños momentos que hacen
              grande la vida. Cada taza es una experiencia cuidada con pasión y
              el sabor del mejor café artesanal.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button
                asChild
                className="gap-2 rounded-xl bg-[#3D4A24] px-7 py-6 text-sm font-semibold text-[#F4F7EE] shadow-none hover:bg-[#4F6130] active:scale-[0.98] transition-all"
              >
                <Link href="/catalogo">
                  Ver productos
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="gap-2 rounded-xl border-[#C4D4A0]/40 bg-white px-7 py-6 text-sm font-semibold text-[#3D4A24] shadow-none hover:bg-[#F4F7EE] transition-all"
              >
                <Link href="/nosotros">Nuestra historia</Link>
              </Button>
            </motion.div>

            {/* Mini stats */}
            <motion.div variants={fadeUp} className="flex gap-8 pt-2">
              {[
                { valor: `${ PRODUCTOS.length } +`, label: "Variedades" },
              {valor: "4.9", label: "Valoración media", icon: Star },
              {valor: "500+", label: "Clientes felices" },
              ].map(({valor, label, icon: Icon }) => (
              <div key={label} className="space-y-0.5">
                <p className="flex items-center gap-1 text-xl font-bold text-[#3D4A24]">
                  {Icon && (
                    <Icon
                      size={14}
                      className="text-[#4F6130]"
                      fill="#4F6130"
                    />
                  )}
                  {valor}
                </p>
                <p className="text-xs text-[#4F6130]/70">{label}</p>
              </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Imagen */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-[#3D4A24]/10">
              <Image
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
                alt="Taza de café artesanal en Cafetería Harvest"
                width={800}
                height={600}
                className="h-[420px] w-full object-cover lg:h-[500px]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D4A24]/20 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-[#C4D4A0]/40 bg-white px-4 py-3 shadow-lg shadow-[#3D4A24]/08">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3E6]">
                <Coffee
                  size={18}
                  className="text-[#4F6130]"
                  strokeWidth={1.8}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#3D4A24]">
                  Granos de origen único
                </p>
                <p className="text-[11px] text-[#4F6130]/70">
                  Tostado artesanal local
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BENEFICIOS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-12 text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-[#3D4A24] sm:text-4xl"
            >
              Nuestros valores
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight text-[#3D4A24] sm:text-4xl"
            >
              ¿Por qué elegir nuestro café?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#4F6130]/70"
            >
              Más que una bebida, cada taza es un ritual cuidado desde el grano
              hasta la taza.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {BENEFICIOS.map(({ icon: Icon, titulo, desc }) => (
              <motion.div
                key={titulo}
                variants={fadeUp}
                className="group rounded-2xl border border-[#C4D4A0]/40 bg-[#F8FAF3] p-6 transition-all hover:border-[#4F6130]/40 hover:shadow-md hover:shadow-[#3D4A24]/05"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF3E6] transition-colors group-hover:bg-[#4F6130]/10">
                  <Icon
                    size={20}
                    strokeWidth={1.6}
                    className="text-[#4F6130]"
                  />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-[#3D4A24]">
                  {titulo}
                </h3>
                <p className="text-xs leading-relaxed text-[#4F6130]/70">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRODUCTOS DESTACADOS (datos reales de mockData)
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#F4F7EE] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <motion.p
                variants={fadeUp}
                className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#4F6130]"
              >
                Lo más pedido
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-bold tracking-tight text-[#3D4A24]"
              >
                Nuestros favoritos
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-[#C4D4A0]/40 bg-white text-sm font-medium text-[#3D4A24] shadow-none hover:bg-[#C4D4A0]/20 transition-all"
              >
                <Link href="/catalogo">
                  Ver catálogo completo
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {DESTACADOS.map((producto) => (
              <motion.div
                key={producto.id}
                variants={fadeUp}
                className="group overflow-hidden rounded-2xl border border-[#C4D4A0]/40 bg-white transition-all hover:shadow-lg hover:shadow-[#3D4A24]/08"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D4A24]/30 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#3D4A24] backdrop-blur-sm">
                    {producto.categoria}
                  </span>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-semibold text-[#3D4A24]">
                      {producto.nombre}
                    </p>
                    <p className="mt-0.5 line-clamp-1 max-w-[180px] text-xs text-[#4F6130]/60">
                      {producto.descripcion}
                    </p>
                  </div>
                  <p className="shrink-0 text-base font-bold text-[#3D4A24]">
                    S/ {producto.precio.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BANNER CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#3D4A24] py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center"
        >
          <motion.div
            variants={fadeUp}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C4D4A0]"
          >
            <Coffee size={26} strokeWidth={1.6} className="text-[#3D4A24]" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold tracking-tight text-white"
          >
            Tu próxima taza te está esperando
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm leading-relaxed text-[#C4D4A0]/80"
          >
            Pide ahora por delivery y recíbelo en la puerta de tu casa. Envío
            gratis en toda la ciudad de Ica.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-3"
          >
            <Button
              asChild
              className="gap-2 rounded-xl bg-[#C4D4A0] px-8 py-6 text-sm font-semibold text-[#3D4A24] shadow-none hover:bg-white transition-all"
            >
              <Link href="/catalogo">
                Hacer mi pedido
                <ArrowRight size={15} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 rounded-xl border-[#C4D4A0]/30 bg-transparent px-8 py-6 text-sm font-semibold text-[#C4D4A0] hover:bg-[#C4D4A0]/10 transition-all"
            >
              <Link href="/contacto">Contáctanos</Link>
            </Button>
          </motion.div>

          <motion.ul
            variants={stagger}
            className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-[#C4D4A0]/70"
          >
            {[
              "Envío gratis",
              "Pago contra entrega",
              "Preparación al momento",
            ].map((item) => (
              <motion.li
                key={item}
                variants={fadeUp}
                className="flex items-center gap-1.5"
              >
                <CheckCircle2 size={13} className="text-[#C4D4A0]" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOTÓN FLOTANTE WHATSAPP
      ══════════════════════════════════════════════════════════ */}
      <a
        href="https://wa.me/51987654321?text=Hola%2C%20quisiera%20hacer%20un%20pedido"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/20 transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}

