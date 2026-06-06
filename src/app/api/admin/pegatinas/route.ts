import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPegatinasConfig, savePegatinasConfig } from "@/lib/supabase";

async function checkAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "authenticated";
}

export async function GET() {
  const config = await getPegatinasConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  if (!await checkAuth()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json();
  if (!Array.isArray(body?.precios) || body.precios.length === 0) {
    return NextResponse.json({ error: "Faltan los precios" }, { status: 400 });
  }
  const ok = await savePegatinasConfig({ ...body, updatedAt: new Date().toISOString() });
  if (!ok) return NextResponse.json({ error: "Error guardando en Supabase" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
