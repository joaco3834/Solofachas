"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { sceneState } from "@/lib/sceneState";
import { keysFor, sample } from "@/lib/watchPath";
import { BASE, VARIANTS, type VariantId } from "@/lib/data";

// Las imágenes salen del mismo modelo 3D: cámara a 6 unidades, fov 32°, reloj a escala 1.22,
// en una vista de 1000 px recortada a 848 px.
const POSTER_UNIT = 1000 / (2 * Math.tan((16 * Math.PI) / 180) * 6);
const POSTER_PX = 848;
const POSTER_SCALE = 1.22;
const POSTER_ROT = { x: 0.28, y: -0.5 };

// Perspectiva exacta de la esfera en las imágenes (calculada con la misma cámara 3D):
// lleva un cuadrado de 200 px (centro = eje de las agujas) al plano de la esfera.
const DIAL = "matrix3d(2.660583,-0.144346,0,-0.0009564683,0.3954549,3.59684,0,0.0004982695,0,0,1,0,66.24657,75.87595,0,1)";

// medidas de las agujas en el modelo 3D (100 px = 1 unidad)
const HANDS = {
  hour: { w: 7, up: 46, back: 2 },
  minute: { w: 5, up: 69, back: 3 },
  second: { w: 1.8, up: 71, back: 15 },
};

function Hand({ hand, color, refEl }: { hand: { w: number; up: number; back: number }; color: string; refEl: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={refEl} className="absolute left-[100px] top-[100px] h-0 w-0">
      <div
        style={{
          position: "absolute",
          left: -hand.w / 2,
          top: -hand.up,
          width: hand.w,
          height: hand.up + hand.back,
          borderRadius: hand.w / 2,
          background: color,
          boxShadow: "1px 1.5px 1.5px rgba(0,0,0,.45), inset 1px 0 0 rgba(255,255,255,.55)",
        }}
      />
    </div>
  );
}

type Props = { variant: VariantId; isMobile: boolean; reduced: boolean };

// Modo liviano: el reloj como imagen fotorrealista que sigue el mismo recorrido que el 3D
export default function WatchPoster({ variant, isMobile, reduced }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const hourEl = useRef<HTMLDivElement>(null);
  const minEl = useRef<HTMLDivElement>(null);
  const secEl = useRef<HTMLDivElement>(null);
  const v = VARIANTS.find((x) => x.id === variant) ?? VARIANTS[0];

  useEffect(() => {
    const cur = { x: 0, y: 0, s: 0, rx: 0, ry: 0, rz: 0, init: false };
    const { damp } = { damp: (a: number, b: number, l: number, d: number) => a + (b - a) * (1 - Math.exp(-l * d)) };
    const tick = (time: number, deltaMs: number) => {
      const node = el.current;
      if (!node) return;
      const d = Math.min(deltaMs / 1000, 0.1);
      const H = window.innerHeight;
      const unit = H / (2 * Math.tan((16 * Math.PI) / 180) * 6);
      const k = sample(keysFor(isMobile), sceneState.progress);
      const persp = 6 / (6 - k.p[2]);
      const float = reduced ? 0 : Math.sin(time * 0.8) * 0.05;
      const tx = k.p[0] * unit * persp;
      const ty = -(k.p[1] + float) * unit * persp;
      const sc = (k.s / POSTER_SCALE) * persp * (unit / POSTER_UNIT);
      const clamp = (v: number) => Math.max(-0.42, Math.min(0.42, v));
      const rx = clamp((k.r[0] - POSTER_ROT.x) * 0.4 - sceneState.pointerY * 0.15);
      const ry = clamp((k.r[1] - POSTER_ROT.y) * 0.3 + sceneState.pointerX * 0.2 + (reduced ? 0 : Math.sin(time * 0.45) * 0.08));
      if (!cur.init) {
        Object.assign(cur, { x: tx, y: ty + 40, s: sc * 0.9, rx, ry, rz: k.r[2], init: true });
      }
      cur.x = damp(cur.x, tx, 4.5, d);
      cur.y = damp(cur.y, ty, 4.5, d);
      cur.s = damp(cur.s, sc, 4.5, d);
      cur.rx = damp(cur.rx, rx, 4, d);
      cur.ry = damp(cur.ry, ry, 4, d);
      cur.rz = damp(cur.rz, k.r[2] * 0.5, 4, d);
      node.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) rotateX(${cur.rx}rad) rotateY(${cur.ry}rad) rotateZ(${cur.rz}rad) scale(${cur.s})`;

      // agujas con la hora real
      const now = new Date();
      const sec = now.getSeconds() + now.getMilliseconds() / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = (now.getHours() % 12) + min / 60;
      if (secEl.current) secEl.current.style.transform = `rotate(${sec * 6}deg)`;
      if (minEl.current) minEl.current.style.transform = `rotate(${min * 6}deg)`;
      if (hourEl.current) hourEl.current.style.transform = `rotate(${hr * 30}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [isMobile, reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden [perspective:1400px]">
      {/* brillitos en CSS */}
      {!reduced &&
        Array.from({ length: isMobile ? 10 : 22 }, (_, i) => (
          <span
            key={i}
            className="twinkle absolute h-1 w-1 rounded-full bg-ice"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53 + 11) % 100}%`,
              animationDelay: `${(i * 0.37) % 3}s`,
              animationDuration: `${2.6 + (i % 5) * 0.5}s`,
            }}
          />
        ))}
      <div
        ref={el}
        className="absolute left-1/2 top-1/2 will-change-transform"
        style={{ width: POSTER_PX, height: POSTER_PX, marginLeft: -POSTER_PX / 2, marginTop: -POSTER_PX / 2, transform: "scale(0)" }}
      >
        <div className="absolute inset-[12%] rounded-full bg-cobalt/30 blur-[80px]" />
        <motion.div key={variant} className="absolute inset-0" initial={{ scale: 0.9, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 160, damping: 14 }}>
          {VARIANTS.map((v) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={v.id}
              src={`${BASE}/reloj/${v.id}.webp`}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full transition-opacity duration-500"
              style={{ opacity: v.id === variant ? 1 : 0 }}
            />
          ))}
          <div className="absolute left-0 top-0 h-[200px] w-[200px] origin-top-left" style={{ transform: DIAL }}>
            <Hand hand={HANDS.hour} color={v.handColor} refEl={hourEl} />
            <Hand hand={HANDS.minute} color={v.handColor} refEl={minEl} />
            <Hand hand={HANDS.second} color="#2f6bff" refEl={secEl} />
            <div className="absolute left-[95.5px] top-[95.5px] h-[9px] w-[9px] rounded-full shadow-[1px_1.5px_1.5px_rgba(0,0,0,.45)]" style={{ background: v.handColor }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
