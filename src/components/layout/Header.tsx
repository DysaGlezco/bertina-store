"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Instagram, Facebook } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Corporativo", href: "/corporativo" },
  { label: "Contacto", href: "/contacto" },
  { label: "Nosotros", href: "/nosotros" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/bertina.store", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/share/1BM23f6SiV/?mibextid=wwXIfr", Icon: Facebook },
];

export default function Header() {
  const { toggleCart, totalItems } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-cream/95 backdrop-blur-sm shadow-[0_1px_20px_rgba(74,56,40,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

          {/* Nav izquierda — desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans text-xs tracking-widest uppercase text-warmgray hover:text-gold transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Logo centro */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity duration-300"
          >
            <Image src="/logo.svg" alt="Bertina" width={50} height={50} priority />
          </Link>

          {/* Derecha: redes (desktop) + carrito + hamburguesa */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Redes sociales — solo desktop */}
            <div className="hidden md:flex items-center gap-4 mr-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-warmgray hover:text-gold transition-colors duration-200"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            {/* Carrito */}
            <button
              onClick={toggleCart}
              aria-label="Abrir carrito"
              className="relative flex items-center text-warmgray hover:text-gold transition-colors duration-200"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold text-white text-[10px] font-sans flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Hamburguesa — solo mobile */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="md:hidden text-warmgray hover:text-gold transition-colors duration-200"
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-cream flex flex-col pt-20 px-8 pb-10 md:hidden"
          >
            {/* Links de navegación */}
            <nav className="flex flex-col items-end gap-6 mt-8">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-3xl font-light text-ink hover:text-gold transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Divisor */}
            <div className="w-12 h-px bg-cream-deep my-10" />

            {/* Redes sociales */}
            <div className="flex items-center gap-5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-warmgray hover:text-gold transition-colors duration-200"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-auto">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center"
                onClick={() => setMenuOpen(false)}
              >
                Escríbenos por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
