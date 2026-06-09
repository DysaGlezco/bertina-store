import CoverGrid from "@/components/product/CoverGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Elige tu portada y personaliza tu cuaderno. Cuadernos de diseño hechos a mano.",
};

export default function CatalogoPage() {
  return (
    <main>
      <div className="min-h-screen pt-28 pb-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="mb-8">
            <Breadcrumb crumbs={[{ label: "Inicio", href: "/" }, { label: "Catálogo" }]} />
          </div>

          <div className="mb-12 space-y-3">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">
              Elige tu portada
            </p>
            <h1 className="font-serif text-display-lg text-ink">Catálogo</h1>
            <div className="w-12 h-px bg-sage mt-4" />
          </div>

          <div className="mb-10 flex items-center gap-3 px-6 py-4 rounded-sm border border-gold/20 bg-cream-warm">
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <span className="text-gold text-sm">✦</span>
            </div>
            <p className="font-sans text-sm text-warmgray">
              Elige la portada que más te guste.{" "}
              <span className="text-ink font-medium">Luego personalizas el interior a tu medida.</span>
            </p>
          </div>

          <CoverGrid />

        </div>
      </div>
    </main>
  );
}
