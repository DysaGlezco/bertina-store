import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveContentTypesConfig } from "@/lib/supabase";
import type { ContentTypesConfig } from "@/types";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const config = body as ContentTypesConfig;
  if (!Array.isArray(config?.types)) {
    return NextResponse.json({ error: "Estructura inválida: se espera { types: [...] }" }, { status: 400 });
  }

  const ok = await saveContentTypesConfig({ ...config, updatedAt: new Date().toISOString() });
  if (!ok) return NextResponse.json({ error: "Error guardando en Supabase" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
