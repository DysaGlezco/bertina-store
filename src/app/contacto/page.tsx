import type { Metadata } from "next";
import { Instagram, Facebook } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Comunícate con Bertina Store. Pedidos, consultas y personalizaciones por WhatsApp. También nos encuentras en Instagram y Facebook.",
};

const socials = [
  {
    label: "Instagram",
    handle: "@bertina.store",
    href: "https://instagram.com/bertina.store",
    Icon: Instagram,
    color: "hover:text-blush-dark",
  },
  {
    label: "Facebook",
    handle: "Bertina Store",
    href: "https://www.facebook.com/share/1BM23f6SiV/?mibextid=wwXIfr",
    Icon: Facebook,
    color: "hover:text-lavender-dark",
  },
];

const faqs = [
  {
    q: "¿Cómo hago un pedido?",
    a: "Agrega los productos al carrito y al finalizar te conectamos por WhatsApp para coordinar el pago y envío.",
  },
  {
    q: "¿Hacen personalizaciones?",
    a: "Sí. Puedes escribirnos directamente para hablar de cuadernos con nombre, colores o diseño especial.",
  },
  {
    q: "¿Hacen envíos?",
    a: "Realizamos envíos a determinadas ubicaciones. Consúltanos por WhatsApp para confirmar disponibilidad en tu zona.",
  },
  {
    q: "¿Cuánto tarda la entrega?",
    a: "Depende de tu ubicación. Escríbenos por WhatsApp y te damos un estimado exacto según tu zona.",
  },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Breadcrumb crumbs={[{ label: "Inicio", href: "/" }, { label: "Contáctenos" }]} />
          </div>
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-6">
            Estamos aquí
          </p>
          <h1 className="font-serif text-display-lg text-ink leading-tight">
            Hablemos
          </h1>
          <div className="w-12 h-px bg-gold mt-6 mb-6" />
          <p className="font-sans text-base text-warmgray leading-relaxed max-w-lg">
            Somos una papelería pequeña y personal. Cada pedido pasa por nuestras manos. Si tienes alguna duda, idea o simplemente quieres contarnos qué buscas, escríbenos sin pena.
          </p>
        </div>
      </section>

      {/* Grid contacto */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* WhatsApp */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-light text-ink">WhatsApp</h2>
            <div className="w-8 h-px bg-gold" />
            <p className="font-sans text-sm text-warmgray leading-relaxed">
              La forma más rápida de hablar con nosotros. Pedidos, consultas, personalizaciones y cotizaciones corporativas — todo por aquí.
            </p>
            <a
              href="https://wa.me/5358732088"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Abrir WhatsApp
            </a>
            <p className="font-sans text-xs text-warmgray-light">
              Respondemos en menos de 24 h
            </p>
          </div>

          {/* Redes sociales */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-light text-ink">Redes sociales</h2>
            <div className="w-8 h-px bg-gold" />
            <p className="font-sans text-sm text-warmgray leading-relaxed">
              Síguenos para ver novedades, procesos de creación y piezas que se están cocinando.
            </p>
            <div className="flex flex-col gap-4">
              {socials.map(({ label, handle, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 group text-warmgray ${color} transition-colors duration-200`}
                >
                  <span className="w-10 h-10 rounded-full border border-cream-deep flex items-center justify-center group-hover:border-current transition-colors duration-200">
                    <Icon size={16} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-sans text-sm font-medium text-ink group-hover:text-current transition-colors duration-200">
                      {label}
                    </p>
                    <p className="font-sans text-xs text-warmgray">{handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="py-20 px-6 bg-cream-warm border-t border-cream-deep">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">FAQ</p>
            <h2 className="font-serif text-display-md text-ink">Preguntas frecuentes</h2>
            <div className="w-12 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="divide-y divide-cream-deep">
            {faqs.map(({ q, a }) => (
              <div key={q} className="py-6 space-y-2">
                <p className="font-sans text-sm font-medium text-ink">{q}</p>
                <p className="font-sans text-sm text-warmgray leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
