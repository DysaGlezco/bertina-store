import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Corporativo",
  description: "Papelería personalizada para empresas y marcas. Cuadernos, tarjetas de presentación y pegatinas con el sello Bertina.",
};

const products = [
  {
    icon: "✦",
    title: "Cuadernos",
    desc: "Personalizados con portada, laminado, tipo de contenido y encuadernado a elección. Perfectos para regalar o usar en tu empresa.",
    cta: "Explorar",
    href: "/catalogo",
    whatsapp: false,
  },
  {
    icon: "◈",
    title: "Tarjetas de presentación",
    desc: "Una cara o dos caras, con acabados brillante, mate, holográfico, hilo o foil. Precio en tiempo real según la cantidad.",
    cta: "Configurar",
    href: "/corporativo/tarjetas",
    whatsapp: false,
  },
  {
    icon: "◉",
    title: "Pegatinas para marcas",
    desc: "Vinilo, papel o transparente para etiquetar tus productos y paquetes. Contáctanos para una cotización personalizada.",
    cta: "Cotizar",
    href: "https://wa.me/5358732088?text=Hola%2C%20me%20interesan%20pegatinas%20para%20mi%20marca.",
    whatsapp: true,
  },
];

const steps = [
  { step: "01", label: "Configura o contáctanos", body: "Usa el configurador para cuadernos y tarjetas, o escríbenos por WhatsApp para pegatinas y proyectos especiales." },
  { step: "02", label: "Propuesta y diseño", body: "Te enviamos una propuesta con opciones de diseño, materiales y precio." },
  { step: "03", label: "Producción", body: "Aprobado el diseño, iniciamos la producción artesanal de cada pieza." },
  { step: "04", label: "Entrega", body: "Coordinamos la entrega con el cuidado y presentación que tu marca merece." },
];

export default function CorporativoPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Breadcrumb crumbs={[{ label: "Inicio", href: "/" }, { label: "Corporativo" }]} />
          </div>
          <div className="space-y-3">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">
              Para empresas y marcas
            </p>
            <h1 className="font-serif text-display-lg text-ink">
              Papelería que habla por tu marca
            </h1>
            <div className="w-12 h-px bg-sage mt-4" />
          </div>
          <p className="font-sans text-base text-warmgray leading-relaxed max-w-xl mt-6">
            Diseñamos y producimos papelería personalizada para empresas que entienden que los detalles construyen marca.
          </p>
        </div>
      </div>

      {/* Productos */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">Productos</p>
            <h2 className="font-serif text-display-md text-ink">¿Qué hacemos?</h2>
            <div className="w-12 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.title} className="flex flex-col space-y-4 p-8 border border-cream-deep rounded-2xl">
                <span className="text-gold text-xl">{p.icon}</span>
                <h3 className="font-serif text-xl font-medium text-ink">{p.title}</h3>
                <p className="font-sans text-sm text-warmgray leading-relaxed flex-1">{p.desc}</p>
                {p.whatsapp ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-center text-sm"
                  >
                    {p.cta}
                  </a>
                ) : (
                  <Link href={p.href} className="btn-primary text-center text-sm">
                    {p.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-24 px-6 bg-cream-warm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">Proceso</p>
            <h2 className="font-serif text-display-md text-ink">Así trabajamos</h2>
            <div className="w-12 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="space-y-3">
                <p className="font-serif text-4xl font-light text-warmgray-light">{s.step}</p>
                <h3 className="font-sans text-sm font-medium tracking-wide text-ink uppercase">{s.label}</h3>
                <p className="font-sans text-sm text-warmgray leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-lg mx-auto space-y-6">
          <h2 className="font-serif text-display-md text-ink">Hablemos de tu proyecto</h2>
          <p className="font-sans text-sm text-warmgray leading-relaxed">
            ¿Tienes un proyecto especial o necesitas una cotización a medida? Escríbenos directamente.
          </p>
          <a
            href="https://wa.me/5358732088?text=Hola%2C%20me%20interesa%20papeler%C3%ADa%20corporativa%20para%20mi%20empresa."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            Iniciar conversación por WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
}
