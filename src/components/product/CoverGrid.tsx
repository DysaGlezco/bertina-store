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

  if (covers === null) return null;

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
