import { Suspense } from "react";
import type { Metadata } from "next";
import ConfiguratorLoader from "@/components/configurator/ConfiguratorLoader";

export const metadata: Metadata = {
  title: "Configurar cuaderno",
  description: "Personaliza tu cuaderno. Elige laminado, tipo de contenido y cantidad de hojas.",
};

export default function ConfigurarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ConfiguratorLoader />
    </Suspense>
  );
}
