import type { ConfiguredItem } from "@/types";
import { formatUSD } from "@/lib/pricing";

const WHATSAPP_NUMBER = "5358732088";

const LAMINATION_LABEL: Record<string, string> = {
  brillante: "Brillante",
  mate: "Mate",
  holografico: "Holográfico",
};

const BINDING_LABEL: Record<string, string> = {
  flejes: "Wire-O",
  argollas: "Argollas",
};

const COVER_TYPE_LABEL: Record<string, string> = {
  semidura: "Semidura",
  dura: "Dura",
};

function formatContentType(item: ConfiguredItem): string {
  const { contentType, contentSubtype } = item.config;
  if (contentType === "cuaderno" && contentSubtype) {
    const sub = contentSubtype.charAt(0).toUpperCase() + contentSubtype.slice(1);
    return `Cuaderno · ${sub}`;
  }
  const label = contentType.replace(/-/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function buildItemSpec(item: ConfiguredItem, i: number): string {
  const { config } = item;
  const lines = [
    `*Cuaderno ${i + 1}*`,
    `  Portada: ${config.cover.name}`,
    `  Contenido: ${formatContentType(item)}`,
    `  Laminado: ${LAMINATION_LABEL[config.lamination] ?? config.lamination}`,
    `  Portada: ${COVER_TYPE_LABEL[config.coverType] ?? config.coverType}`,
    `  Hojas: ${config.hojas} · ${BINDING_LABEL[config.binding] ?? config.binding}`,
    `  Cantidad: ${item.quantity}`,
    `  Precio unitario: ${formatUSD(item.priceUSD)}`,
    `  Subtotal: ${formatUSD(item.priceUSD * item.quantity)}`,
  ];

  if (config.customCover)   lines.push(`  ⚙️ Portada personalizada`);
  if (config.customContent) lines.push(`  ⚙️ Contenido personalizado`);
  if (config.notes)         lines.push(`  📝 Nota: ${config.notes}`);

  return lines.join("\n");
}

export function buildWhatsAppMessage(items: ConfiguredItem[], totalUSD: number): string {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const specs = items.map((item, i) => buildItemSpec(item, i)).join("\n\n");

  return `
🛍️ *PEDIDO — BERTINA STORE*
📅 ${date}

${specs}

─────────────────────
*TOTAL: ${formatUSD(totalUSD)} USD*
─────────────────────

_Por favor confirma disponibilidad y coordinaremos la entrega._
`.trim();
}

export function buildWhatsAppUrl(items: ConfiguredItem[], totalUSD: number): string {
  const message = buildWhatsAppMessage(items, totalUSD);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Compatibilidad con imports legacy
export { formatUSD as formatCurrency };
