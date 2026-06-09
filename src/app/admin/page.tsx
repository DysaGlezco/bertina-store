"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, LogOut, X, Save, MessageSquareQuote, Image as ImageIcon, DollarSign, BookOpen, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import pricingFallback from "@/data/pricing.json";
import contentTypesFallback from "@/data/content-types.json";
import tarjetasFallback from "@/data/tarjetas-config.json";
import pegatinaseFallback from "@/data/pegatinas-config.json";
import type { Cover, ContentTypeConfig, PricingRow, TarjetaPricingRow, PegatinaPricingRow } from "@/types";
import { BINDING_LABEL, COVER_TYPE_LABEL, CARAS_LABEL, MATERIAL_LABEL } from "@/lib/constants";
import { slugify } from "@/lib/utils";

interface TestimonialRow {
  id: number;
  name: string;
  location: string;
  text: string;
  product: string | null;
  visible: boolean;
}

const EMPTY_TESTIMONIAL = {
  name: "", location: "", text: "", product: "", visible: true,
};

type Tab = "portadas" | "testimonios" | "precios" | "contenidos";

/* ─── Componente principal ───────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("portadas");

  /* ── Verificar sesión al cargar ── */
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => { if (session) setAuthed(true); })
      .finally(() => setChecking(false));
  }, []);

  /* ── Login ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setLoginError("Correo o contraseña incorrectos"); }
    else { setAuthed(true); }
  }

  /* ── Logout ── */
  async function handleLogout() {
    await supabase.auth.signOut();
    setAuthed(false);
  }

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════ */
  /*  PANTALLA DE LOGIN                                                 */
  /* ══════════════════════════════════════════════════════════════════ */
  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <h1 className="font-serif text-2xl text-ink">Panel de administración</h1>
          <div className="w-8 h-px bg-gold mx-auto" />
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={input}
            required
          />
          {loginError && <p className="font-sans text-xs text-center text-red-400">{loginError}</p>}
          <button type="submit" className="btn-primary w-full">Entrar</button>
        </form>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════ */
  /*  PANEL PRINCIPAL                                                   */
  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-5xl mx-auto px-6 pb-10 pt-20 space-y-8">

      {/* ── Barra superior ── */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Administración</h1>
        <button
          onClick={handleLogout}
          className="text-warmgray hover:text-ink transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-cream-warm border border-cream-deep rounded-xl p-1 w-fit">
        {([
          { key: "portadas", label: "Portadas", Icon: ImageIcon },
          { key: "testimonios", label: "Testimonios", Icon: MessageSquareQuote },
          { key: "precios", label: "Precios", Icon: DollarSign },
          { key: "contenidos", label: "Contenidos", Icon: BookOpen },
        ] as { key: Tab; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[]).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-sans text-sm transition-all duration-200 ${
              activeTab === key
                ? "bg-white text-ink shadow-sm"
                : "text-warmgray hover:text-ink"
            }`}
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Contenido por pestaña ── */}
      {activeTab === "portadas"    && <CoversTab />}
      {activeTab === "testimonios" && <TestimonialsTab />}
      {activeTab === "precios"     && <PricingTab />}
      {activeTab === "contenidos"  && <ContentTypesTab />}

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  TAB: PORTADAS                                                          */
/* ══════════════════════════════════════════════════════════════════════ */
const EMPTY_COVER = { name: "", slug: "", description: "", available: true };

function CoversTab() {
  const [covers, setCovers]             = useState<Cover[]>([]);
  const [loading, setLoading]           = useState(false);
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [form, setForm]                 = useState({ ...EMPTY_COVER });
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");

  const loadCovers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("covers")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setCovers(data as Cover[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadCovers(); }, [loadCovers]);

  function revokePreview(preview: string) {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
  }

  function closeForm() {
    revokePreview(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_COVER });
    revokePreview(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(c: Cover) {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description ?? "", available: c.available });
    revokePreview(imagePreview);
    setImageFile(null);
    setImagePreview(c.images[0] ?? "");
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    revokePreview(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    let finalImageUrl = imagePreview.startsWith("blob:") ? "" : imagePreview;

    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (!url) {
        setError("Error al subir la imagen. Intenta de nuevo.");
        setSaving(false);
        return;
      }
      finalImageUrl = url;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      images: finalImageUrl ? [finalImageUrl] : [],
      available: form.available,
    };

    const { error: dbError } = editingId
      ? await supabase.from("covers").update(payload).eq("id", editingId)
      : await supabase.from("covers").insert(payload);

    if (dbError) {
      setError(dbError.message);
    } else {
      revokePreview(imagePreview);
      setImageFile(null);
      setImagePreview("");
      setShowForm(false);
      setEditingId(null);
      await loadCovers();
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar la portada "${name}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from("covers").delete().eq("id", id);
    await loadCovers();
  }

  function handleNameChange(v: string) {
    setForm(f => ({ ...f, name: v, slug: f.slug === "" || f.slug === slugify(f.name) ? slugify(v) : f.slug }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs text-warmgray">{covers.length} portada(s)</p>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus size={15} /> Nueva portada
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-cream-deep rounded-2xl p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-ink">{editingId ? "Editar portada" : "Nueva portada"}</h2>
            <button onClick={closeForm} className="text-warmgray hover:text-ink transition-colors">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre *">
                <input required value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="Sage Linen" className={input} />
              </Field>
              <Field label="Slug *">
                <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="sage-linen" className={input} />
              </Field>
            </div>
            <Field label="Descripción (opcional)">
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Textura de lino natural en tono salvia, ideal para un look minimalista."
                className={`${input} resize-none`}
              />
            </Field>
            <Field label="Imagen">
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <div className="relative w-28 shrink-0">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-cream-warm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => { revokePreview(imagePreview); setImageFile(null); setImagePreview(""); }}
                      className="absolute -top-1.5 -right-1.5 bg-white border border-cream-deep rounded-full p-0.5 text-warmgray hover:text-red-400 transition-colors shadow-sm"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <label className={`flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border-2 border-dashed border-cream-deep hover:border-gold bg-cream-warm/40 rounded-xl ${imagePreview ? "w-20 aspect-square" : "w-28 aspect-[3/4]"}`}>
                  <Upload size={imagePreview ? 16 : 20} strokeWidth={1.5} className="text-warmgray" />
                  <span className="font-sans text-[10px] text-warmgray text-center leading-tight px-1">
                    {imagePreview ? "Cambiar" : "Seleccionar imagen"}
                  </span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                </label>
              </div>
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="w-4 h-4 accent-gold" />
              <span className="font-sans text-sm text-warmgray">Disponible en catálogo</span>
            </label>
            {error && <p className="font-sans text-xs text-red-400">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary gap-2">
                <Save size={15} /> {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear portada"}
              </button>
              <button type="button" onClick={closeForm} className="btn-outline">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : covers.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="font-serif text-lg text-warmgray italic">No hay portadas aún.</p>
          <p className="font-sans text-sm text-warmgray/60">Crea tu primera portada con el botón de arriba.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {covers.map(c => (
            <div key={c.id} className="bg-white border border-cream-deep rounded-xl overflow-hidden group">
              <div className="relative aspect-[3/4] bg-cream-warm">
                {c.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.images[0]} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-warmgray/30">
                    <ImageIcon size={32} strokeWidth={1} />
                  </div>
                )}
                {!c.available && (
                  <span className="absolute top-2 right-2 font-sans text-[9px] tracking-widest uppercase bg-warmgray/80 text-white px-2 py-0.5 rounded-full">
                    Oculta
                  </span>
                )}
              </div>
              <div className="p-3 space-y-0.5">
                <p className="font-serif text-sm text-ink truncate">{c.name}</p>
                <p className="font-mono text-[10px] text-warmgray/60 truncate">{c.slug}</p>
                {c.description && (
                  <p className="font-sans text-[11px] text-warmgray leading-relaxed line-clamp-2 pt-0.5">{c.description}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-cream-deep rounded-lg text-warmgray hover:text-gold hover:border-gold transition-colors text-xs">
                    <Pencil size={12} /> Editar
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 border border-cream-deep rounded-lg text-warmgray hover:text-red-400 hover:border-red-200 transition-colors">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  TAB: TESTIMONIOS                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_TESTIMONIAL });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTestimonials(data as TestimonialRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadTestimonials(); }, [loadTestimonials]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_TESTIMONIAL });
    setError("");
    setShowForm(true);
  }

  function openEdit(t: TestimonialRow) {
    setEditingId(t.id);
    setForm({ name: t.name, location: t.location, text: t.text, product: t.product ?? "", visible: t.visible });
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      text: form.text.trim(),
      product: form.product.trim() || null,
      visible: form.visible,
    };

    const { error: dbError } = editingId
      ? await supabase.from("testimonials").update(payload).eq("id", editingId)
      : await supabase.from("testimonials").insert(payload);

    if (dbError) { setError(dbError.message); }
    else { setShowForm(false); setEditingId(null); await loadTestimonials(); }
    setSaving(false);
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`¿Eliminar el testimonio de "${name}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from("testimonials").delete().eq("id", id);
    await loadTestimonials();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs text-warmgray">{testimonials.length} testimonios</p>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus size={15} /> Nuevo testimonio
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-cream-deep rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-ink">{editingId ? "Editar testimonio" : "Nuevo testimonio"}</h2>
            <button onClick={() => setShowForm(false)} className="text-warmgray hover:text-ink transition-colors">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre *">
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="María F." className={input} />
              </Field>
              <Field label="Ciudad / Ubicación *">
                <input required value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="La Habana" className={input} />
              </Field>
            </div>
            <Field label="Testimonio *">
              <textarea required value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={4} placeholder="Nunca pensé que un cuaderno me haría querer escribir todos los días..." className={`${input} resize-none`} />
            </Field>
            <Field label="Producto mencionado (opcional)">
              <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="Cuaderno Sage Linen" className={input} />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} className="w-4 h-4 accent-gold" />
              <span className="font-sans text-sm text-warmgray">Visible en el sitio</span>
            </label>
            {error && <p className="font-sans text-xs text-red-400">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary gap-2">
                <Save size={15} /> {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear testimonio"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="font-serif text-lg text-warmgray italic">No hay testimonios aún.</p>
          <p className="font-sans text-sm text-warmgray-light">Añade el primero con el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white border border-cream-deep rounded-xl px-6 py-4 flex items-start gap-4">
              <span className="font-serif text-3xl text-cream-deep leading-none select-none flex-shrink-0 mt-1">"</span>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-sans text-sm font-medium text-ink">{t.name}</p>
                  <span className="font-sans text-xs text-warmgray">· {t.location}</span>
                  {t.product && (
                    <span className="font-sans text-[10px] tracking-widest uppercase border border-sage/40 text-sage px-2 py-0.5 rounded-full">{t.product}</span>
                  )}
                  {!t.visible && (
                    <span className="font-sans text-[10px] tracking-widest uppercase bg-warmgray/20 text-warmgray px-2 py-0.5 rounded-full">Oculto</span>
                  )}
                </div>
                <p className="font-serif text-sm text-warmgray italic leading-relaxed line-clamp-2">{t.text}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(t)} className="text-warmgray hover:text-gold transition-colors p-1" title="Editar">
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button onClick={() => handleDelete(t.id, t.name)} className="text-warmgray hover:text-red-400 transition-colors p-1" title="Eliminar">
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Tab: Precios ──────────────────────────────────────────────────── */

function PricingTab() {
  const [product, setProduct] = useState<"cuadernos" | "tarjetas" | "pegatinas">("cuadernos");
  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-cream-warm border border-cream-deep rounded-xl p-1 w-fit">
        {(["cuadernos", "tarjetas", "pegatinas"] as const).map(p => (
          <button
            key={p}
            onClick={() => setProduct(p)}
            className={`px-5 py-2 rounded-lg font-sans text-sm transition-all duration-200 capitalize ${
              product === p ? "bg-white text-ink shadow-sm" : "text-warmgray hover:text-ink"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      {product === "cuadernos"  && <CuadernosPricingTable />}
      {product === "tarjetas"   && <TarjetasPricingTable />}
      {product === "pegatinas"  && <PegatinasPricingTable />}
    </div>
  );
}

function CuadernosPricingTable() {
  const [rows, setRows]         = useState<PricingRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("pricing_config").select("precios").eq("id", 1).single();
        if (Array.isArray(data?.precios) && data.precios.length > 0)
          setRows(data.precios);
        else
          setRows((pricingFallback as { precios: PricingRow[] }).precios);
      } catch {
        setRows((pricingFallback as { precios: PricingRow[] }).precios);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handlePrice(idx: number, field: "brillante" | "mate" | "holografico", value: string) {
    const num = parseFloat(value);
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: isNaN(num) ? 0 : num } : r));
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");
    const { error } = await supabase.from("pricing_config").upsert({
      id: 1, precios: rows, updated_at: new Date().toISOString(),
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); }
    else { setStatus("ok"); setTimeout(() => setStatus("idle"), 3000); }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl text-ink mb-1">Tabla de precios</h2>
        <p className="font-sans text-sm text-warmgray leading-relaxed">
          Edita directamente los precios por combinación. Los cambios se aplican al guardar.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-deep">
              <th className="pb-3 text-left font-sans text-[10px] tracking-widest uppercase text-warmgray pr-4 whitespace-nowrap">Tapa</th>
              <th className="pb-3 text-left font-sans text-[10px] tracking-widest uppercase text-warmgray pr-4">Hojas</th>
              <th className="pb-3 text-left font-sans text-[10px] tracking-widest uppercase text-warmgray pr-6 whitespace-nowrap">Encuadernado</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray px-3 whitespace-nowrap">Brillante</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray px-3">Mate</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray px-3 whitespace-nowrap">Holográfico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-deep/60">
            {rows.map((row, idx) => (
              <tr key={`${row.tipo}-${row.hojas}-${row.encuadernado}`}>
                <td className="py-3 pr-4">
                  <span className={`font-sans text-xs px-2.5 py-1 rounded-full ${row.tipo === "semidura" ? "bg-sage/10 text-sage" : "bg-cream-deep text-warmgray"}`}>
                    {COVER_TYPE_LABEL[row.tipo] ?? row.tipo}
                  </span>
                </td>
                <td className="py-3 pr-4"><span className="font-sans text-sm font-medium text-ink">{row.hojas}</span></td>
                <td className="py-3 pr-6"><span className="font-sans text-sm text-warmgray">{BINDING_LABEL[row.encuadernado] ?? row.encuadernado}</span></td>
                {(["brillante", "mate", "holografico"] as const).map(field => (
                  <td key={field} className="py-3 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-sans text-xs text-warmgray">$</span>
                      <input
                        type="number" step="0.01" min="0" value={row[field]}
                        onChange={e => handlePrice(idx, field, e.target.value)}
                        className="w-20 px-2 py-1.5 font-sans text-sm text-ink bg-white border border-cream-deep rounded-lg focus:outline-none focus:border-gold transition-colors text-right tabular-nums"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 pt-2 border-t border-cream-deep">
        <button onClick={handleSave} disabled={status === "saving"} className="btn-primary gap-2">
          <Save size={15} strokeWidth={1.5} />
          {status === "saving" ? "Guardando..." : "Guardar cambios"}
        </button>
        {status === "ok"    && <p className="font-sans text-sm text-sage">✓ Precios actualizados</p>}
        {status === "error" && <p className="font-sans text-sm text-red-400">{errorMsg}</p>}
      </div>
    </div>
  );
}

/* ─── Subtabla: Tarjetas ─────────────────────────────────────────────── */
async function uploadImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const fileName = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("covers").upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (error) return null;
  return supabase.storage.from("covers").getPublicUrl(fileName).data.publicUrl;
}

function TarjetasPricingTable() {
  const [rows, setRows]           = useState<TarjetaPricingRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [status, setStatus]       = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [cantidades, setCantidades] = useState<number[]>([]);
  const [imagen, setImagen]       = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("tarjetas_config").select("precios, cantidades, imagen").eq("id", 1).single();
        if (Array.isArray(data?.precios) && data.precios.length > 0) {
          setRows(data.precios);
          setCantidades(data.cantidades ?? [100, 200, 500, 1000]);
          setImagen(data.imagen ?? "");
        } else {
          setRows((tarjetasFallback as { precios: TarjetaPricingRow[] }).precios);
          setCantidades((tarjetasFallback as { cantidades: number[] }).cantidades);
        }
      } catch {
        setRows((tarjetasFallback as { precios: TarjetaPricingRow[] }).precios);
        setCantidades((tarjetasFallback as { cantidades: number[] }).cantidades);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handlePrice(idx: number, value: string) {
    const num = parseFloat(value);
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, precio100: isNaN(num) ? 0 : num } : r));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setImagen(url);
    setUploading(false);
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");
    const { error } = await supabase.from("tarjetas_config").upsert({
      id: 1, precios: rows, cantidades, imagen: imagen || null, updated_at: new Date().toISOString(),
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); }
    else { setStatus("ok"); setTimeout(() => setStatus("idle"), 3000); }
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <p className="font-sans text-sm text-warmgray">
        Precio por cada 100 tarjetas. El configurador calcula el total según la cantidad elegida.
      </p>

      {/* Imagen de referencia única */}
      <div className="flex items-start gap-5 p-5 bg-cream-warm border border-cream-deep rounded-xl">
        <div>
          <p className="font-sans text-xs tracking-widest uppercase text-warmgray mb-3">Imagen de referencia</p>
          <div className="flex items-start gap-4">
            {imagen ? (
              <div className="relative w-28 shrink-0">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-cream-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagen} alt="Imagen de referencia tarjetas" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setImagen("")}
                  className="absolute -top-1.5 -right-1.5 bg-white border border-cream-deep rounded-full p-0.5 text-warmgray hover:text-red-400 transition-colors shadow-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ) : null}
            <label className={`flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors border-2 border-dashed border-cream-deep hover:border-gold bg-white rounded-xl ${imagen ? "w-20 aspect-square" : "w-28 aspect-[3/4]"}`}>
              {uploading
                ? <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                : <><Upload size={imagen ? 16 : 20} strokeWidth={1.5} className="text-warmgray" />
                   <span className="font-sans text-[10px] text-warmgray text-center leading-tight px-1">
                     {imagen ? "Cambiar" : "Subir imagen"}
                   </span></>
              }
              <input type="file" accept="image/*" className="sr-only"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Tabla de precios */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-deep">
              <th className="pb-3 text-left font-sans text-[10px] tracking-widest uppercase text-warmgray pr-4 whitespace-nowrap">Caras</th>
              <th className="pb-3 text-left font-sans text-[10px] tracking-widest uppercase text-warmgray pr-6">Acabado</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray px-3 whitespace-nowrap">Precio / 100 und.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-deep/60">
            {rows.map((row, idx) => (
              <tr key={`${row.caras}-${row.acabado}`}>
                <td className="py-3 pr-4">
                  <span className={`font-sans text-xs px-2.5 py-1 rounded-full ${row.caras === "una-cara" ? "bg-sage/10 text-sage" : "bg-cream-deep text-warmgray"}`}>
                    {CARAS_LABEL[row.caras] ?? row.caras}
                  </span>
                </td>
                <td className="py-3 pr-6"><span className="font-sans text-sm text-ink">{row.acabado}</span></td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-sans text-xs text-warmgray">$</span>
                    <input
                      type="number" step="0.01" min="0" value={row.precio100}
                      onChange={e => handlePrice(idx, e.target.value)}
                      className="w-24 px-2 py-1.5 font-sans text-sm text-ink bg-white border border-cream-deep rounded-lg focus:outline-none focus:border-gold transition-colors text-right tabular-nums"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 pt-2 border-t border-cream-deep">
        <button onClick={handleSave} disabled={status === "saving"} className="btn-primary gap-2">
          <Save size={15} strokeWidth={1.5} />
          {status === "saving" ? "Guardando..." : "Guardar cambios"}
        </button>
        {status === "ok"    && <p className="font-sans text-sm text-sage">✓ Precios actualizados</p>}
        {status === "error" && <p className="font-sans text-sm text-red-400">{errorMsg}</p>}
      </div>
    </div>
  );
}

/* ─── Subtabla: Pegatinas ────────────────────────────────────────────── */

function PegatinasPricingTable() {
  const [rows, setRows]         = useState<PegatinaPricingRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("pegatinas_config").select("precios, cantidad").eq("id", 1).single();
        if (Array.isArray(data?.precios) && data.precios.length > 0)
          setRows(data.precios);
        else
          setRows((pegatinaseFallback as { precios: PegatinaPricingRow[] }).precios);
      } catch {
        setRows((pegatinaseFallback as { precios: PegatinaPricingRow[] }).precios);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handlePrice(idx: number, field: "precio2x2" | "precio3x3" | "precio4x4", value: string) {
    const num = parseFloat(value);
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: isNaN(num) ? 0 : num } : r));
  }

  async function handleImageUpload(idx: number, file: File) {
    setUploadingIdx(idx);
    const url = await uploadImage(file);
    if (url) setRows(prev => prev.map((r, i) => i === idx ? { ...r, imagen: url } : r));
    setUploadingIdx(null);
  }

  function handleRemoveImage(idx: number) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, imagen: undefined } : r));
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");
    const { error } = await supabase.from("pegatinas_config").upsert({
      id: 1, precios: rows, cantidad: 50, updated_at: new Date().toISOString(),
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); }
    else { setStatus("ok"); setTimeout(() => setStatus("idle"), 3000); }
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <p className="font-sans text-sm text-warmgray">
        Precio por 50 unidades según material, acabado y tamaño.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cream-deep">
              <th className="pb-3 text-left font-sans text-[10px] tracking-widest uppercase text-warmgray pr-4">Material</th>
              <th className="pb-3 text-left font-sans text-[10px] tracking-widest uppercase text-warmgray pr-4">Acabado</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray px-3">2×2</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray px-3">3×3</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray px-3">4×4</th>
              <th className="pb-3 text-center font-sans text-[10px] tracking-widest uppercase text-warmgray">Imagen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-deep/60">
            {rows.map((row, idx) => (
              <tr key={`${row.material}-${row.acabado}`}>
                <td className="py-3 pr-4">
                  <span className={`font-sans text-xs px-2.5 py-1 rounded-full ${row.material === "papel-fotografico" ? "bg-sage/10 text-sage" : "bg-cream-deep text-warmgray"}`}>
                    {MATERIAL_LABEL[row.material] ?? row.material}
                  </span>
                </td>
                <td className="py-3 pr-4"><span className="font-sans text-sm text-ink">{row.acabado}</span></td>
                {(["precio2x2", "precio3x3", "precio4x4"] as const).map(field => (
                  <td key={field} className="py-3 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-sans text-xs text-warmgray">$</span>
                      <input
                        type="number" step="0.01" min="0" value={row[field]}
                        onChange={e => handlePrice(idx, field, e.target.value)}
                        className="w-20 px-2 py-1.5 font-sans text-sm text-ink bg-white border border-cream-deep rounded-lg focus:outline-none focus:border-gold transition-colors text-right tabular-nums"
                      />
                    </div>
                  </td>
                ))}
                <td className="py-3 pl-3">
                  <div className="flex items-center justify-center gap-2">
                    {row.imagen ? (
                      <>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream-warm flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.imagen} alt={row.acabado} className="w-full h-full object-cover" />
                        </div>
                        <button type="button" onClick={() => handleRemoveImage(idx)} className="text-warmgray/40 hover:text-red-400 transition-colors">
                          <X size={13} />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex items-center gap-1 font-sans text-xs text-gold hover:text-gold/70 transition-colors">
                        {uploadingIdx === idx
                          ? <div className="w-4 h-4 border border-gold border-t-transparent rounded-full animate-spin" />
                          : <><Upload size={13} /> Subir</>
                        }
                        <input type="file" accept="image/*" className="sr-only"
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(idx, f); }}
                          disabled={uploadingIdx !== null}
                        />
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 pt-2 border-t border-cream-deep">
        <button onClick={handleSave} disabled={status === "saving"} className="btn-primary gap-2">
          <Save size={15} strokeWidth={1.5} />
          {status === "saving" ? "Guardando..." : "Guardar cambios"}
        </button>
        {status === "ok"    && <p className="font-sans text-sm text-sage">✓ Precios actualizados</p>}
        {status === "error" && <p className="font-sans text-sm text-red-400">{errorMsg}</p>}
      </div>
    </div>
  );
}

/* ─── Tab: Tipos de contenido ───────────────────────────────────────── */
function ContentTypesTab() {
  const [types, setTypes] = useState<ContentTypeConfig[]>(
    () => (contentTypesFallback as { types: ContentTypeConfig[] }).types
  );
  const [status, setStatus]     = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newTypeForm, setNewTypeForm] = useState<Record<string, { label: string; modifier: string }>>({});

  /* ── Cargar desde Supabase al montar ── */
  useEffect(() => {
    supabase.from("content_types_config").select("types").eq("id", 1).single()
      .then(({ data }) => {
        if (Array.isArray(data?.types) && data.types.length > 0) setTypes(data.types);
      });
  }, []);

  const groups = Array.from(new Set(types.map((t) => t.group)));

  function handleModifier(id: string, value: string) {
    const num = parseFloat(value);
    setTypes((prev) => prev.map((t) => (t.id === id ? { ...t, priceModifier: isNaN(num) ? 0 : num } : t)));
  }
  function handleVisible(id: string, checked: boolean) {
    setTypes((prev) => prev.map((t) => (t.id === id ? { ...t, visible: checked } : t)));
  }
  function handleDeleteType(id: string) {
    setTypes((prev) => prev.filter((t) => t.id !== id));
  }
  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    setNewTypeForm((prev) => ({ ...prev, [name]: { label: "", modifier: "0" } }));
    setNewCategoryName("");
    setShowNewCategory(false);
  }
  function handleAddType(group: string) {
    const form = newTypeForm[group];
    if (!form?.label.trim()) return;
    const id = slugify(form.label);
    if (types.find((t) => t.id === id)) return;
    const newType: ContentTypeConfig = {
      id, label: form.label.trim(), group,
      priceModifier: parseFloat(form.modifier) || 0, visible: true,
    };
    setTypes((prev) => [...prev, newType]);
    setNewTypeForm((prev) => ({ ...prev, [group]: { label: "", modifier: "0" } }));
  }
  function handleDeleteCategory(group: string) {
    if (!confirm(`¿Eliminar la categoría "${group}" y todos sus tipos?`)) return;
    setTypes((prev) => prev.filter((t) => t.group !== group));
    setNewTypeForm((prev) => { const n = { ...prev }; delete n[group]; return n; });
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMsg("");
    const { error } = await supabase.from("content_types_config").upsert({
      id: 1, types, updated_at: new Date().toISOString(),
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); }
    else { setStatus("ok"); setTimeout(() => setStatus("idle"), 3000); }
  }

  const allGroups = Array.from(new Set([...groups, ...Object.keys(newTypeForm)]));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-ink mb-1">Tipos de contenido</h2>
          <p className="font-sans text-sm text-warmgray leading-relaxed">
            Gestiona categorías y tipos. El modificador (USD) se suma al precio base de 100 hojas + Wire-O + laminado.
          </p>
        </div>
        <button onClick={() => setShowNewCategory((s) => !s)} className="btn-outline shrink-0 gap-2 text-xs">
          <Plus size={13} /> Nueva categoría
        </button>
      </div>

      {showNewCategory && (
        <div className="flex gap-2 items-center p-4 bg-cream-warm border border-cream-deep rounded-xl">
          <input
            autoFocus type="text" placeholder="Nombre de la categoría (ej: Emprendimientos)"
            value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="flex-1 px-4 py-2 font-sans text-sm text-ink bg-white border border-cream-deep rounded-lg focus:outline-none focus:border-gold transition-colors"
          />
          <button onClick={handleAddCategory} className="btn-primary text-xs px-4">Crear</button>
          <button onClick={() => setShowNewCategory(false)} className="text-warmgray hover:text-ink"><X size={16} /></button>
        </div>
      )}

      <div className="space-y-8">
        {allGroups.map((group) => (
          <div key={group}>
            <div className="flex items-center justify-between border-b border-cream-deep pb-2 mb-3">
              <p className="font-sans text-xs tracking-widest uppercase text-warmgray">{group}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewTypeForm((prev) => ({ ...prev, [group]: prev[group] ?? { label: "", modifier: "0" } }))}
                  className="flex items-center gap-1 font-sans text-xs text-gold hover:text-gold/70 transition-colors"
                >
                  <Plus size={12} /> Nuevo tipo
                </button>
                <button onClick={() => handleDeleteCategory(group)} className="text-warmgray/40 hover:text-red-400 transition-colors ml-2" title="Eliminar categoría">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {types.filter((t) => t.group === group).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-1.5">
                  <input type="checkbox" checked={t.visible} onChange={(e) => handleVisible(t.id, e.target.checked)} className="accent-gold shrink-0" title="Visible en el configurador" />
                  <span className="font-sans text-sm text-ink flex-1">{t.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-sans text-xs text-warmgray">+$</span>
                    <input
                      type="number" step="0.01" min="0" value={t.priceModifier}
                      onChange={(e) => handleModifier(t.id, e.target.value)}
                      className="w-24 px-3 py-1.5 font-sans text-sm text-ink bg-white border border-cream-deep rounded-lg focus:outline-none focus:border-gold transition-colors text-right"
                    />
                    <span className="font-sans text-xs text-warmgray">USD</span>
                  </div>
                  <button onClick={() => handleDeleteType(t.id)} className="text-warmgray/40 hover:text-red-400 transition-colors" title="Eliminar tipo">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            {newTypeForm[group] !== undefined && (
              <div className="mt-3 flex gap-2 items-center pl-6 p-3 bg-cream-warm border border-dashed border-cream-deep rounded-lg">
                <input
                  autoFocus type="text" placeholder="Nombre del tipo (ej: Manicure)"
                  value={newTypeForm[group].label}
                  onChange={(e) => setNewTypeForm((prev) => ({ ...prev, [group]: { ...prev[group], label: e.target.value } }))}
                  onKeyDown={(e) => e.key === "Enter" && handleAddType(group)}
                  className="flex-1 px-3 py-1.5 font-sans text-sm text-ink bg-white border border-cream-deep rounded-lg focus:outline-none focus:border-gold transition-colors"
                />
                <span className="font-sans text-xs text-warmgray shrink-0">+$</span>
                <input
                  type="number" step="0.01" min="0" placeholder="0.00"
                  value={newTypeForm[group].modifier}
                  onChange={(e) => setNewTypeForm((prev) => ({ ...prev, [group]: { ...prev[group], modifier: e.target.value } }))}
                  className="w-20 px-3 py-1.5 font-sans text-sm text-ink bg-white border border-cream-deep rounded-lg focus:outline-none focus:border-gold transition-colors text-right"
                />
                <span className="font-sans text-xs text-warmgray shrink-0">USD</span>
                <button onClick={() => handleAddType(group)} className="btn-primary text-xs px-3 py-1.5 shrink-0">Añadir</button>
                <button onClick={() => setNewTypeForm((prev) => { const n = { ...prev }; delete n[group]; return n; })} className="text-warmgray hover:text-ink shrink-0">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-cream-deep">
        <button onClick={handleSave} disabled={status === "saving"} className="btn-primary gap-2">
          <Save size={15} strokeWidth={1.5} />
          {status === "saving" ? "Guardando..." : "Guardar cambios"}
        </button>
        {status === "ok"    && <p className="font-sans text-sm text-sage">✓ Contenidos actualizados</p>}
        {status === "error" && <p className="font-sans text-sm text-red-400">{errorMsg}</p>}
      </div>
    </div>
  );
}

/* ─── Helpers compartidos ──────────────────────────────────────────── */
const input = "w-full px-4 py-2.5 rounded-xl border border-cream-deep bg-cream font-sans text-sm text-ink placeholder:text-warmgray-light focus:outline-none focus:border-gold transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-sans text-xs tracking-wide text-warmgray uppercase">{label}</label>
      {children}
    </div>
  );
}
