"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Niebla de luz: nubecitas suaves que suben detrás del reloj
export default function Haze({ reduced }: { reduced: boolean }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, "rgba(255,255,255,1)");
    rg.addColorStop(0.35, "rgba(255,255,255,0.4)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);

  const puffs = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        x: (Math.random() - 0.5) * 2.6,
        z: -0.5 - Math.random() * 1.3,
        phase: Math.random(),
        speed: 0.035 + Math.random() * 0.04,
        size: 1.6 + Math.random() * 1.8,
        color: i % 3 === 0 ? "#2f6bff" : "#9cc0ff",
        op: 0.07 + Math.random() * 0.07,
      })),
    [],
  );

  const refs = useRef<THREE.Sprite[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    puffs.forEach((p, i) => {
      const sp = refs.current[i];
      if (!sp) return;
      const life = (p.phase + (reduced ? 0 : t * p.speed)) % 1;
      sp.position.set(p.x + Math.sin(t * 0.3 + i) * 0.15, -1.3 + life * 2.8, p.z);
      (sp.material as THREE.SpriteMaterial).opacity = p.op * Math.sin(life * Math.PI);
      sp.scale.setScalar(p.size * (0.7 + life * 0.6));
    });
  });

  return (
    <>
      {puffs.map((p, i) => (
        <sprite
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
        >
          <spriteMaterial map={tex} color={p.color} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
        </sprite>
      ))}
    </>
  );
}
