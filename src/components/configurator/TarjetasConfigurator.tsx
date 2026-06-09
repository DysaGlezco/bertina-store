"use client";

import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatUSD } from "@/lib/pricing";
import { getTarjetasConfig } from "@/lib/supabase";
import type { TarjetasConfig, TarjetaCartItem } from "@/types";
import { CARAS_LABEL } from "@/lib/constants";
import tarjetasFallback from "@/data/tarjetas-config.json";

const CARAS_OPTIONS = [
  { id: "una-cara"  as const, label: "Una cara",  desc: "Impresión en un solo lado" },
  { id: "dos-caras" as const, label: "Dos caras", desc: "Impresión en ambos lados" },
];

export default function TarjetasConfigurator() {
  const { addItem } = useCart();

  const [config, setConfig] = useState<TarjetasConfig>(tarjetasFallback as TarjetasConfig);

  useEffect(() => {
    getTarjetasConfig().then(setConfig);
  }, []);

  const [caras,    setCaras]    = useState<"una-cara" | "dos-caras">("una-cara");
  const [acabado,  setAcabado]  = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(config.cantidades[0] ?? 100);
  const [added,    setAdded]    = useState(false);

  const acabadoRows = useMemo(
    () => config.precios.filter(r => r.caras === caras),
    [config.precios, caras]
  );

  const selectedRow    = acabadoRows.find(r => r.acabado === acabado) ?? acabadoRows[0];
  const selectedAcabado = selectedRow?.acabado ?? "";

  const precio = useMemo(() => {
    if (!selectedRow) return 0;
    return selectedRow.precio100 * (cantidad / 100);
  }, [selectedRow, cantidad]);

  function handleCarasChange(c: "una-cara" | "dos-caras") {
    setCaras(c);
    setAcabado("");
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
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Columna izquierda — imagen de referencia única */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-warm">
            {config.imagen ? (
              <Image
                src={config.imagen}
                alt="Tarjetas de presentación"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <CreditCard size={48} strokeWidth={0.8} className="text-warmgray/30" />
                <p className="font-sans text-xs text-warmgray/40 tracking-widest uppercase">
                  Imagen de referencia
                </p>
              </div>
            )}
          </div>
          {selectedAcabado && (
            <p className="font-sans text-xs text-warmgray tracking-widest uppercase text-center mt-4">
              {CARAS_LABEL[caras]} · {selectedAcabado}
            </p>
          )}
        </div>

        {/* Columna derecha — configurador */}
        <div className="space-y-10">

          {/* Encabezado */}
          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray mb-2">
              Configura tu pedido
            </p>
            <h1 className="font-serif text-display-md text-ink">Tarjetas de presentación</h1>
            <div className="w-10 h-px bg-gold mt-4" />
          </div>

          {/* 01 — Tipo de impresión */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs text-gold tracking-widest">01</span>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">Tipo de impresión</p>
            </div>
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

          {/* 02 — Acabado */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs text-gold tracking-widest">02</span>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">Acabado</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {acabadoRows.map(row => (
                <button
                  key={row.acabado}
                  onClick={() => setAcabado(row.acabado)}
                  className={`px-4 py-2 rounded-full border font-sans text-sm transition-all duration-200 ${
                    selectedAcabado === row.acabado
                      ? "border-gold bg-gold/5 text-gold"
                      : "border-cream-deep text-warmgray hover:border-warmgray/40 hover:text-ink"
                  }`}
                >
                  {row.acabado}
                </button>
              ))}
            </div>
          </div>

          {/* 03 — Cantidad */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs text-gold tracking-widest">03</span>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">Cantidad</p>
            </div>
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
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen + CTA */}
          <div className="border-t border-cream-deep pt-8 space-y-5">
            <div className="space-y-1">
              <p className="font-sans text-xs tracking-widest uppercase text-warmgray">Tu pedido</p>
              <p className="font-sans text-sm text-warmgray">
                {cantidad} tarjetas · {CARAS_LABEL[caras]} · {selectedAcabado}
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
      </div>
    </div>
  );
}
