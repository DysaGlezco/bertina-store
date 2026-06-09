"use client";

import { useState, useEffect } from "react";
import { getCovers } from "@/lib/supabase";
import type { Cover } from "@/types";
import CoverCard from "./CoverCard";

export default function CoverGrid() {
  const [covers, setCovers] = useState<Cover[] | null>(null);

  useEffect(() => {
    getCovers().then(setCovers);
  }, []);

  // Skeleton mientras carga
  if (covers === null) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-sm overflow-hidden">
            <div className="aspect-[4/5] bg-cream-deep animate-pulse" />
            <div className="py-5 px-4 space-y-2">
              <div className="h-4 bg-cream-deep rounded animate-pulse mx-auto w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (covers.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-xl italic text-warmgray">
          Próximamente nuevas portadas.
        </p>
      </div>
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
