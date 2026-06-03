import type {
  PricingConfig,
  PricingRow,
  Lamination,
  Binding,
  CoverType,
  SheetCount,
  BookConfig,
  ContentTypeConfig,
} from "@/types";

export function getBindingFromHojas(hojas: SheetCount): Binding {
  return hojas <= 100 ? "flejes" : "argollas";
}

export function getCoverTypeFromHojas(hojas: SheetCount): CoverType {
  return hojas === 40 ? "semidura" : "dura";
}

export function lookupPrice(
  config: PricingConfig,
  hojas: SheetCount,
  lamination: Lamination,
  binding?: Binding
): number | null {
  const tipo = getCoverTypeFromHojas(hojas);
  // Si se pasa binding explícito se usa; si no, se infiere del conteo de hojas
  const encuadernado = binding ?? getBindingFromHojas(hojas);
  const row = config.precios.find(
    (r: PricingRow) =>
      r.tipo === tipo && r.hojas === hojas && r.encuadernado === encuadernado
  );
  if (!row) return null;
  return row[lamination];
}

// Tipos de contenido que no son cuaderno usan 100 hojas + flejes (dura)
export const NON_CUADERNO_HOJAS: SheetCount = 100;
export const NON_CUADERNO_BINDING: Binding = "flejes";

export function calculatePrice(
  bookConfig: BookConfig,
  pricingConfig: PricingConfig,
  contentTypes?: ContentTypeConfig[]
): number {
  const isCuaderno = bookConfig.contentType === "cuaderno";
  const effectiveHojas: SheetCount = isCuaderno ? bookConfig.hojas : NON_CUADERNO_HOJAS;
  const effectiveBinding: Binding = isCuaderno ? bookConfig.binding : NON_CUADERNO_BINDING;

  const basePrice = lookupPrice(pricingConfig, effectiveHojas, bookConfig.lamination, effectiveBinding) ?? 0;

  if (isCuaderno || !contentTypes?.length) return basePrice;

  const ctConfig = contentTypes.find((ct) => ct.id === bookConfig.contentType);
  return basePrice + (ctConfig?.priceModifier ?? 0);
}

export function getMinPrice(pricingConfig: PricingConfig): number {
  if (!pricingConfig.precios.length) return 0;
  return Math.min(
    ...pricingConfig.precios.flatMap((r: PricingRow) => [
      r.brillante,
      r.mate,
      r.holografico,
    ])
  );
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
