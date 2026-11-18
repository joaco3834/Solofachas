"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BASE, CATALOGO, WATCHES } from "@/lib/data";
import { addToCart } from "@/lib/cart";

// "Elegí tu reloj" con las fotos reales de los tres relojes
export default function WatchPick() {
  const [id, setId] = useState(WATCHES[0].id);
  const [model, setModel] = useState<string | null>(null);
  const [need, setNeed] = useState(false);
  const w = WATCHES.find((x) => x.id === id)!;

  const pick = (nid: string) => {
    setId(nid);
    setModel(null);
    setNeed(false);
  };
  const add = () => {
    if (w.models && !model) {
      setNeed(true);
      return;
    }
    addToCart({ t: w.product, p: w.price, img: w.catImg }, model);
  };

  return (
    <section id="relojes" className="relative z-10 px-4 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
          <div className="rings pointer-events-none absolute -inset-16 opacity-60" aria-hidden="true" />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={w.id}
              initial={{ opacity: 0, rotate: -6, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, rotate: -2, scale: 1, y: 0 }}
              exit={{ opacity: 0, rotate: 6, scale: 0.94, y: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/productos/${w.img}`} alt={w.product} className="h-full w-full object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ice">
            <span className="font-display text-cobalt">01</span>
            <span className="h-px w-10 bg-line" />
            Relojes
          </p>
          <h2 className="font-display text-[clamp(40px,6.4vw,92px)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]">
            Elegí tu
            <br />
            <span className="text-outline">reloj.</span>
          </h2>

          <div className="mt-8 rounded-3xl border border-line bg-panel/[0.93] p-5 md:p-6">
            <div role="radiogroup" aria-label="Reloj" className="flex gap-3">
              {WATCHES.map((x) => {
                const on = x.id === id;
                return (
                  <button
                    key={x.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => pick(x.id)}
                    className="group relative flex flex-1 flex-col items-center gap-2 rounded-2xl px-2 py-3 text-sm font-semibold"
                  >
                    {on && <motion.span layoutId="watch-bg" className="absolute inset-0 rounded-2xl border border-ice/50 bg-ink/60" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
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
                <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-semibold">{w.product}</h3>
                    <span className="font-display text-xl font-bold text-ice">{w.price}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{w.detail}</p>
                  {w.models && (
                    <div className="mt-4">
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.12em] ${need ? "text-[#ff8a8a]" : "text-ice"}`}>Elegí el modelo</p>
                      <div role="radiogroup" aria-label="Modelo" className="flex flex-wrap gap-2">
                        {w.models.map((m) => (
                          <button
                            key={m}
                            type="button"
                            role="radio"
                            aria-checked={model === m}
                            onClick={() => {
                              setModel(m);
                              setNeed(false);
                            }}
                            className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                              model === m ? "border-silver bg-silver text-ink" : "border-line text-silver hover:border-ice"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <motion.button
                type="button"
                onClick={add}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-wa px-6 py-3.5 text-[15px] font-bold text-[#04140a] shadow-[0_10px_40px_-12px_rgba(37,211,102,.7)] transition-transform hover:scale-[1.03]"
              >
                Agregar al pedido
              </motion.button>
              <a href={`${CATALOGO}#relojes`} className="text-sm font-semibold text-ice underline-offset-4 hover:underline">
                Ver todos los relojes
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
