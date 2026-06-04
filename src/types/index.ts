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

/* ─── Carrito ───────────────────────────────────────────────────────── */

export type CartItem = ConfiguredItem;

export interface CartState {
  items: ConfiguredItem[];
  isOpen: boolean;
}
