import ProductCard from "@/components/product/ProductCard";
import productsData from "@/data/products.json";
import type { Product, ProductCategory } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explora todos nuestros cuadernos y papelería de diseño.",
};

const products = productsData as Product[];

const categories: { value: ProductCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "cuadernos", label: "Cuadernos" },
  { value: "libretas", label: "Libretas" },
  { value: "agendas", label: "Agendas" },
  { value: "sets", label: "Sets regalo" },
];

interface CatalogoPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const activeCategory = params.category ?? "todos";

  const filtered =
    activeCategory === "todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Encabezado */}
        <div className="mb-12 space-y-3">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">
            Todos los productos
          </p>
          <h1 className="font-serif text-display-lg text-ink">Catálogo</h1>
          <div className="w-12 h-px bg-sage mt-4" />
        </div>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <a
              key={cat.value}
              href={cat.value === "todos" ? "/catalogo" : `/catalogo?category=${cat.value}`}
              className={`px-5 py-2 rounded-full font-sans text-xs tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat.value
                  ? "bg-ink text-cream"
                  : "border border-cream-deep text-warmgray hover:border-ink hover:text-ink"
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-xl italic text-warmgray">
              No hay productos en esta categoría aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
