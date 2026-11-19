import type { Metadata, Viewport } from "next";
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "./globals.css";

const SITE = "https://joaco3834.github.io/Solofachas";

export const metadata: Metadata = {
  metadataBase: new URL(SITE + "/landing/"),
  icons: {
    icon: [
      { url: "/Solofachas/marca/favicon.svg", type: "image/svg+xml" },
      { url: "/Solofachas/marca/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/Solofachas/marca/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Solofachas",
    locale: "es_AR",
    url: SITE + "/landing/",
    title: "Solofachas — Hay un estilo para cada uno",
    description: "Relojes, anillos, billeteras, lentes y más. Accesorios para hombre y mujer en Catamarca.",
    images: [{ url: SITE + "/marca/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: [SITE + "/marca/og.png"] },
  title: "Solofachas — Accesorios con actitud",
  description:
    "Relojes, anillos, billeteras, lentes y más. Accesorios para hombre y mujer desde Catamarca. Pedí por WhatsApp o Instagram.",
};

export const viewport: Viewport = {
  themeColor: "#070b1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
