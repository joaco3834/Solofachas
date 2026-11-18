"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Magnetic from "./ui/Magnetic";
import { CATALOGO, IG, waLink } from "@/lib/data";

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [64, 0]);

  return (
    <section ref={ref} className="relative z-10 px-2 md:px-4">
      <motion.div style={{ scale, borderRadius: radius }} className="relative overflow-hidden bg-cobalt px-5 py-24 text-white md:px-12 md:py-40">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full opacity-40 [background:repeating-radial-gradient(circle,transparent_0_22px,rgba(255,255,255,.25)_22px_24px)]" aria-hidden="true" />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Tu próximo accesorio</p>
        <h2 className="relative mt-4 font-display text-[clamp(48px,11vw,180px)] font-extrabold uppercase leading-[0.84] tracking-[-0.05em]">
          ¿Cuál es
          <br />
          tu facha?
        </h2>
        <div className="relative mt-10 flex flex-wrap gap-3">
          <Magnetic href={waLink("Hola! Quiero info de solofachas 🌀")} tone="wa" external>
            Pedí por WhatsApp
          </Magnetic>
          <Magnetic href={IG} tone="light" external>
            Pedí por Instagram
          </Magnetic>
          <Magnetic href={CATALOGO} tone="ghost" className="!border-white/40 !bg-white/10 !text-white">
            Ver catálogo
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
