"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, CreditCard, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatUSD } from "@/lib/pricing";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CartItem, ConfiguredItem, TarjetaCartItem, PegatinaCartItem } from "@/types";
import { isTarjetaItem, isPegatinaItem } from "@/types";
import { LAMINATION_LABEL, BINDING_LABEL, CARAS_LABEL, MATERIAL_LABEL, TAMANO_LABEL } from "@/lib/constants";

function CuadernoSummary({ item }: { item: ConfiguredItem }) {
  const { config } = item;
  const lines: string[] = [];
  if (config.contentType === "cuaderno" && config.contentSubtype) {
    const sub = config.contentSubtype.replace(/-/g, " ");
    lines.push(`Cuaderno ${sub.charAt(0).toUpperCase() + sub.slice(1)}`);
  } else {
    const label = config.contentType.replace(/-/g, " ");
    lines.push(label.charAt(0).toUpperCase() + label.slice(1));
  }
  lines.push(LAMINATION_LABEL[config.lamination] ?? config.lamination);
  lines.push(`${config.hojas} hojas · ${BINDING_LABEL[config.binding] ?? config.binding}`);
  return (
    <div className="space-y-0.5">
      {lines.map((l) => <p key={l} className="font-sans text-xs text-warmgray">{l}</p>)}
      {(config.customCover || config.customContent) && (
        <p className="font-sans text-[10px] text-gold mt-1">✦ Personalización incluida</p>
      )}
    </div>
  );
}

function TarjetaSummary({ item }: { item: TarjetaCartItem }) {
  return (
    <div className="space-y-0.5">
      <p className="font-sans text-xs text-warmgray">{CARAS_LABEL[item.caras] ?? item.caras}</p>
      <p className="font-sans text-xs text-warmgray">{item.acabado}</p>
      <p className="font-sans text-xs text-warmgray">{item.cantidad} unidades</p>
    </div>
  );
}

function PegatinaSummary({ item }: { item: PegatinaCartItem }) {
  return (
    <div className="space-y-0.5">
      <p className="font-sans text-xs text-warmgray">{MATERIAL_LABEL[item.material] ?? item.material}</p>
      <p className="font-sans text-xs text-warmgray">{item.acabado}</p>
      <p className="font-sans text-xs text-warmgray">{TAMANO_LABEL[item.tamano] ?? item.tamano} · {item.cantidad} uds.</p>
    </div>
  );
}

function CartItemRow({ item, index }: { item: CartItem; index: number }) {
  const { removeItem, updateQuantity } = useCart();
  const isTarjeta  = isTarjetaItem(item);
  const isPegatina = isPegatinaItem(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4"
    >
      {/* Imagen / ícono */}
      <div className="w-20 h-24 rounded-sm overflow-hidden bg-cream-warm flex-shrink-0 flex items-center justify-center">
        {isTarjeta  ? <CreditCard size={28} strokeWidth={1} className="text-warmgray/40" /> :
         isPegatina ? <Tag        size={28} strokeWidth={1} className="text-warmgray/40" /> : (
          <Image
            src={(item as ConfiguredItem).config.cover.images[0] ?? "/images/covers/placeholder.jpg"}
            alt={(item as ConfiguredItem).config.cover.name}
            width={80} height={96} unoptimized
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-serif text-base text-ink truncate mb-1">
          {isTarjeta  ? "Tarjetas de presentación" :
           isPegatina ? "Pegatinas" :
           (item as ConfiguredItem).config.cover.name}
        </p>
        {isTarjeta  ? <TarjetaSummary  item={item as TarjetaCartItem}  /> :
         isPegatina ? <PegatinaSummary item={item as PegatinaCartItem} /> :
         <CuadernoSummary item={item as ConfiguredItem} />}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => updateQuantity(index, item.quantity - 1)}
            className="w-7 h-7 rounded-full border border-cream-deep flex items-center justify-center text-warmgray hover:border-ink hover:text-ink transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="font-sans text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(index, item.quantity + 1)}
            className="w-7 h-7 rounded-full border border-cream-deep flex items-center justify-center text-warmgray hover:border-ink hover:text-ink transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Precio + eliminar */}
      <div className="flex flex-col items-end justify-between flex-shrink-0">
        <button
          onClick={() => removeItem(index)}
          className="text-warmgray/40 hover:text-blush transition-colors"
          aria-label="Eliminar"
        >
          <X size={14} />
        </button>
        <p className="font-serif text-base font-medium">
          {formatUSD(item.priceUSD * item.quantity)}
        </p>
      </div>
    </motion.div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalPriceUSD } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed top-0 right-0 h-full z-50 w-full max-w-md bg-cream shadow-[-20px_0_60px_rgba(74,56,40,0.1)] flex flex-col"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-cream-deep">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-ink" />
                <h2 className="font-serif text-xl font-light tracking-wide">Tu pedido</h2>
              </div>
              <button onClick={closeCart} className="text-warmgray hover:text-ink transition-colors" aria-label="Cerrar">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={40} strokeWidth={1} className="text-warmgray/40" />
                  <p className="font-serif text-lg text-warmgray italic">Tu pedido está vacío</p>
                  <p className="font-sans text-sm text-warmgray/60">Elige una portada o configura tus tarjetas.</p>
                  <Link href="/catalogo" onClick={closeCart} className="btn-outline mt-4">
                    Ver catálogo
                  </Link>
                </div>
              ) : (
                items.map((item, index) => (
                  <CartItemRow key={index} item={item} index={index} />
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-cream-deep space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-warmgray tracking-wide uppercase">Total</span>
                  <span className="font-serif text-2xl font-light">{formatUSD(totalPriceUSD)} <span className="text-sm text-warmgray">USD</span></span>
                </div>
                <p className="font-sans text-xs text-warmgray/60 leading-relaxed">
                  Te redirigiremos a WhatsApp para confirmar tu pedido y coordinar la entrega.
                </p>
                <a
                  href={buildWhatsAppUrl(items, totalPriceUSD)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center"
                >
                  Enviar pedido por WhatsApp
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
