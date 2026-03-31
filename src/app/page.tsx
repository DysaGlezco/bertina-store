import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import productsData from "@/data/products.json";
import type { Product } from "@/types";
import HeroSection from "@/components/layout/HeroSection";

const products = productsData as Product[];
const featured = products.filter((p) => p.featured);

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Sección de productos destacados */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-section">
        {/* Encabezado sección */}
        <div className="text-center mb-14 space-y-3">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">
            Selección
          </p>
          <h2 className="font-serif text-display-md text-ink">
            Piezas destacadas
          </h2>
          <div className="w-12 h-px bg-sage mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/catalogo" className="btn-outline">
            Ver catálogo completo
          </Link>
        </div>
      </section>

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
