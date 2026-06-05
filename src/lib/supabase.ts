import { createClient } from "@supabase/supabase-js";
import type { Testimonial, Cover, PricingConfig, ContentTypesConfig, TarjetasConfig } from "@/types";
import testimonialsJson from "@/data/testimonials.json";
import coversJson from "@/data/covers.json";
import pricingJson from "@/data/pricing.json";
import contentTypesJson from "@/data/content-types.json";
import tarjetasJson from "@/data/tarjetas-config.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente con service role para operaciones de escritura desde el servidor
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

/* ─── Queries ──────────────────────────────────────────────────────── */

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("visible", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Supabase no disponible, usando testimonios locales.");
    return testimonialsJson as Testimonial[];
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: row.name,
    location: row.location,
    text: row.text,
    product: row.product ?? undefined,
  }));
}

/* ─── Portadas (V2) ────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToCover(row: any): Cover {
  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    images: row.images ?? [],
    available: row.available ?? true,
  };
}

export async function getCovers(): Promise<Cover[]> {
  const { data, error } = await supabase
    .from("covers")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: true });

  if (error) return coversJson as Cover[];
  return (data ?? []).map(mapRowToCover);
}

export async function getCoverBySlug(slug: string): Promise<Cover | null> {
  const { data, error } = await supabase
    .from("covers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return (coversJson as Cover[]).find((c) => c.slug === slug) ?? null;
  }
  return mapRowToCover(data);
}

/* ─── Configuración de precios (V2) ────────────────────────────────── */

export async function getPricingConfig(): Promise<PricingConfig> {
  const { data, error } = await supabase
    .from("pricing_config")
    .select("precios, updated_at")
    .eq("id", 1)
    .single();

  if (error || !data) return pricingJson as PricingConfig;
  return { precios: data.precios, updatedAt: data.updated_at };
}

export async function savePricingConfig(config: PricingConfig): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from("pricing_config").upsert({
    id: 1,
    precios: config.precios,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

/* ─── Tipos de contenido (V2) ───────────────────────────────────────── */

export async function getContentTypesConfig(): Promise<ContentTypesConfig> {
  const { data, error } = await supabase
    .from("content_types_config")
    .select("types, updated_at")
    .eq("id", 1)
    .single();

  if (error || !data) return contentTypesJson as ContentTypesConfig;
  return { types: data.types, updatedAt: data.updated_at };
}

export async function saveContentTypesConfig(config: ContentTypesConfig): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from("content_types_config").upsert({
    id: 1,
    types: config.types,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

/* ─── Tarjetas de presentación ──────────────────────────────────────── */

export async function getTarjetasConfig(): Promise<TarjetasConfig> {
  const { data, error } = await supabase
    .from("tarjetas_config")
    .select("precios, cantidades, updated_at")
    .eq("id", 1)
    .single();

  if (error || !data) return tarjetasJson as TarjetasConfig;
  return { precios: data.precios, cantidades: data.cantidades, updatedAt: data.updated_at };
}

export async function saveTarjetasConfig(config: TarjetasConfig): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await admin.from("tarjetas_config").upsert({
    id: 1,
    precios: config.precios,
    cantidades: config.cantidades,
    updated_at: new Date().toISOString(),
  });
  return !error;
}
