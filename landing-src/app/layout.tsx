import type { Metadata, Viewport } from "next";
import "@fontsource/unbounded/500.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "./globals.css";

export const metadata: Metadata = {
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
