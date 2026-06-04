import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://bertinastore.vercel.app"),
  title: {
    default: "Bertina Store — Papelería de diseño y cuadernos artesanales",
    template: "%s | Bertina Store",
  },
  description:
    "Cuadernos, agendas y papelería de diseño artesanal. Piezas únicas para quienes aman escribir con estilo. Pedidos por WhatsApp.",
  keywords: [
    "cuadernos artesanales",
    "papelería de diseño",
    "cuadernos personalizados",
    "bullet journal",
    "agendas elegantes",
    "papelería para regalos",
    "cuadernos para escribir",
    "papelería minimalista",
    "cuadernos cuba",
    "tienda papelería online",
    "cuadernos handmade",
    "stickers papelería",
    "papelería corporativa",
    "cuadernos encuadernados",
  ],
  authors: [{ name: "Bertina Store" }],
  creator: "Bertina Store",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bertinastore.vercel.app",
    siteName: "Bertina Store",
    title: "Bertina Store — Papelería de diseño y cuadernos artesanales",
    description:
      "Cuadernos, agendas y papelería de diseño artesanal. Piezas únicas para quienes aman escribir con estilo.",
    images: [
      {
        url: "/hero.png",
        width: 600,
        height: 750,
        alt: "Bertina Store — Papelería de diseño",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bertina Store — Papelería de diseño",
    description: "Cuadernos y papelería artesanal para quienes aman escribir con estilo.",
    images: ["/hero.png"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bertinastore.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Bertina Store",
  description:
    "Cuadernos y papelería de diseño artesanal. Piezas únicas para quienes aman escribir con estilo.",
  url: "https://bertinastore.com",
  telephone: "+5358732088",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+5358732088",
    contactType: "customer service",
    availableLanguage: "Spanish",
  },
  sameAs: [
    "https://instagram.com/bertina.store",
    "https://www.facebook.com/share/1BM23f6SiV/?mibextid=wwXIfr",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catálogo Bertina Store",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Cuadernos artesanales" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Papelería de diseño" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Sets de regalo" } },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
