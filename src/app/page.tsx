import Link from "next/link";
import CoverCard from "@/components/product/CoverCard";
import testimonialsData from "@/data/testimonials.json";
import type { Testimonial } from "@/types";
import HeroSection from "@/components/layout/HeroSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { getCovers, getTestimonials } from "@/lib/supabase";

export default async function HomePage() {
  const [covers, dbTestimonials] = await Promise.all([
    getCovers(),
    getTestimonials(),
  ]);

  const testimonials: Testimonial[] =
    dbTestimonials.length > 0 ? dbTestimonials : (testimonialsData as Testimonial[]);

  const featured = covers.slice(0, 4);

  return (
    <>
      <HeroSection />

      {/* Portadas destacadas */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-section">
        <div className="text-center mb-14 space-y-3">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">
            Colección
          </p>
          <h2 className="font-serif text-display-md text-ink">
            Elige tu portada
          </h2>
          <div className="w-12 h-px bg-sage mx-auto mt-4" />
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {featured.map((cover, i) => (
              <CoverCard key={cover.id} cover={cover} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-center font-serif text-lg italic text-warmgray py-12">
            Próximamente nuevas portadas.
          </p>
        )}

        <div className="text-center mt-14">
          <Link href="/catalogo" className="btn-outline">
            Ver catálogo completo
          </Link>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      {/* Franja valores */}
      <section className="bg-cream-warm border-y border-cream-deep py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { title: "Diseño de autor", body: "Cada pieza es pensada con intención estética y funcional." },
            { title: "Materiales cuidados", body: "Papel de calidad, tapas resistentes y detalles que se notan." },
            { title: "Pedido por WhatsApp", body: "Proceso simple y cercano, sin intermediarios." },
          ].map((item) => (
            <div key={item.title} className="space-y-3">
              <h3 className="font-serif text-xl font-medium text-ink">{item.title}</h3>
              <p className="font-sans text-sm text-warmgray leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
