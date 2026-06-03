"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const t = testimonials[active];

  return (
    <section
      className="bg-cream-warm border-y border-cream-deep py-20 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-12"
        >
          Lo que dicen
        </motion.p>

        {/* Comillas decorativas */}
        <div className="relative">
          <span
            aria-hidden
            className="absolute -top-6 left-1/2 -translate-x-1/2 font-serif text-8xl text-cream-deep leading-none select-none"
          >
            "
          </span>

          {/* Cita */}
          <div className="min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-serif text-xl md:text-2xl font-light text-ink leading-relaxed max-w-2xl mx-auto"
              >
                {t.text}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Autor */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`author-${t.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-8 space-y-1"
            >
              <div className="w-8 h-px bg-gold mx-auto mb-4" />
              <p className="font-sans text-sm font-medium text-ink tracking-wide">
                {t.name}
              </p>
              <p className="font-sans text-xs text-warmgray tracking-widest uppercase">
                {t.location}
                {t.product && (
                  <span className="text-warmgray-light"> · {t.product}</span>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots de navegación */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Testimonio ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                active === i
                  ? "w-5 h-1.5 bg-gold"
                  : "w-1.5 h-1.5 bg-warmgray-light hover:bg-warmgray"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
