import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, createAdminClient } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("covers")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("covers").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
