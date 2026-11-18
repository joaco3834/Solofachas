"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState } from "@/lib/sceneState";
import type { VariantId } from "@/lib/data";
import Hero from "./Hero";
import Story from "./Story";
import WatchPoster from "./WatchPoster";
import { isWeakGraphics } from "@/lib/gpu";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

type Props = { isMobile: boolean; reduced: boolean };

// Portada + capítulos con el reloj 3D fijo detrás, que se mueve según el scroll
export default function Experience({ isMobile, reduced }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<VariantId>("verde");
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  // "3d" = reloj en vivo · "lite" = imágenes del reloj (compus o celus sin buena placa de video)
  const [mode, setMode] = useState<"3d" | "lite" | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("modo");
    let m: "3d" | "lite" = "3d";
    try {
      if (sessionStorage.getItem("sf-modo") === "lite") m = "lite";
    } catch {}
    if (m === "3d" && isWeakGraphics()) m = "lite";
    if (q === "3d") m = "3d";
    if (q === "liviano") m = "lite";
    setMode(m);
  }, []);

  const goLite = useCallback(() => {
    if (new URLSearchParams(window.location.search).get("modo") === "3d") return;
    setMode("lite");
    try {
      sessionStorage.setItem("sf-modo", "lite");
    } catch {}
  }, []);

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
          {mode === "3d" && <Scene variantId={variant} isMobile={isMobile} reduced={reduced} active={active} onSlow={goLite} />}
          {mode === "lite" && <WatchPoster variant={variant} isMobile={isMobile} reduced={reduced} />}
        </div>
      </div>
      <Hero />
      <Story variant={variant} setVariant={setVariant} />
    </div>
  );
}
