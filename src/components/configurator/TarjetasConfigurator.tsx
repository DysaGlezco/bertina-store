"use client";

import { useState, useMemo } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatUSD } from "@/lib/pricing";
import type { TarjetasConfig, TarjetaCartItem } from "@/types";

interface Props {
  config: TarjetasConfig;
}

const CARAS_OPTIONS = [
  { id: "una-cara"  as const, label: "Una cara",  desc: "Impresión en un solo lado" },
  { id: "dos-caras" as const, label: "Dos caras", desc: "Impresión en ambos lados" },
];

export default function TarjetasConfigurator({ config }: Props) {
  const { addItem } = useCart();

  const [caras,    setCaras]    = useState<"una-cara" | "dos-caras">("una-cara");
  const [acabado,  setAcabado]  = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(config.cantidades[0] ?? 100);
  const [added,    setAdded]    = useState(false);

  // Acabados disponibles para las caras seleccionadas
  const acabados = useMemo(
    () => config.precios.filter(r => r.caras === caras).map(r => r.acabado),
    [config.precios, caras]
  );

  // Resetear acabado si no está disponible en las nuevas caras
  const selectedAcabado = acabados.includes(acabado) ? acabado : (acabados[0] ?? "");

  // Precio calculado
  const precio = useMemo(() => {
    const row = config.precios.find(r => r.caras === caras && r.acabado === selectedAcabado);
    if (!row) return 0;
    return row.precio100 * (cantidad / 100);
  }, [config.precios, caras, selectedAcabado, cantidad]);

  function handleCarasChange(c: "una-cara" | "dos-caras") {
    setCaras(c);
    // El acabado se reseteará vía el useMemo de selectedAcabado
  }

  function handleAddToCart() {
    if (!selectedAcabado) return;
    const item: TarjetaCartItem = {
      type: "tarjeta",
      caras,
      acabado: selectedAcabado,
      cantidad,
      priceUSD: precio,
      quantity: 1,
    };
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">

      {/* Encabezado */}
      <div className="space-y-2">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray">Configura tu pedido</p>
        <h1 className="font-serif text-display-md text-ink">Tarjetas de presentación</h1>
        <div className="w-10 h-px bg-gold" />
        <p className="font-sans text-sm text-warmgray leading-relaxed pt-1">
          Elige el tipo de impresión, el acabado y la cantidad. El precio se calcula en tiempo real.
        </p>
      </div>

      {/* Paso 1: Caras */}
      <div className="space-y-4">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">
          <span className="text-gold mr-2">01</span>Tipo de impresión
        </p>
        <div className="grid grid-cols-2 gap-3">
          {CARAS_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleCarasChange(opt.id)}
              className={`py-4 px-5 rounded-xl border text-left transition-all duration-200 ${
                caras === opt.id
                  ? "border-gold bg-gold/5 shadow-sm"
                  : "border-cream-deep hover:border-warmgray/40"
              }`}
            >
              <p className={`font-sans text-sm font-medium ${caras === opt.id ? "text-gold" : "text-ink"}`}>
                {opt.label}
              </p>
              <p className="font-sans text-xs text-warmgray mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Paso 2: Acabado */}
      <div className="space-y-4">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">
          <span className="text-gold mr-2">02</span>Acabado
        </p>
        <div className="flex flex-wrap gap-2">
          {acabados.map(ac => (
            <button
              key={ac}
              onClick={() => setAcabado(ac)}
              className={`px-4 py-2 rounded-full border font-sans text-sm transition-all duration-200 ${
                selectedAcabado === ac
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-cream-deep text-warmgray hover:border-warmgray/40 hover:text-ink"
              }`}
            >
              {ac}
            </button>
          ))}
        </div>
      </div>

      {/* Paso 3: Cantidad */}
      <div className="space-y-4">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">
          <span className="text-gold mr-2">03</span>Cantidad
        </p>
        <div className="flex flex-wrap gap-2">
          {config.cantidades.map(c => (
            <button
              key={c}
              onClick={() => setCantidad(c)}
              className={`px-5 py-2 rounded-full border font-sans text-sm transition-all duration-200 ${
                cantidad === c
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-cream-deep text-warmgray hover:border-warmgray/40 hover:text-ink"
              }`}
            >
              {c.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen + CTA */}
      <div className="border-t border-cream-deep pt-8 space-y-5">
        <div className="space-y-1">
          <p className="font-sans text-xs tracking-widest uppercase text-warmgray">Tu pedido</p>
          <p className="font-sans text-sm text-warmgray">
            {cantidad.toLocaleString()} tarjetas · {caras === "una-cara" ? "Una cara" : "Dos caras"} · {selectedAcabado}
          </p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-4xl font-light text-ink">{formatUSD(precio)}</span>
          <span className="font-sans text-sm text-warmgray">USD</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!selectedAcabado || precio === 0}
          className="btn-primary w-full gap-2 justify-center"
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          {added ? "¡Añadido!" : "Añadir al pedido"}
        </button>
        <p className="font-sans text-xs text-warmgray/60 text-center leading-relaxed">
          Al finalizar te conectamos por WhatsApp para confirmar y coordinar la entrega.
        </p>
      </div>

    </div>
  );
}
