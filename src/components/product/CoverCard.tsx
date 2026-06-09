"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Cover } from "@/types";

interface Props {
  cover: Cover;
  index?: number;
}

export default function CoverCard({ cover, index = 0 }: Props) {
  const image = cover.images[0] ?? "/images/covers/placeholder.jpg";

  return (
    <motion.div
      className="card-product group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link href={`/configurar?slug=${cover.slug}`} className="block">
        {/* Imagen */}
        <div className="relative overflow-hidden aspect-[4/5] bg-cream-warm">
          <Image
            src={image}
            alt={cover.name}
            fill
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 ease-elegant group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Info centrada */}
        <div className="py-5 px-4 flex flex-col items-center text-center">
          <h3 className="font-serif text-xl font-medium text-ink group-hover:text-gold transition-colors duration-200 leading-tight">
            {cover.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
