"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, getWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed top-0 right-0 h-full z-50 w-full max-w-md bg-cream shadow-[-20px_0_60px_rgba(44,40,37,0.1)] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header del drawer */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-cream-deep">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-ink" />
                <h2 className="font-serif text-xl font-light tracking-wide">Tu pedido</h2>
              </div>
              <button
                onClick={closeCart}
                className="text-warmgray hover:text-ink transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag size={40} strokeWidth={1} className="text-warmgray-light" />
                  <p className="font-serif text-lg text-warmgray italic">Tu carrito está vacío</p>
                  <p className="font-sans text-sm text-warmgray-light">Explora el catálogo y añade algo bonito.</p>
                  <button onClick={closeCart} className="btn-outline mt-4">
                    Ver catálogo
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4"
                  >
                    {/* Imagen */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-warm flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base font-medium text-ink truncate">
                        {item.product.name}
                      </p>
                      <p className="font-sans text-sm text-warmgray mt-0.5">
                        {formatCurrency(item.product.price)}
                      </p>

                      {/* Cantidad */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-cream-deep flex items-center justify-center text-warmgray hover:border-ink hover:text-ink transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-sans text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-cream-deep flex items-center justify-center text-warmgray hover:border-ink hover:text-ink transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Precio total + eliminar */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-warmgray-light hover:text-blush transition-colors"
                        aria-label="Eliminar"
                      >
                        <X size={14} />
                      </button>
                      <p className="font-serif text-base font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer del drawer */}
            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-cream-deep space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-warmgray tracking-wide uppercase">Total</span>
                  <span className="font-serif text-2xl font-light">{formatCurrency(totalPrice)}</span>
                </div>
                <p className="font-sans text-xs text-warmgray-light leading-relaxed">
                  Al continuar, te redirigiremos a WhatsApp para confirmar tu pedido directamente con nosotros.
                </p>
                <a
                  href={getWhatsAppUrl(items, totalPrice)}
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
