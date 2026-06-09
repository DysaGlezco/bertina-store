import type { Metadata } from "next";
import TarjetasConfigurator from "@/components/configurator/TarjetasConfigurator";

export const metadata: Metadata = {
  title: "Tarjetas de presentación",
  description: "Configura tus tarjetas de presentación. Elige acabado y cantidad — precio en tiempo real.",
};

export default function TarjetasPage() {
  return <TarjetasConfigurator />;
}
