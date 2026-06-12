"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import {
  calculatePrice,
  getBindingFromHojas,
  getCoverTypeFromHojas,
  formatUSD,
  NON_CUADERNO_HOJAS,
} from "@/lib/pricing";
import type {
  Cover,
  PricingConfig,
  ContentType,
  ContentSubtype,
  ContentTypeConfig,
  Lamination,
  Binding,
  SheetCount,
  BookConfig,
  ConfiguredItem,
} from "@/types";

/* ─── Etiquetas y grupos ────────────────────────────────────────────── */

const CUADERNO_SUBTYPES: { id: ContentSubtype; label: string }[] = [
  { id: "liso",         label: "Liso" },
  { id: "raya",         label: "Raya" },
  { id: "cuadro-simple", label: "Cuadro simple" },
  { id: "isometrico",   label: "Cuadro isométrico" },
  { id: "puntos",       label: "Puntos" },
  { id: "pentagrama",   label: "Pentagrama" },
  { id: "caligrafia",   label: "Caligrafía" },
  { id: "mixta",        label: "Mixta" },
];

// Los grupos se construyen dinámicamente desde los contentTypes recibidos como prop

const LAMINATIONS: { id: Lamination; label: string; desc: string }[] = [
  { id: "brillante", label: "Brillante", desc: "Acabado glossy, colores vivos" },
  { id: "mate", label: "Mate", desc: "Suave al tacto, acabado sedoso" },
  { id: "holografico", label: "Holográfico", desc: "Efecto iridiscente especial" },
];

const HOJAS_OPTIONS: { value: SheetCount; coverType: string }[] = [
  { value: 40,  coverType: "Semidura" },
  { value: 80,  coverType: "Dura" },
  { value: 90,  coverType: "Dura" },
  { value: 100, coverType: "Dura" },
  { value: 150, coverType: "Dura" },
  { value: 180, coverType: "Dura" },
  { value: 210, coverType: "Dura" },
];

const BINDING_OPTIONS: { id: Binding; label: string }[] = [
  { id: "flejes",   label: "Wire-O" },
  { id: "argollas", label: "Argollas" },
];

/* ─── Helpers de UI ─────────────────────────────────────────────────── */

function SectionTitle({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="font-sans text-xs text-gold tracking-widest">{number}</span>
      <p className="font-sans text-xs tracking-[0.25em] uppercase text-warmgray">{label}</p>
    </div>
  );
}

/* ─── Componente principal ──────────────────────────────────────────── */

function buildGroups(types: ContentTypeConfig[]) {
  const map = new Map<string, { id: ContentType; label: string }[]>();
  for (const ct of types.filter((t) => t.visible)) {
    if (!map.has(ct.group)) map.set(ct.group, []);
    map.get(ct.group)!.push({ id: ct.id, label: ct.label });
  }
  return Array.from(map.entries()).map(([label, types]) => ({ label, types }));
}

export default function ConfiguratorClient({
  cover,
  pricingConfig,
  contentTypes,
}: {
  cover: Cover;
  pricingConfig: PricingConfig;
  contentTypes: ContentTypeConfig[];
}) {
  const contentGroups = useMemo(() => buildGroups(contentTypes), [contentTypes]);
  const { addItem, toggleCart } = useCart();

  const [contentType, setContentType] = useState<ContentType>("cuaderno");
  const [contentSubtype, setContentSubtype] = useState<ContentSubtype>("liso");
  const [lamination, setLamination] = useState<Lamination>("brillante");
  const [hojas, setHojas] = useState<SheetCount>(80);
  const [binding, setBinding] = useState<Binding>("flejes");
  const [customCover, setCustomCover] = useState(false);
  const [customContent, setCustomContent] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [added, setAdded] = useState(false);

  const effectiveHojas: SheetCount = contentType === "cuaderno" ? hojas : NON_CUADERNO_HOJAS;
  // Para ≤100 hojas el binding es siempre flejes; para ≥150 el cliente elige
  const effectiveBinding: Binding = effectiveHojas <= 100 ? "flejes" : binding;
  const canChooseBinding = contentType === "cuaderno" && hojas >= 150;

  function handleHojasChange(value: SheetCount) {
    setHojas(value);
    // Cuando se baja a ≤100 resetear binding a flejes
    if (value <= 100) setBinding("flejes");
  }

  const price = useMemo(() => {
    const config: BookConfig = {
      cover,
      coverType: getCoverTypeFromHojas(effectiveHojas),
      lamination,
      hojas: effectiveHojas,
      binding: effectiveBinding,
      contentType,
      contentSubtype: contentType === "cuaderno" ? contentSubtype : undefined,
      customCover,
      customContent,
      notes: notes || undefined,
    };
    return calculatePrice(config, pricingConfig, contentTypes);
  }, [cover, contentType, contentSubtype, lamination, effectiveHojas, effectiveBinding, customCover, customContent, notes, pricingConfig, contentTypes]);

  function buildConfig(): BookConfig {
    return {
      cover,
      coverType: getCoverTypeFromHojas(effectiveHojas),
      lamination,
      hojas: effectiveHojas,
      binding: effectiveBinding,
      contentType,
      contentSubtype: contentType === "cuaderno" ? contentSubtype : undefined,
      customCover,
      customContent,
      notes: notes || undefined,
    };
  }

  function handleAddToCart() {
    const item: ConfiguredItem = {
      config: buildConfig(),
      priceUSD: price,
      quantity: 1,
    };
    addItem(item);
    setAdded(true);
    setTimeout(() => { setAdded(false); toggleCart(); }, 600);
  }

  const image = cover.images[0] ?? "/images/covers/placeholder.jpg";
  const bindingLabel = effectiveBinding === "flejes" ? "Wire-O" : "Argollas";
  const coverTypeLabel = getCoverTypeFromHojas(effectiveHojas) === "semidura" ? "Semidura" : "Dura";

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* Columna izquierda — imagen */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-cream-warm">
            <Image
              src={image}
              alt={cover.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <p className="font-sans text-xs text-warmgray tracking-widest uppercase text-center mt-4">
            {cover.name}
          </p>
        </div>

        {/* Columna derecha — configurador */}
        <div className="space-y-10">

          <div>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warmgray mb-2">
              Configura tu cuaderno
            </p>
            <h1 className="font-serif text-display-md text-ink">{cover.name}</h1>
            {cover.description && (
              <p className="font-sans text-sm text-warmgray/70 mt-2 leading-relaxed">
                {cover.description}
              </p>
            )}
            <div className="w-10 h-px bg-gold mt-4" />
          </div>

          {/* ① Tipo de contenido */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionTitle number="01" label="Tipo de contenido" />
              <Link
                href="/guia"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-gold border-b border-gold/40 pb-px hover:border-gold transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                ¿No sabes cuál? Ver guía →
              </Link>
            </div>
            <div className="space-y-4">

              {/* Cuaderno — subtipos directos */}
              <div>
                <p className="font-sans text-[10px] tracking-widest uppercase text-warmgray/60 mb-2">
                  Cuaderno
                </p>
                <div className="flex flex-wrap gap-2">
                  {CUADERNO_SUBTYPES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setContentType("cuaderno"); setContentSubtype(s.id); }}
                      className={`px-4 py-2 rounded-full font-sans text-xs tracking-wide transition-all duration-200 ${
                        contentType === "cuaderno" && contentSubtype === s.id
                          ? "bg-gold text-white"
                          : "border border-cream-deep text-warmgray hover:border-gold hover:text-gold"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resto de tipos */}
              {contentGroups.map((group) => (
                <div key={group.label}>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-warmgray/60 mb-2">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.types.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setContentType(t.id); setContentSubtype("liso"); }}
                        className={`px-4 py-2 rounded-full font-sans text-xs tracking-wide transition-all duration-200 ${
                          contentType === t.id
                            ? "bg-gold text-white"
                            : "border border-cream-deep text-warmgray hover:border-gold hover:text-gold"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ② Laminado */}
          <div>
            <SectionTitle number="02" label="Laminado de portada" />
            <div className="grid grid-cols-3 gap-3">
              {LAMINATIONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLamination(l.id)}
                  className={`p-4 rounded-sm text-left border transition-all duration-200 ${
                    lamination === l.id
                      ? "border-gold bg-gold/5"
                      : "border-cream-deep hover:border-gold/40"
                  }`}
                >
                  <p className={`font-sans text-sm font-medium ${lamination === l.id ? "text-gold" : "text-ink"}`}>
                    {l.label}
                  </p>
                  <p className="font-sans text-[10px] text-warmgray mt-1 leading-tight">{l.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ③ Hojas (solo cuaderno) */}
          {contentType === "cuaderno" && (
            <div>
              <SectionTitle number="03" label="Cantidad de hojas" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HOJAS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleHojasChange(opt.value)}
                    className={`p-3 rounded-sm text-center border transition-all duration-200 ${
                      hojas === opt.value
                        ? "border-gold bg-gold/5"
                        : "border-cream-deep hover:border-gold/40"
                    }`}
                  >
                    <p className={`font-serif text-lg ${hojas === opt.value ? "text-gold" : "text-ink"}`}>
                      {opt.value}
                    </p>
                  </button>
                ))}
              </div>

              {/* Selector de encuadernado — solo para ≥150 hojas */}
              {canChooseBinding && (
                <div className="mt-4 pt-4 border-t border-cream-deep">
                  <p className="font-sans text-[10px] tracking-widest uppercase text-warmgray/60 mb-3">
                    Tipo de encuadernado
                  </p>
                  <div className="flex gap-3">
                    {BINDING_OPTIONS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBinding(b.id)}
                        className={`px-5 py-2.5 rounded-sm text-left border transition-all duration-200 flex-1 ${
                          binding === b.id
                            ? "border-gold bg-gold/5"
                            : "border-cream-deep hover:border-gold/40"
                        }`}
                      >
                        <p className={`font-sans text-sm font-medium ${binding === b.id ? "text-gold" : "text-ink"}`}>
                          {b.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ④ Personalización */}
          <div>
            <SectionTitle
              number={contentType === "cuaderno" ? (canChooseBinding ? "04" : "04") : "03"}
              label="Personalización"
            />
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={customCover}
                  onChange={(e) => setCustomCover(e.target.checked)}
                  className="mt-0.5 accent-gold"
                />
                <div>
                  <p className="font-sans text-sm text-ink group-hover:text-gold transition-colors">
                    Portada personalizada
                  </p>
                  <p className="font-sans text-xs text-warmgray mt-0.5">
                    Coordinaremos el diseño por WhatsApp
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={customContent}
                  onChange={(e) => setCustomContent(e.target.checked)}
                  className="mt-0.5 accent-gold"
                />
                <div>
                  <p className="font-sans text-sm text-ink group-hover:text-gold transition-colors">
                    Contenido personalizado
                  </p>
                  <p className="font-sans text-xs text-warmgray mt-0.5">
                    Diseño interior a tu medida, coordinamos por WhatsApp
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={() => setShowNotes((s) => !s)}
              className="flex items-center gap-1 mt-4 font-sans text-xs text-warmgray hover:text-gold transition-colors"
            >
              <ChevronDown size={14} className={`transition-transform ${showNotes ? "rotate-180" : ""}`} />
              Añadir nota
            </button>
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: nombre para grabar, color específico, fecha especial..."
                rows={3}
                className="mt-2 w-full px-4 py-3 font-sans text-sm text-ink bg-white border border-cream-deep rounded-sm resize-none focus:outline-none focus:border-gold/60 placeholder:text-warmgray/40 transition-colors"
              />
            )}
          </div>

          {/* Resumen de precio y botón */}
          <div className="pt-6 border-t border-cream-deep space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-warmgray mb-1">
                  Tu cuaderno
                </p>
                <p className="font-sans text-xs text-warmgray/70">
                  {contentType === "cuaderno"
                    ? `${effectiveHojas} hojas · ${coverTypeLabel} · ${bindingLabel}`
                    : `100 hojas · Dura · Wire-O`}
                  {" · "}
                  {LAMINATIONS.find((l) => l.id === lamination)?.label}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif text-3xl text-ink">{formatUSD(price)}</p>
                <p className="font-sans text-[10px] text-warmgray tracking-wide">USD</p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn-primary w-full justify-center gap-2 transition-all duration-300 ${
                added ? "bg-sage border-sage" : ""
              }`}
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              {added ? "¡Añadido!" : "Añadir al pedido"}
            </button>

            <p className="font-sans text-xs text-warmgray text-center leading-relaxed">
              Al finalizar te conectamos por WhatsApp para confirmar y coordinar la entrega.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
