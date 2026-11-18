"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES } from "@/lib/data";

function Row({ outline, cls }: { outline?: boolean; cls: string }) {
  const items = [...CATEGORIES, ...CATEGORIES];
  return (
    <div className="flex w-max" aria-hidden="true">
      <div className={`${cls} flex w-max shrink-0`}>
        {items.map((c, i) => (
          <span key={i} className="flex items-center">
            <span className={`px-5 font-display text-[clamp(44px,8vw,120px)] font-extrabold uppercase leading-none tracking-[-0.03em] md:px-8 ${outline ? "text-outline" : ""}`}>
              {c}
            </span>
            <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 text-cobalt md:h-12 md:w-12">
              <path d="M20 2c2 10 8 16 18 18-10 2-16 8-18 18-2-10-8-16-18-18C12 18 18 12 20 2Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

// Cinta de categorías que acelera cuando scrolleás rápido
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const a = gsap.to(".mq-a", { xPercent: -50, repeat: -1, ease: "none", duration: reduce ? 120 : 34 });
      const b = gsap.fromTo(".mq-b", { xPercent: -50 }, { xPercent: 0, repeat: -1, ease: "none", duration: reduce ? 120 : 40 });
      const speed = { s: 1 };
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (st) => {
          if (reduce) return;
          speed.s = 1 + Math.min(Math.abs(st.getVelocity()) / 350, 5);
          gsap.to(speed, {
            s: 1,
            duration: 0.9,
            ease: "power2.out",
            overwrite: true,
            onUpdate: () => {
              a.timeScale(speed.s);
              b.timeScale(speed.s);
            },
          });
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} aria-label="Categorías" className="relative z-10 -rotate-2 overflow-hidden border-y border-line bg-ink py-6 md:py-8">
      <p className="sr-only">{CATEGORIES.join(", ")}</p>
      <Row cls="mq-a" />
      <div className="mt-2 md:mt-4">
        <Row cls="mq-b" outline />
      </div>
    </section>
  );
}
