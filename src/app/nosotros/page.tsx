import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce la historia detrás de Bertina Store. Una sola persona, un amor de toda la vida por la papelería de diseño.",
};

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Breadcrumb crumbs={[{ label: "Inicio", href: "/" }, { label: "Nosotros" }]} />
          </div>
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-6">
            Detrás de cada pieza
          </p>
          <h1 className="font-serif text-display-lg text-ink leading-tight max-w-2xl">
            Cada pieza que recibes<br />
            <em className="text-sage not-italic">pasó por mis manos.</em><br />
            Solo las mías.
          </h1>
          <div className="w-12 h-px bg-gold mt-8" />
        </div>
      </section>

      {/* Origen */}
      <section className="py-20 px-6 bg-cream-warm border-t border-cream-deep">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-5">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">El origen</p>
            <h2 className="font-serif text-display-md text-ink">Un amor que<br />empezó de niña</h2>
            <div className="w-8 h-px bg-sage" />
          </div>
          <div className="space-y-5">
            <p className="font-sans text-base text-warmgray leading-relaxed">
              Desde pequeña no coleccionaba juguetes — coleccionaba cuadernos, etiquetas, pegatinas. No siempre para usarlos, sino porque algo en ellos le parecía irresistible.
            </p>
            <p className="font-sans text-base text-warmgray leading-relaxed">
              La textura del papel, el detalle de una cubierta, el peso de un buen bolígrafo. Bertina es la continuación natural de ese impulso que nunca desapareció.
            </p>
          </div>
        </div>
      </section>

      {/* Quién hay detrás */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">Quién soy</p>
          <h2 className="font-serif text-display-md text-ink">Dysaglezco</h2>
          <div className="w-8 h-px bg-sage mx-auto" />
          <p className="font-sans text-base text-warmgray leading-relaxed">
            Soy diseñadora, apasionada por los patrones y la ilustración, y trabajo cada pieza a mano desde mi espacio.
          </p>
          <p className="font-sans text-base text-warmgray leading-relaxed">
            No hay equipo, no hay fábrica — hay una persona que elige los materiales, diseña, produce y empaca cada pedido con el mismo cuidado que le pondría a algo que hace para ella misma.
          </p>
        </div>
      </section>

      {/* Por qué existe */}
      <section className="py-20 px-6 bg-cream-warm border-t border-cream-deep">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-5">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">Por qué existe Bertina</p>
            <h2 className="font-serif text-display-md text-ink">Hecha porque<br />yo misma<br />la necesitaba</h2>
            <div className="w-8 h-px bg-sage" />
          </div>
          <div className="space-y-5">
            <p className="font-sans text-base text-warmgray leading-relaxed">
              En mi entorno, encontrar papelería de este tipo — con diseño de autor, con intención, con materiales que se notan — es casi imposible.
            </p>
            <p className="font-sans text-base text-warmgray leading-relaxed">
              Bertina existe porque yo misma la necesitaba, y porque creo que hay más personas que sienten lo mismo.
            </p>
          </div>
        </div>
      </section>

      {/* Cita decorativa */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="font-serif text-2xl md:text-3xl font-light text-ink leading-relaxed italic">
            "Me encanta hablar de papel."
          </p>
          <div className="w-8 h-px bg-gold mx-auto" />
          <p className="font-sans text-sm text-warmgray leading-relaxed">
            Si tienes alguna pregunta, una idea para personalizar o simplemente quieres saber más sobre cómo se hace algo, escríbeme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/catalogo" className="btn-outline">
              Ver catálogo
            </Link>
            <a
              href="https://wa.me/5358732088"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Escribirme por WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
