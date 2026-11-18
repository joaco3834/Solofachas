"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState } from "@/lib/sceneState";
import type { VariantId } from "@/lib/data";
import Hero from "./Hero";
import Story from "./Story";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

type Props = { isMobile: boolean; reduced: boolean };

// Portada + capítulos con el reloj 3D fijo detrás, que se mueve según el scroll
export default function Experience({ isMobile, reduced }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<VariantId>("verde");
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = wrap.current!;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => {
        sceneState.progress = s.progress;
      },
    });
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const t = setTimeout(() => setReady(true), 50);
    return () => {
      st.kill();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={wrap} className="relative">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className={`sticky top-0 h-[100svh] w-full transition-opacity duration-[1600ms] ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <Scene variantId={variant} isMobile={isMobile} reduced={reduced} active={active} />
        </div>
      </div>
      <Hero />
      <Story variant={variant} setVariant={setVariant} />
    </div>
  );
}
