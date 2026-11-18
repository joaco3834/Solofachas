"use client";

import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Elegí tu facha", d: "Mirá los destacados o el catálogo completo, con fotos reales de cada modelo." },
  { n: "02", t: "Armá tu pedido", d: "Agregá todo lo que quieras y mandalo junto por WhatsApp, con modelos y total ya escritos. También por Instagram." },
  { n: "03", t: "Pagás y listo", d: "Te confirmamos el stock, pagás por transferencia y coordinamos la entrega en Catamarca." },
];

export default function HowTo() {
  return (
    <section id="como-comprar" className="relative z-10 overflow-hidden px-4 py-24 md:px-10 md:py-36">
      <div className="rings pointer-events-none absolute -right-40 top-1/2 h-[640px] w-[640px] -translate-y-1/2 opacity-50" aria-hidden="true" />
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ice">Cómo comprar</p>
      <h2 className="font-display text-[clamp(36px,6.4vw,96px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
        Fácil. <span className="text-outline">Tres pasos.</span>
      </h2>
      <ol className="relative mt-14 grid gap-4 md:grid-cols-3 md:gap-6">
        {steps.map((s, i) => (
          <motion.li
            key={s.n}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-3xl border border-line bg-panel/70 p-6 backdrop-blur md:p-8"
          >
            <span className="text-outline-cobalt block font-display text-7xl font-extrabold leading-none transition-colors duration-500 group-hover:text-cobalt md:text-8xl">
              {s.n}
            </span>
            <h3 className="mt-8 text-xl font-semibold">{s.t}</h3>
            <p className="mt-2 text-muted">{s.d}</p>
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-cobalt transition-transform duration-500 group-hover:scale-x-100" />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
