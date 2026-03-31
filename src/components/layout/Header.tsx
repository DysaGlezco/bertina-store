"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function Header() {
  const { toggleCart, totalItems } = useCart();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-sm shadow-[0_1px_20px_rgba(44,40,37,0.06)]"
          : "bg-transparent"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Nav izquierda */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/catalogo"
            className="font-sans text-xs tracking-widest uppercase text-warmgray hover:text-ink transition-colors duration-200"
          >
            Catálogo
          </Link>
          <Link
            href="/catalogo?category=novedades"
            className="font-sans text-xs tracking-widest uppercase text-warmgray hover:text-ink transition-colors duration-200"
          >
            Novedades
          </Link>
        </nav>

        {/* Logo centro */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-light tracking-[0.15em] text-ink hover:text-sage transition-colors duration-300"
        >
          Bertina
        </Link>

        {/* Carrito derecha */}
        <div className="ml-auto">
          <button
            onClick={toggleCart}
            aria-label="Abrir carrito"
            className="relative flex items-center gap-2 text-warmgray hover:text-ink transition-colors duration-200 group"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-sage text-white text-[10px] font-sans flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
