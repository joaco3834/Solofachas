"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import SplitText from "./ui/SplitText";
import Magnetic from "./ui/Magnetic";
import { BASE, COLLAGE, waLink, type CollageItem } from "@/lib/data";
import { useMedia } from "@/lib/hooks";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// Una foto del collage en el espacio 3D: más cerca o más lejos según su profundidad,
// inclinada hacia el título, y vuela hacia la cámara al bajar
function Photo({
  it,
  i,
  mobile,
  px,
  scrollY,
  reduced,
}: {
  it: CollageItem;
  i: number;
  mobile: boolean;
  px: MotionValue<number>;
  scrollY: MotionValue<number>;
  reduced: boolean;
}) {
  const spot = (mobile ? it.mob : it.desk)!;
  const d = it.d;
  const k = reduced ? 0 : 1;
  const depth = (d - 0.75) * (mobile ? 380 : 650); // px hacia adelante (+) o hacia el fondo (-)
  const baseRY = ((50 - spot.x) / 50) * 28; // mira hacia el centro
  const baseRX = ((spot.y - 50) / 50) * 18;
  const z = useTransform(scrollY, (s) => depth + s * (0.5 + d * 0.9) * k);
  const y = useTransform(scrollY, (s) => -s * d * 0.25 * k);
  const opacity = useTransform(scrollY, [0, 260 + d * 120, 520 + d * 200], [1, 1, k ? 0 : 1]);
  const sheen = useTransform(px, (v) => `${50 - v * 60}% 0`);
  const back = d < 0.6;

  return (
    <motion.a
      href={it.href}
      aria-label={`${it.name}, ${it.price}`}
      className="group absolute block [transform-style:preserve-3d]"
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        width: `${spot.w}vw`,
        marginLeft: `${-spot.w / 2}vw`,
        marginTop: `${(-spot.w * 1.25) / 2}vw`,
        z,
        y,
        rotateY: baseRY,
        rotateX: baseRX,
        rotateZ: spot.r,
        opacity,
      }}
    >
      <motion.span
        className="block [transform-style:preserve-3d]"
        initial={{ opacity: 0, z: -900, rotateY: baseRY > 0 ? -40 : 40 }}
        animate={{ opacity: 1, z: 0, rotateY: 0 }}
        whileHover={{ z: 140, rotateY: -baseRY, rotateX: -baseRX, rotateZ: -spot.r }}
        transition={{ duration: 1.3, delay: 0.3 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="float-y block" style={{ animationDuration: `${5 + (i % 4)}s`, animationDelay: `${-i * 0.7}s` }}>
          <span className="relative block aspect-[4/5] overflow-hidden rounded-[18px] border border-white/15 bg-panel shadow-[0_30px_70px_-20px_rgba(0,0,0,.9)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/collage/${it.img}.webp`} alt="" className="h-full w-full object-cover" draggable={false} />
            {/* brillo que recorre la foto al mover el mouse, como un vidrio */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,.22)_50%,transparent_62%)] bg-[length:260%_100%]"
              style={{ backgroundPosition: sheen }}
            />
            {/* las del fondo, más oscuras (niebla) */}
            {back && <span aria-hidden="true" className="absolute inset-0 bg-ink/35 transition-opacity duration-500 group-hover:opacity-0" />}
            <span className="absolute inset-x-2 bottom-2 translate-y-2 rounded-xl bg-ink/85 px-2.5 py-1.5 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="block text-[12px] font-semibold leading-tight text-silver">{it.name}</span>
              <span className="block font-display text-[12px] font-bold text-ice">{it.price}</span>
            </span>
          </span>
        </span>
      </motion.span>
    </motion.a>
  );
}

export default function Hero() {
  const mobile = useMedia("(max-width: 767px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const [ready, setReady] = useState(false);
  const { scrollY } = useScroll();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 50, damping: 18 });
  const py = useSpring(my, { stiffness: 50, damping: 18 });
  // giro suave automático (en el celu, sin mouse, es lo que da la sensación 3D)
  const drift = useMotionValue(0);
  useAnimationFrame((t) => {
    if (!reduced) drift.set(Math.sin(t / 2600));
  });
  const camY = useTransform([px, drift], ([a, b]: number[]) => (reduced ? 0 : a * 11 + b * (mobile ? 9 : 4)));
  const camX = useTransform([py, scrollY], ([a, s]: number[]) => (reduced ? 0 : -a * 8 + Math.min(s, 600) * 0.018));

  useEffect(() => {
    setReady(true);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  const items = COLLAGE.filter((it) => (mobile ? it.mob : it.desk));

  return (
    <section id="inicio" className="relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-28">
      <div className="rings pointer-events-none absolute left-1/2 top-1/2 h-[min(900px,120vw)] w-[min(900px,120vw)] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden="true" />

      {/* collage */}
      <div className="absolute inset-0 [perspective:1100px]" aria-label="Algunos productos">
        <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateY: camY, rotateX: camX }}>
          {ready && items.map((it, i) => <Photo key={it.img} it={it} i={i} mobile={mobile} px={px} scrollY={scrollY} reduced={reduced} />)}
        </motion.div>
      </div>

      {/* texto: con un halo oscuro para que se lea sobre las fotos */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center text-center">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[140%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(7,11,26,.92),rgba(7,11,26,.6)_55%,transparent)]" aria-hidden="true" />
        <motion.p {...fade(0)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ice">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cobalt" />
          Accesorios · Catamarca
        </motion.p>
        <h1 aria-label="Solofachas" className="font-display text-[clamp(56px,14vw,190px)] font-extrabold uppercase leading-[0.84] tracking-[-0.045em]">
          <SplitText text="Solo" delay={0.15} />
          <br />
          <SplitText text="Fachas" delay={0.35} className="text-cobalt" />
        </h1>
        <motion.p {...fade(0.9)} className="mt-5 max-w-[30ch] text-[17px] leading-relaxed text-muted md:text-xl">
          Accesorios con actitud para hombre y mujer. <span className="text-silver">Hay un estilo para cada uno.</span>
        </motion.p>
        <motion.div {...fade(1.05)} className="pointer-events-auto mt-7 flex flex-wrap justify-center gap-3">
          <Magnetic href="#destacados">Ver destacados</Magnetic>
          <Magnetic href={waLink("Hola! Quiero info de solofachas 🌀")} tone="ghost" external>
            Pedí por WhatsApp
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
