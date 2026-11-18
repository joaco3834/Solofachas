"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { CATALOGO, waLink } from "@/lib/data";

const links = [
  { href: "#relojes", label: "Relojes" },
  { href: "#destacados", label: "Destacados" },
  { href: "#como-comprar", label: "Cómo comprar" },
  { href: CATALOGO, label: "Catálogo" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 240);
    setSolid(v > 40);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]"
    >
      <div
        className={`mx-3 mt-3 flex items-center justify-between rounded-full border px-4 py-2.5 transition-[background,border-color,backdrop-filter] duration-500 md:mx-6 md:px-6 ${
          solid ? "border-line/80 bg-ink/90" : "border-transparent bg-transparent"
        }`}
      >
        <a href="#inicio" className="font-display text-[17px] font-extrabold tracking-tight md:text-lg" aria-label="Solofachas, volver al inicio">
          SOLO<span className="text-cobalt">FACHAS</span>
        </a>
        <nav aria-label="Secciones" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-silver">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">{l.label}</span>
              <span className="absolute inset-x-4 top-full block transition-transform duration-300 group-hover:-translate-y-full text-silver">{l.label}</span>
            </a>
          ))}
        </nav>
        <a
          href={waLink("Hola! Quiero info de solofachas 🌀")}
          target="_blank"
          rel="noopener"
          className="rounded-full bg-wa px-4 py-2 text-sm font-bold text-[#04140a] transition-transform hover:scale-105 active:scale-95"
        >
          Pedí ahora
        </a>
      </div>
    </motion.header>
  );
}
