"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/whatsapp";
import type { Product } from "@/types";
import { useState } from "react";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen pt-24 pb-section">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-cream-warm sticky top-24"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={750}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="pt-8 space-y-8"
          >
            <div className="space-y-2">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray capitalize">
                {product.category}
              </p>
              <h1 className="font-serif text-display-md text-ink">{product.name}</h1>
              <p className="font-serif text-3xl font-light text-ink mt-3">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="w-12 h-px bg-sage" />

            <p className="font-sans text-base text-warmgray leading-relaxed">
              {product.description}
            </p>

            {/* Detalles */}
            {product.details && product.details.length > 0 && (
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex items-center gap-3 font-sans text-sm text-warmgray">
                    <span className="w-1 h-1 rounded-full bg-sage flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div className="pt-4">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`btn-primary w-full transition-all duration-300 ${
                  added ? "bg-sage" : ""
                }`}
              >
                {added ? (
                  <>
                    <Check size={15} />
                    Añadido al carrito
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} strokeWidth={1.5} />
                    {product.inStock ? "Añadir al carrito" : "Agotado"}
                  </>
                )}
              </button>

              <p className="font-sans text-xs text-warmgray-light text-center mt-4 leading-relaxed">
                Al finalizar tu selección te conectaremos con nosotros por WhatsApp
                para confirmar tu pedido.
              </p>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-cream-warm font-sans text-xs text-warmgray"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
