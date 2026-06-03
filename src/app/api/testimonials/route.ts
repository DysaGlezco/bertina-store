import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { cookies } from "next/headers";

function isAuthenticated(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore.get("admin_session")?.value === "authenticated";
}

/* ─── GET /api/testimonials ─────────────────────────────────────────── */
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* ─── POST /api/testimonials ────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isAuthenticated(cookieStore)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("testimonials")
    .insert([{
      name: body.name,
      location: body.location,
      text: body.text,
      product: body.product || null,
      visible: body.visible ?? true,
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
