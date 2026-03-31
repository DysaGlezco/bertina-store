import { notFound } from "next/navigation";
import productsData from "@/data/products.json";
import type { Product } from "@/types";
import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";

const products = productsData as Product[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
