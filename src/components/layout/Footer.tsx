import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-cream-warm border-t border-cream-deep mt-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Marca */}
        <div className="space-y-3">
          <p className="font-serif text-2xl font-light tracking-[0.15em] text-ink">Bertina</p>
          <p className="font-sans text-sm text-warmgray leading-relaxed max-w-xs">
            Cuadernos y papelería de diseño. Piezas para quienes aman escribir con estilo.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <p className="font-sans text-xs tracking-widest uppercase text-warmgray-dark">Tienda</p>
          <ul className="space-y-2">
            {[
              { label: "Catálogo", href: "/catalogo" },
              { label: "Cuadernos", href: "/catalogo?category=cuadernos" },
              { label: "Libretas", href: "/catalogo?category=libretas" },
              { label: "Sets regalo", href: "/catalogo?category=sets" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-sans text-sm text-warmgray hover:text-ink transition-colors duration-200"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="space-y-4">
          <p className="font-sans text-xs tracking-widest uppercase text-warmgray-dark">Contacto</p>
          <p className="font-sans text-sm text-warmgray leading-relaxed">
            ¿Tienes preguntas? Escríbenos directamente por WhatsApp.
          </p>
          <a
            href="https://wa.me/573001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            Ir a WhatsApp →
          </a>
        </div>
      </div>

      <div className="border-t border-cream-deep">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs text-warmgray-light">
            © {new Date().getFullYear()} Bertina Store. Todos los derechos reservados.
          </p>
          <p className="font-serif text-xs italic text-warmgray-light">
            Hecho con amor y buena papelería.
          </p>
        </div>
      </div>
    </footer>
  );
}
