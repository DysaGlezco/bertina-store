import type { Metadata } from "next";
import PegatinasConfigurator from "@/components/configurator/PegatinasConfigurator";
import { getPegatinasConfig } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Pegatinas para marcas",
  description: "Configura tus pegatinas en papel fotográfico o vinilo. Elige acabado y tamaño — precio en tiempo real.",
};

export default async function PegatinasPage() {
  const config = await getPegatinasConfig();
  return <PegatinasConfigurator config={config} />;
}
