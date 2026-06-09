import type { CartItem, ConfiguredItem, TarjetaCartItem, PegatinaCartItem } from "@/types";
import { isTarjetaItem, isPegatinaItem } from "@/types";
import { formatUSD } from "@/lib/pricing";
import {
  WHATSAPP_NUMBER,
  LAMINATION_LABEL,
  BINDING_LABEL,
  COVER_TYPE_LABEL,
  CARAS_LABEL,
  MATERIAL_LABEL,
  TAMANO_LABEL,
} from "@/lib/constants";

function formatContentType(item: ConfiguredItem): string {
  const { contentType, contentSubtype } = item.config;
  if (contentType === "cuaderno" && contentSubtype) {
    const sub = contentSubtype.replace(/-/g, " ");
    return `Cuaderno · ${sub.charAt(0).toUpperCase() + sub.slice(1)}`;
  }
  const label = contentType.replace(/-/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function buildCuadernoSpec(item: ConfiguredItem, i: number): string {
  const { config } = item;
  const lines = [
    `*Cuaderno ${i + 1}*`,
    `  Portada: ${config.cover.name}`,
    `  Contenido: ${formatContentType(item)}`,
    `  Laminado: ${LAMINATION_LABEL[config.lamination] ?? config.lamination}`,
    `  Tapa: ${COVER_TYPE_LABEL[config.coverType] ?? config.coverType}`,
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

function buildPegatinaSpec(item: PegatinaCartItem, i: number): string {
  return [
    `*Pegatinas ${i + 1}*`,
    `  Material: ${MATERIAL_LABEL[item.material] ?? item.material}`,
    `  Acabado: ${item.acabado}`,
    `  Tamaño: ${TAMANO_LABEL[item.tamano] ?? item.tamano}`,
    `  Cantidad: ${item.cantidad} unidades`,
    `  Precio: ${formatUSD(item.priceUSD)}`,
    `  Subtotal: ${formatUSD(item.priceUSD * item.quantity)}`,
  ].join("\n");
}

function buildTarjetaSpec(item: TarjetaCartItem, i: number): string {
  return [
    `*Tarjetas ${i + 1}*`,
    `  Caras: ${CARAS_LABEL[item.caras] ?? item.caras}`,
    `  Acabado: ${item.acabado}`,
    `  Cantidad: ${item.cantidad} unidades`,
    `  Precio: ${formatUSD(item.priceUSD)}`,
    `  Subtotal: ${formatUSD(item.priceUSD * item.quantity)}`,
  ].join("\n");
}

export function buildWhatsAppMessage(items: CartItem[], totalUSD: number): string {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric",
  });

  let cuadernoIdx = 0;
  let tarjetaIdx  = 0;
  let pegatinaIdx = 0;

  const specs = items.map((item) => {
    if (isTarjetaItem(item))  return buildTarjetaSpec(item, tarjetaIdx++);
    if (isPegatinaItem(item)) return buildPegatinaSpec(item, pegatinaIdx++);
    return buildCuadernoSpec(item as ConfiguredItem, cuadernoIdx++);
  }).join("\n\n");

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

export function buildWhatsAppUrl(items: CartItem[], totalUSD: number): string {
  const message = buildWhatsAppMessage(items, totalUSD);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
