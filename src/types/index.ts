export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  product?: string;
}

/* ─── V2: Portadas ──────────────────────────────────────────────────── */

export interface Cover {
  id: string;
  slug: string;
  name: string;
  description?: string;
  images: string[];
  available: boolean;
  featured: boolean;
}

/* ─── V2: Opciones de configuración ────────────────────────────────── */

export type Lamination = "brillante" | "mate" | "holografico";

export type CoverType = "semidura" | "dura";

export type Binding = "flejes" | "argollas";

// Hojas disponibles por tipo de encuadernado:
// flejes  → 40 (semidura) | 80 | 90 | 100 (dura)
// argollas → 150 | 180 | 210 (dura)
export type SheetCount = 40 | 80 | 90 | 100 | 150 | 180 | 210;

// ContentType es string para permitir tipos dinámicos creados desde el admin.
// "cuaderno" es el único valor reservado con comportamiento especial.
export type ContentType = string;

// Solo aplica cuando contentType === "cuaderno"
export type ContentSubtype = "liso" | "raya" | "cuadro-simple" | "isometrico" | "puntos" | "pentagrama" | "caligrafia" | "mixta";

/* ─── V2: Configuración de tipos de contenido ──────────────────────── */

export interface ContentTypeConfig {
  id: string;
  label: string;
  group: string;
  priceModifier: number; // USD que se añade al precio base
  visible: boolean;
}

export interface ContentTypesConfig {
  types: ContentTypeConfig[];
  updatedAt: string;
}

/* ─── V2: Configuración completa de un cuaderno ────────────────────── */

export interface BookConfig {
  cover: Cover;
  coverType: CoverType;
  lamination: Lamination;
  hojas: SheetCount;
  binding: Binding;         // determinado automáticamente por hojas
  contentType: ContentType;
  contentSubtype?: ContentSubtype; // solo si contentType === "cuaderno"
  customCover: boolean;     // portada personalizada → nota al WhatsApp
  customContent: boolean;   // contenido personalizado → nota al WhatsApp
  notes?: string;
}

/* ─── V2: Ítem del carrito ─────────────────────────────────────────── */

export interface ConfiguredItem {
  config: BookConfig;
  priceUSD: number;
  quantity: number;
}

/* ─── V2: Tabla de precios ─────────────────────────────────────────── */

export interface PricingRow {
  tipo: CoverType;
  hojas: SheetCount;
  encuadernado: Binding;
  brillante: number;   // USD
  mate: number;        // USD
  holografico: number; // USD
}

export interface PricingConfig {
  precios: PricingRow[];
  updatedAt: string;
}

/* ─── Tarjetas de presentación ──────────────────────────────────────── */

export interface TarjetaPricingRow {
  caras: "una-cara" | "dos-caras";
  acabado: string;
  precio100: number; // USD por cada 100 tarjetas
}

export interface TarjetasConfig {
  precios: TarjetaPricingRow[];
  cantidades: number[]; // unidades disponibles: [100, 200, 500, 1000]
  imagen?: string;       // imagen de referencia única para todas las tarjetas
  updatedAt: string;
}

export interface TarjetaCartItem {
  type: "tarjeta";
  caras: "una-cara" | "dos-caras";
  acabado: string;
  cantidad: number;  // unidades de tarjetas
  priceUSD: number;
  quantity: number;  // cantidad en el carrito
}

/* ─── Pegatinas ─────────────────────────────────────────────────────── */

export type PegatinaMaterial = "papel-fotografico" | "vinilo";
export type PegatinaTamano   = "2x2" | "3x3" | "4x4";

export interface PegatinaPricingRow {
  material: PegatinaMaterial;
  acabado:  string;
  precio2x2: number;
  precio3x3: number;
  precio4x4: number;
}

export interface PegatinasConfig {
  precios:   PegatinaPricingRow[];
  cantidad:  number; // fijo: 50
  imagen?:   string; // imagen de referencia única para todas las pegatinas
  updatedAt: string;
}

export interface PegatinaCartItem {
  type:     "pegatina";
  material: string;
  acabado:  string;
  tamano:   PegatinaTamano;
  cantidad: number; // 50
  priceUSD: number;
  quantity: number;
}

/* ─── Carrito ───────────────────────────────────────────────────────── */

export type CartItem = ConfiguredItem | TarjetaCartItem | PegatinaCartItem;

export function isTarjetaItem(item: CartItem): item is TarjetaCartItem {
  return (item as TarjetaCartItem).type === "tarjeta";
}

export function isPegatinaItem(item: CartItem): item is PegatinaCartItem {
  return (item as PegatinaCartItem).type === "pegatina";
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
