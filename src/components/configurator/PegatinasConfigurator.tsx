"use client";

import { useState, useMemo } from "react";
import { ShoppingBag, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatUSD } from "@/lib/pricing";
import type { PegatinasConfig, PegatinaMaterial, PegatinaTamano, PegatinaCartItem } from "@/types";
import { MATERIAL_LABEL } from "@/lib/constants";

interface Props { config: PegatinasConfig; }

const MATERIAL_OPTIONS: { id: PegatinaMaterial; label: string; desc: string }[] = [
  { id: "papel-fotografico", label: "Papel fotográfico", desc: "Alta resolución, colores vivos" },
  { id: "vinilo",            label: "Vinilo",            desc: "Resistente al agua y la humedad" },
];

const TAMANO_OPTIONS: { id: PegatinaTamano; label: string; dims: string }[] = [
  { id: "2x2", label: "Pequeña", dims: "2 × 2 cm" },
  { id: "3x3", label: "Mediana", dims: "3 × 3 cm" },
  { id: "4x4", label: "Grande",  dims: "4 × 4 cm" },
];

export default function PegatinasConfigurator({ config }: Props) {
  const { addItem } = useCart();

  const [material, setMaterial] = useState<PegatinaMaterial>("papel-fotografico");
  const [acabado,  setAcabado]  = useState<string>("");
  const [tamano,   setTamano]   = useState<PegatinaTamano>("2x2");
  const [added,    setAdded]    = useState(false);

  const acabadoRows = useMemo(
    () => config.precios.filter(r => r.material === material),
    [config.precios, material]
  );

  const selectedRow = acabadoRows.find(r => r.acabado === acabado) ?? acabadoRows[0];
  const selectedAcabado = selectedRow?.acabado ?? "";

  const precio = useMemo(() => {
    if (!selectedRow) return 0;
    const key = `precio${tamano}` as "precio2x2" | "precio3x3" | "precio4x4";
    return selectedRow[key] ?? 0;
  }, [selectedRow, tamano]);

  function handleMaterialChange(m: PegatinaMaterial) {
    setMaterial(m);
    setAcabado("");
  }

  function handleAddToCart() {
    if (!selectedAcabado || precio === 0) return;
    const item: PegatinaCartItem = {
      type: "pegatina",
      material,
      acabado: selectedAcabado,
      tamano,
      cantidad: config.cantidad,
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

        {/* Columna izquierda — imagen de referencia */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-warm">
            <AnimatePresence mode="wait">
              {selectedRow?.imagen ? (
                <motion.img
                  key={selectedRow.imagen}
                  src={selectedRow.imagen}
                  alt={selectedAcabado}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                >
                  <Tag size={48} strokeWidth={0.8} className="text-warmgray/30" />
                  <p className="font-sans text-xs text-warmgray/40 tracking-widest uppercase">
                    Imagen de referencia
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {selectedAcabado && (
            <p className="font-sans text-xs text-warmgray tracking-widest uppercase text-center mt-4">
              {MATERIAL_LABEL[material] ?? material} · {selectedAcabado}
            </p>
          )}
        </div>

        {/* Columna derecha — configurador */}
        <div className="space-y-10">

          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray mb-2">
              Configura tu pedido
            </p>
            <h1 className="font-serif text-display-md text-ink">Pegatinas</h1>
            <div className="w-10 h-px bg-gold mt-4" />
            <p className="font-sans text-sm text-warmgray mt-4">
              {config.cantidad} unidades por pedido.
            </p>
          </div>

          {/* 01 — Material */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs text-gold tracking-widest">01</span>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">Material</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MATERIAL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleMaterialChange(opt.id)}
                  className={`py-4 px-5 rounded-xl border text-left transition-all duration-200 ${
                    material === opt.id
                      ? "border-gold bg-gold/5 shadow-sm"
                      : "border-cream-deep hover:border-warmgray/40"
                  }`}
                >
                  <p className={`font-sans text-sm font-medium ${material === opt.id ? "text-gold" : "text-ink"}`}>
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

          {/* 03 — Tamaño */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-sans text-xs text-gold tracking-widest">03</span>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">Tamaño</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {TAMANO_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTamano(opt.id)}
                  className={`py-3 px-5 rounded-xl border text-left transition-all duration-200 ${
                    tamano === opt.id
                      ? "border-gold bg-gold/5 shadow-sm"
                      : "border-cream-deep hover:border-warmgray/40"
                  }`}
                >
                  <p className={`font-sans text-sm font-medium ${tamano === opt.id ? "text-gold" : "text-ink"}`}>
                    {opt.label}
                  </p>
                  <p className="font-sans text-xs text-warmgray mt-0.5">{opt.dims}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Resumen + CTA */}
          <div className="border-t border-cream-deep pt-8 space-y-5">
            <div className="space-y-1">
              <p className="font-sans text-xs tracking-widest uppercase text-warmgray">Tu pedido</p>
              <p className="font-sans text-sm text-warmgray">
                {config.cantidad} pegatinas · {MATERIAL_LABEL[material] ?? material} · {selectedAcabado} · {TAMANO_OPTIONS.find(t => t.id === tamano)?.dims}
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
