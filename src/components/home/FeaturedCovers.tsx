"use client";

import { useState, useEffect } from "react";
import { getFeaturedCovers } from "@/lib/supabase";
import type { Cover } from "@/types";
import CoverCard from "@/components/product/CoverCard";

export default function FeaturedCovers() {
  const [covers, setCovers] = useState<Cover[] | null>(null);

  useEffect(() => {
    getFeaturedCovers().then(setCovers);
  }, []);

  if (covers === null) return null;

  if (covers.length === 0) {
    return (
      <p className="text-center font-serif text-lg italic text-warmgray py-12">
        Próximamente nuevas portadas.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
      {covers.map((cover, i) => (
        <CoverCard key={cover.id} cover={cover} index={i} />
      ))}
    </div>
  );
}
