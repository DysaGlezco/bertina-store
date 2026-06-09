import type { Metadata } from "next";
import { getTarjetasConfig } from "@/lib/supabase";
import TarjetasConfigurator from "@/components/configurator/TarjetasConfigurator";

export const metadata: Metadata = {
  title: "Tarjetas de presentación",
  description: "Configura tus tarjetas de presentación. Elige acabado y cantidad — precio en tiempo real.",
};

export default async function TarjetasPage() {
  const config = await getTarjetasConfig();
  return <TarjetasConfigurator config={config} />;
}
