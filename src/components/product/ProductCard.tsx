"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/whatsapp";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      className="card-product group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Imagen */}
      <Link href={`/producto/${product.slug}`} className="block overflow-hidden aspect-[4/5] bg-cream-warm">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={400}
          height={500}
          className="w-full h-full object-cover transition-transform duration-700 ease-elegant group-hover:scale-[1.04]"
        />
      </Link>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Link href={`/producto/${product.slug}`}>
              <h3 className="font-serif text-lg font-medium text-ink hover:text-sage transition-colors duration-200 leading-tight">
                {product.name}
              </h3>
            </Link>
            <p className="font-sans text-xs text-warmgray capitalize tracking-wide">
              {product.category}
            </p>
          </div>
          <p className="font-serif text-lg text-ink whitespace-nowrap">
            {formatCurrency(product.price)}
          </p>
        </div>

        <p className="font-sans text-sm text-warmgray mt-3 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* CTA */}
        <button
          onClick={() => addItem(product)}
          disabled={!product.inStock}
          className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-ink/20 text-xs font-sans tracking-widest uppercase text-ink transition-all duration-300 hover:bg-ink hover:text-cream hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed group/btn"
        >
          <ShoppingBag size={13} strokeWidth={1.5} className="transition-transform duration-300 group-hover/btn:scale-110" />
          {product.inStock ? "Añadir al carrito" : "Agotado"}
        </button>
      </div>
    </motion.div>
  );
}
