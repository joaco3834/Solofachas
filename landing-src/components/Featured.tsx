"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BASE, CATALOGO, PRODUCTS, type Product } from "@/lib/data";
import { addToCart } from "@/lib/cart";
import { ArrowIcon } from "./ui/Magnetic";

function Card({ p, i }: { p: Product; i: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,.22), transparent 45%)`);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
      className={i % 2 ? "md:translate-y-16" : ""}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-[22px] border border-line bg-panel"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/productos/${p.img}`}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glare }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ice backdrop-blur">
            {p.cat}
          </span>
        </div>
        <div className="relative -mt-10 p-4 md:p-5" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-[15px] font-semibold leading-tight md:text-base">{p.name}</h3>
          <p className="mt-1 line-clamp-2 text-[13px] text-muted">{p.desc}</p>
          <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-display text-[15px] font-bold text-ice md:text-lg">{p.price}</span>
            {p.catId ? (
              <a
                href={`${CATALOGO}#${p.catId}`}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-[13px] font-bold text-silver transition-all duration-300 hover:gap-2.5 hover:border-ice"
              >
                Elegir modelo <ArrowIcon />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => addToCart({ t: p.name, p: p.price, img: p.catImg })}
                aria-label={`Agregar al pedido: ${p.name}`}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-silver px-3 py-1.5 text-[13px] font-bold text-ink transition-all duration-300 hover:gap-2.5 hover:bg-white active:scale-95"
              >
                Agregar <span aria-hidden="true">+</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function Featured() {
  return (
    <section id="destacados" className="relative z-10 px-4 pb-32 pt-10 md:px-10 md:pb-48">
      <div className="mb-12 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(44px,9vw,140px)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]"
        >
          Lo más
          <br />
          <span className="text-cobalt">facha.</span>
        </motion.h2>
        <div className="max-w-sm">
          <p className="text-lg text-muted">Una selección del catálogo. Agregá lo que te guste y mandá todo el pedido junto por WhatsApp.</p>
          <a href={CATALOGO} className="mt-4 inline-flex items-center gap-2 font-semibold text-ice hover:underline">
            Ver catálogo completo <ArrowIcon />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
        {PRODUCTS.map((p, i) => (
          <Card key={p.img} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
