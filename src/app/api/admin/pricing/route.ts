import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { savePricingConfig, getPricingConfig } from "@/lib/supabase";
import type { PricingConfig } from "@/types";

export async function GET() {
  const config = await getPricingConfig();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const config = body as PricingConfig;
  if (!Array.isArray(config?.precios) || config.precios.length === 0) {
    return NextResponse.json(
      { error: "El JSON debe tener un array 'precios' con al menos una fila" },
      { status: 400 }
    );
  }

  const required = ["tipo", "hojas", "encuadernado", "brillante", "mate", "holografico"];
  for (const row of config.precios) {
    for (const key of required) {
      if (!(key in row)) {
        return NextResponse.json(
          { error: `Falta el campo '${key}' en una fila` },
          { status: 400 }
        );
      }
    }
  }

  const ok = await savePricingConfig({ ...config, updatedAt: new Date().toISOString() });
  if (!ok) {
    return NextResponse.json({ error: "Error guardando en Supabase" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
