"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cream-warm" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-lavender/20 blur-3xl" />
        <div className="absolute top-32 right-1/4 w-32 h-32 rounded-full bg-blush/15 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div className="space-y-8">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="font-sans text-xs tracking-[0.35em] uppercase text-sage"
          >
            Papelería de diseño
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.35}
            className="font-serif text-display-xl text-ink leading-[1.05]"
          >
            Escribe con
            <br />
            <em className="text-sage not-italic">intención</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="font-sans text-base text-warmgray leading-relaxed max-w-sm"
          >
            Cuadernos y papelería pensados para quienes valoran los detalles.
            Cada pieza, una excusa para escribir más.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.65}
            className="flex items-center gap-5"
          >
            <Link href="/catalogo" className="btn-primary">
              Explorar catálogo
            </Link>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Contactar →
            </a>
          </motion.div>
        </div>

        {/* Imagen hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-cream-deep">
            {/* Placeholder — reemplaza con tu imagen real */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="font-serif text-2xl italic text-warmgray-light text-center px-8">
                Tu foto de producto<br />aquí
              </p>
            </div>
          </div>

          {/* Badge flotante */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(44,40,37,0.12)] p-5 max-w-[180px]"
          >
            <p className="font-serif text-sm italic text-ink leading-snug">
              "Hecho para quien ama escribir"
            </p>
            <div className="w-8 h-px bg-sage mt-3" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
