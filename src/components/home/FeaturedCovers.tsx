import type { Cover } from "@/types";
import CoverCard from "@/components/product/CoverCard";

export default function FeaturedCovers({ covers }: { covers: Cover[] }) {
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
