"use client";

import { motion } from "framer-motion";
import SplitText from "./ui/SplitText";
import Magnetic from "./ui/Magnetic";
import { waLink } from "@/lib/data";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const highlights = [
  { k: "Desde", v: "$2.000" },
  { k: "Categorías", v: "10" },
  { k: "Para", v: "Él y ella" },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative z-10 flex min-h-[100svh] flex-col justify-between px-4 pb-8 pt-28 md:px-10 md:pb-10 md:pt-36">
      <div className="rings pointer-events-none absolute -left-48 -top-20 h-[560px] w-[560px] opacity-70" aria-hidden="true" />

      <div className="relative max-w-[min(100%,760px)]">
        <motion.p {...fade(0)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ice">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cobalt" />
          Accesorios · Catamarca
        </motion.p>

        <h1 aria-label="Solofachas" className="font-display text-[clamp(54px,15.5vw,180px)] font-extrabold uppercase leading-[0.84] tracking-[-0.045em]">
          <SplitText text="Solo" delay={0.15} />
          <br />
          <SplitText text="Fachas" delay={0.35} className="text-cobalt" />
        </h1>

        <motion.p {...fade(0.9)} className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-muted md:text-xl">
          Accesorios con actitud para hombre y mujer. <span className="text-silver">Hay un estilo para cada uno.</span>
        </motion.p>

        <motion.div {...fade(1.05)} className="mt-8 flex flex-wrap gap-3">
          <Magnetic href="#probalo">Probalo en 3D</Magnetic>
          <Magnetic href={waLink("Hola! Quiero info de solofachas 🌀")} tone="ghost" external>
            Pedí por WhatsApp
          </Magnetic>
        </motion.div>
      </div>

      <motion.div {...fade(1.3)} className="relative flex items-end justify-between gap-6">
        <dl className="hidden gap-8 md:flex">
          {highlights.map((h) => (
            <div key={h.k} className="border-l border-line pl-4">
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">{h.k}</dt>
              <dd className="font-display text-2xl font-bold">{h.v}</dd>
            </div>
          ))}
        </dl>
        <a href="#brillo" className="ml-auto flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted md:ml-0">
          <span className="relative h-10 w-6 rounded-full border border-line">
            <motion.span
              className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-ice"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          Bajá
        </a>
      </motion.div>
    </section>
  );
}
