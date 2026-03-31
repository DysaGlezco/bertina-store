import type { CartItem } from "@/types";

// Tu número de WhatsApp con código de país, sin + ni espacios
const WHATSAPP_NUMBER = "573001234567"; // ← cambia esto por tu número real

export function formatCurrency(amount: number, currency = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppMessage(items: CartItem[], total: number): string {
  const date = new Date().toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const lineItems = items
    .map(
      (item) =>
        `• ${item.product.name} × ${item.quantity} — ${formatCurrency(
          item.product.price * item.quantity
        )}`
    )
    .join("\n");

  const message = `
🛍️ *PEDIDO — BERTINA STORE*
📅 ${date}

*Productos:*
${lineItems}

─────────────────
*TOTAL: ${formatCurrency(total)}*

─────────────────
_Por favor confirma disponibilidad y método de envío._
`.trim();

  return message;
}

export function getWhatsAppUrl(items: CartItem[], total: number): string {
  const message = buildWhatsAppMessage(items, total);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
