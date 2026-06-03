-- ═══════════════════════════════════════════════════════════════════════
--  Bertina Store — Schema completo (idempotente — seguro de re-ejecutar)
--  Ejecutar en: https://app.supabase.com → tu proyecto → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════


-- ── 1. PORTADAS (configurador V2) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS covers (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        UNIQUE NOT NULL,
  name        text        NOT NULL,
  description text,
  images      text[]      DEFAULT '{}',
  available   boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE covers ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE covers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "covers_public_read" ON covers;
DROP POLICY IF EXISTS "covers_admin_write" ON covers;
CREATE POLICY "covers_public_read"  ON covers FOR SELECT USING (true);
CREATE POLICY "covers_admin_write"  ON covers USING (auth.role() = 'service_role');


-- ── 2. TESTIMONIOS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name       text        NOT NULL,
  location   text        NOT NULL,
  text       text        NOT NULL,
  product    text,
  visible    boolean     DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_public_read" ON testimonials;
DROP POLICY IF EXISTS "testimonials_admin_write" ON testimonials;
CREATE POLICY "testimonials_public_read"  ON testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_admin_write"  ON testimonials USING (auth.role() = 'service_role');


-- ── 3. PRODUCTOS (catálogo V1 legacy) ────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug          text        UNIQUE NOT NULL,
  name          text        NOT NULL,
  description   text        DEFAULT '',
  price         numeric     NOT NULL DEFAULT 0,
  currency      text        DEFAULT 'COP',
  images        text[]      DEFAULT '{}',
  category      text        NOT NULL,
  type          text,
  collection    text,
  tags          text[]      DEFAULT '{}',
  in_stock      boolean     DEFAULT true,
  featured      boolean     DEFAULT false,
  is_new        boolean     DEFAULT false,
  limited_stock boolean     DEFAULT false,
  visible       boolean     DEFAULT true,
  details       text[]      DEFAULT '{}',
  benefits      text[]      DEFAULT '{}',
  process       text,
  reviews       jsonb       DEFAULT '[]',
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "products_admin_write" ON products;
CREATE POLICY "products_public_read"  ON products FOR SELECT USING (true);
CREATE POLICY "products_admin_write"  ON products USING (auth.role() = 'service_role');


-- ── 4. CONFIGURACIÓN DE PRECIOS (configurador V2) ────────────────────
CREATE TABLE IF NOT EXISTS pricing_config (
  id         int         PRIMARY KEY DEFAULT 1,
  precios    jsonb       NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pricing_public_read" ON pricing_config;
DROP POLICY IF EXISTS "pricing_admin_write" ON pricing_config;
CREATE POLICY "pricing_public_read"  ON pricing_config FOR SELECT USING (true);
CREATE POLICY "pricing_admin_write"  ON pricing_config USING (auth.role() = 'service_role');

INSERT INTO pricing_config (id, precios) VALUES (1, '[
  {"tipo":"semidura","hojas":40, "encuadernado":"flejes",  "brillante":2.19,"mate":2.30,"holografico":2.01},
  {"tipo":"dura",    "hojas":80, "encuadernado":"flejes",  "brillante":4.94,"mate":4.58,"holografico":5.14},
  {"tipo":"dura",    "hojas":90, "encuadernado":"flejes",  "brillante":5.09,"mate":4.72,"holografico":5.29},
  {"tipo":"dura",    "hojas":100,"encuadernado":"flejes",  "brillante":5.24,"mate":4.87,"holografico":5.44},
  {"tipo":"dura",    "hojas":150,"encuadernado":"flejes",  "brillante":5.97,"mate":5.61,"holografico":6.18},
  {"tipo":"dura",    "hojas":180,"encuadernado":"flejes",  "brillante":6.42,"mate":6.05,"holografico":6.62},
  {"tipo":"dura",    "hojas":210,"encuadernado":"flejes",  "brillante":6.86,"mate":6.49,"holografico":7.06},
  {"tipo":"dura",    "hojas":150,"encuadernado":"argollas","brillante":5.92,"mate":5.55,"holografico":6.12},
  {"tipo":"dura",    "hojas":180,"encuadernado":"argollas","brillante":6.36,"mate":5.99,"holografico":6.56},
  {"tipo":"dura",    "hojas":210,"encuadernado":"argollas","brillante":6.80,"mate":6.44,"holografico":7.00}
]') ON CONFLICT (id) DO NOTHING;


-- ── 5. TIPOS DE CONTENIDO (configurador V2) ──────────────────────────
CREATE TABLE IF NOT EXISTS content_types_config (
  id         int         PRIMARY KEY DEFAULT 1,
  types      jsonb       NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_types_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ct_public_read"  ON content_types_config;
DROP POLICY IF EXISTS "ct_admin_write"  ON content_types_config;
CREATE POLICY "ct_public_read"   ON content_types_config FOR SELECT USING (true);
CREATE POLICY "ct_admin_write"   ON content_types_config USING (auth.role() = 'service_role');


-- ── 6. STORAGE — bucket de imágenes de portadas ──────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "covers_storage_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "covers_storage_admin_insert"  ON storage.objects;
DROP POLICY IF EXISTS "covers_storage_admin_delete"  ON storage.objects;
CREATE POLICY "covers_storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "covers_storage_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'covers' AND auth.role() = 'service_role');
CREATE POLICY "covers_storage_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'covers' AND auth.role() = 'service_role');
