import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Corporativo",
  description: "Papelería personalizada para empresas, eventos y marcas. Cuadernos corporativos, regalos empresariales y papelería de marca con el sello Bertina.",
};

const services = [
  {
    icon: "✦",
    title: "Cuadernos corporativos",
    body: "Cuadernos con el logo y colores de tu empresa. Perfectos como obsequio para clientes, empleados o lanzamientos de marca.",
  },
  {
    icon: "✦",
    title: "Kits de bienvenida",
    body: "Paquetes de papelería diseñados para recibir a nuevos empleados o clientes con clase: cuadernos, libretas de notas y accesorios a tono.",
  },
  {
    icon: "✦",
    title: "Papelería para eventos",
    body: "Desde convenciones hasta lanzamientos de producto: diseñamos y producimos la papelería que hace que tu evento se vea distinto.",
  },
  {
    icon: "✦",
    title: "Sets de regalo empresarial",
    body: "Cuadernos elegantemente empacados, pensados para impresionar a tus aliados, clientes o equipo en fechas especiales.",
  },
];

const steps = [
  { step: "01", label: "Cuéntanos tu idea", body: "Escríbenos por WhatsApp con el concepto, cantidad aproximada y fecha de entrega." },
  { step: "02", label: "Propuesta y diseño", body: "Te enviamos una propuesta con opciones de diseño, materiales y precio." },
  { step: "03", label: "Producción", body: "Aprobado el diseño, iniciamos la producción artesanal de cada pieza." },
  { step: "04", label: "Entrega", body: "Coordinamos la entrega con el cuidado y presentación que tu marca merece." },
];

export default function CorporativoPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-cream-warm" />
          <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-sage/10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="mb-8">
            <Breadcrumb crumbs={[{ label: "Inicio", href: "/" }, { label: "Corporativo" }]} />
          </div>
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-6">
            Para empresas y marcas
          </p>
          <h1 className="font-serif text-display-lg text-ink leading-tight max-w-2xl">
            Papelería que habla<br />
            <em className="text-sage not-italic">por tu marca</em>
          </h1>
          <div className="w-12 h-px bg-gold mt-8 mb-8" />
          <p className="font-sans text-base text-warmgray leading-relaxed max-w-xl">
            Diseñamos y producimos papelería personalizada para empresas que entienden que los detalles construyen marca. Desde cuadernos corporativos hasta kits de bienvenida, cada pieza lleva la identidad de tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a
              href="https://wa.me/5358732088?text=Hola%2C%20me%20interesa%20papeler%C3%ADa%20corporativa%20para%20mi%20empresa."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Solicitar cotización
            </a>
            <Link href="/catalogo" className="btn-ghost">
              Ver catálogo →
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">Servicios</p>
            <h2 className="font-serif text-display-md text-ink">¿Qué podemos hacer por ti?</h2>
            <div className="w-12 h-px bg-sage mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {services.map((s) => (
              <div key={s.title} className="space-y-3">
                <span className="text-gold text-lg">{s.icon}</span>
                <h3 className="font-serif text-xl font-medium text-ink">{s.title}</h3>
                <p className="font-sans text-sm text-warmgray leading-relaxed">{s.body}</p>
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

      {/* CTA final */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-lg mx-auto space-y-6">
          <h2 className="font-serif text-display-md text-ink">
            Hablemos de tu proyecto
          </h2>
          <p className="font-sans text-sm text-warmgray leading-relaxed">
            Cuéntanos sobre tu empresa, la cantidad que necesitas y cuándo lo necesitas. Respondemos en menos de 24 horas.
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
