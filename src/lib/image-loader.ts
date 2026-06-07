export default function imageLoader({ src }: { src: string }) {
  // URLs absolutas (Supabase Storage, Google, etc.) se devuelven tal cual
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//")) {
    return src;
  }
  // Imágenes locales (/public) — añade el basePath de GitHub Pages
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${src}`;
}
