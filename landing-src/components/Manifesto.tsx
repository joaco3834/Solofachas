"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TEXT = "Hay un estilo para cada uno. Relojes, anillos, billeteras y lentes elegidos para que armes tu facha, sin gastar de más.";
const ACCENT = new Set(["estilo", "cada", "uno.", "facha,"]);

// Las palabras se van encendiendo a medida que bajás
export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mw",
        { opacity: 0.12 },
        { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 50%", scrub: true } },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-10 px-4 py-28 md:px-10 md:py-44">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <p className="relative mx-auto max-w-6xl font-display text-[clamp(28px,5.2vw,76px)] font-bold leading-[1.05] tracking-[-0.03em]">
        {TEXT.split(" ").map((w, i) => (
          <span key={i} className={`mw inline-block pr-[0.25em] ${ACCENT.has(w) ? "text-cobalt" : ""}`}>
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}
