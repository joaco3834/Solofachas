"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

type Tone = "primary" | "wa" | "ghost" | "light";

const tones: Record<Tone, string> = {
  primary: "bg-cobalt text-white shadow-[0_10px_40px_-10px_rgba(47,107,255,.8)]",
  wa: "bg-wa text-[#04140a] shadow-[0_10px_40px_-12px_rgba(37,211,102,.7)]",
  ghost: "border border-line bg-ink/70 text-silver hover:border-ice",
  light: "bg-silver text-ink",
};

type Props = {
  href: string;
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  external?: boolean;
  arrow?: boolean;
};

// Botón que se "pega" al puntero y tiene una flecha que se desliza
export default function Magnetic({ href, children, tone = "primary", className = "", external, arrow = true }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.95 }}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-[15px] font-semibold transition-colors ${tones[tone]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span className="relative z-10 grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-black/15">
          <span className="flex w-12 -translate-x-[18px] items-center gap-3 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-[6px]">
            <ArrowIcon />
            <ArrowIcon />
          </span>
        </span>
      )}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </motion.a>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
