"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnetic from "./ui/Magnetic";
import { CATALOGO, VARIANTS, waPedido, type VariantId } from "@/lib/data";

type Props = { variant: VariantId; setVariant: (v: VariantId) => void };

function Chapter({
  id,
  n,
  kicker,
  title,
  side,
  children,
}: {
  id: string;
  n: string;
  kicker: string;
  title: React.ReactNode;
  side: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="chapter relative z-10 flex min-h-[100svh] items-start px-4 pt-28 md:items-center md:px-10 md:pt-0">
      <span
        aria-hidden="true"
        className={`text-outline pointer-events-none absolute top-1/2 hidden -translate-y-1/2 font-display text-[28vw] font-extrabold leading-none opacity-[0.07] md:block ${
          side === "right" ? "left-[4vw]" : "right-[4vw]"
        }`}
      >
        {n}
      </span>
      <div className={`relative w-full md:w-[44%] ${side === "right" ? "md:ml-auto" : ""}`}>
        <p className="rv mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ice">
          <span className="font-display text-cobalt">{n}</span>
          <span className="h-px w-10 bg-line" />
          {kicker}
        </p>
        <h2 className="rv font-display text-[clamp(36px,6.4vw,92px)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function Story({ variant, setVariant }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const v = VARIANTS.find((x) => x.id === variant)!;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".chapter").forEach((ch) => {
        gsap.from(ch.querySelectorAll(".rv"), {
          y: 70,
          opacity: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ch, start: "top 62%", toggleActions: "play none none reverse" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <Chapter
        id="brillo"
        n="01"
        kicker="El brillo"
        side="right"
        title={
          <>
            Se nota
            <br />
            <span className="text-outline">de lejos.</span>
          </>
        }
      >
        <p className="rv mt-6 max-w-[38ch] text-lg leading-relaxed text-muted">
          Esferas con brillo, cajas que reflejan la luz y detalles que hacen que te pregunten <span className="text-silver">de dónde es</span>.
        </p>
      </Chapter>

      <Chapter
        id="malla"
        n="02"
        kicker="La malla"
        side="left"
        title={
          <>
            Uno para
            <br />
            cada <span className="text-cobalt">muñeca.</span>
          </>
        }
      >
        <p className="rv mt-6 max-w-[38ch] text-lg leading-relaxed text-muted">
          Mallas metálicas, de tela o de silicona. Cajas con strass o en total black. Elegís el tuyo y lo combinás con lo que quieras.
        </p>
        <ul className="rv mt-6 flex flex-wrap gap-2 text-sm">
          {["Metálica", "Tela estilo militar", "Silicona trenzada", "Con strass"].map((t) => (
            <li key={t} className="rounded-full border border-line bg-panel/60 px-3 py-1.5 backdrop-blur">
              {t}
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter
        id="probalo"
        n="03"
        kicker="Probalo"
        side="right"
        title={
          <>
            Elegí tu
            <br />
            <span className="text-outline">esfera.</span>
          </>
        }
      >
        <div className="rv mt-7 rounded-3xl border border-line bg-panel/70 p-5 backdrop-blur-xl md:p-6">
          <div role="radiogroup" aria-label="Color del reloj" className="flex gap-3">
            {VARIANTS.map((x) => {
              const on = x.id === variant;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setVariant(x.id)}
                  className="group relative flex flex-1 flex-col items-center gap-2 rounded-2xl px-2 py-3 text-sm font-semibold"
                >
                  {on && (
                    <motion.span
                      layoutId="swatch-bg"
                      className="absolute inset-0 rounded-2xl border border-ice/50 bg-ink/60"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className="relative h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-panel transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.55), transparent 45%), ${x.swatch}`,
                      ["--tw-ring-color" as string]: on ? "#9cc0ff" : "transparent",
                    }}
                  />
                  <span className={`relative ${on ? "text-silver" : "text-muted"}`}>{x.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 min-h-[92px] border-t border-line pt-5" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold">{v.product}</h3>
                  <span className="font-display text-xl font-bold text-ice">{v.price}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{v.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Magnetic href={waPedido(v.product, v.price)} tone="wa" external>
              Lo quiero
            </Magnetic>
            <a href={`${CATALOGO}#relojes`} className="text-sm font-semibold text-ice underline-offset-4 hover:underline">
              Ver todos los relojes
            </a>
          </div>
        </div>
        <p className="rv mt-3 text-xs text-muted/80">Modelo 3D ilustrativo. Las fotos reales de cada reloj están en el catálogo.</p>
      </Chapter>
    </div>
  );
}
