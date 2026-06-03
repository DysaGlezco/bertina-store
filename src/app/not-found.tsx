import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-cream">

      {/* Número decorativo */}
      <p
        aria-hidden
        className="font-serif text-[clamp(6rem,20vw,14rem)] font-light leading-none text-cream-deep select-none"
      >
        404
      </p>

      <div className="max-w-sm -mt-4 space-y-5">
        <div className="w-8 h-px bg-gold mx-auto" />

        <h1 className="font-serif text-2xl font-light text-ink">
          Esta página se perdió en el papel
        </h1>

        <p className="font-sans text-sm text-warmgray leading-relaxed">
          Parece que la página que buscas no existe o fue movida.
          Vuelve al inicio o explora el catálogo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/" className="btn-primary">
            Ir al inicio
          </Link>
          <Link href="/catalogo" className="btn-ghost">
            Ver catálogo →
          </Link>
        </div>
      </div>

    </div>
  );
}
