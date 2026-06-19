import { notFound } from "next/navigation";
import { getCoverBySlug, getCovers, getPricingConfig, getContentTypesConfig } from "@/lib/supabase";
import type { Metadata } from "next";
import ConfiguratorClient from "@/components/configurator/ConfiguratorClient";

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  const covers = await getCovers();
  return covers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cover = await getCoverBySlug(slug);
  if (!cover) return {};
  return {
    title: `Configurar — ${cover.name}`,
    description: `Personaliza tu cuaderno con portada ${cover.name}.`,
  };
}

export default async function ConfigurarPage({ params }: Props) {
  const { slug } = await params;
  const [cover, pricingConfig, contentTypesConfig] = await Promise.all([
    getCoverBySlug(slug),
    getPricingConfig(),
    getContentTypesConfig(),
  ]);
  if (!cover) notFound();
  return (
    <ConfiguratorClient
      cover={cover}
      pricingConfig={pricingConfig}
      contentTypes={contentTypesConfig.types}
    />
  );
}
