"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCoverBySlug, getPricingConfig, getContentTypesConfig } from "@/lib/supabase";
import ConfiguratorClient from "./ConfiguratorClient";
import type { Cover, PricingConfig, ContentTypeConfig } from "@/types";
import pricingJson from "@/data/pricing.json";
import contentTypesJson from "@/data/content-types.json";

export default function ConfiguratorLoader() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";

  const [cover, setCover] = useState<Cover | null>(null);
  const [missing, setMissing] = useState(false);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(
    pricingJson as PricingConfig
  );
  const [contentTypes, setContentTypes] = useState<ContentTypeConfig[]>(
    (contentTypesJson as { types: ContentTypeConfig[] }).types
  );

  useEffect(() => {
    if (!slug) { setMissing(true); return; }

    Promise.all([
      getCoverBySlug(slug),
      getPricingConfig(),
      getContentTypesConfig(),
    ]).then(([fetchedCover, pricing, ctConfig]) => {
      if (!fetchedCover) { setMissing(true); return; }
      setCover(fetchedCover);
      setPricingConfig(pricing);
      setContentTypes(ctConfig.types);
    });
  }, [slug]);

  if (missing) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <p className="font-serif text-xl italic text-warmgray">
          Portada no encontrada.
        </p>
      </div>
    );
  }

  if (!cover) {
    // Skeleton mínimo mientras carga
    return <div className="min-h-screen" />;
  }

  return (
    <ConfiguratorClient
      cover={cover}
      pricingConfig={pricingConfig}
      contentTypes={contentTypes}
    />
  );
}
