"use client";

import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { sceneState } from "@/lib/sceneState";
import { BASE, type VariantId } from "@/lib/data";
import Watch from "./Watch";

// Luces que se mueven con el puntero y un contraluz azul que respira
function DynamicLights({ reduced }: { reduced: boolean }) {
  const spot = useRef<THREE.SpotLight>(null!);
  const rim = useRef<THREE.PointLight>(null!);
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    const { damp } = THREE.MathUtils;
    spot.current.position.x = damp(spot.current.position.x, sceneState.pointerX * 5, 2, d);
    spot.current.position.y = damp(spot.current.position.y, 3 + sceneState.pointerY * 3, 2, d);
    rim.current.intensity = 34 + (reduced ? 0 : Math.sin(t * 1.1) * 14);
    rim.current.position.x = reduced ? -3 : Math.sin(t * 0.35) * 3.5;
  });
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight ref={spot} position={[0, 3, 5]} angle={0.6} penumbra={1} intensity={90} decay={2} color="#ffffff" />
      <pointLight ref={rim} position={[-3, 1.2, -2.2]} color="#2f6bff" intensity={34} decay={2} />
      <pointLight position={[3, -2, 2.5]} color="#9cc0ff" intensity={8} decay={2} />
    </>
  );
}

type Props = { variantId: VariantId; isMobile: boolean; reduced: boolean; active: boolean };

export default function Scene({ variantId, isMobile, reduced, active }: Props) {
  // baja la resolución sola si el dispositivo no llega a mantener la animación fluida
  const [low, setLow] = useState(false);
  return (
    <Canvas
      dpr={low ? (isMobile ? 0.85 : 1) : [1, isMobile ? 1.25 : 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 32 }}
      fallback={
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${BASE}/productos/reloj-verde.jpg`} alt="Reloj plateado esfera verde" className="mx-auto mt-[45svh] w-56 rounded-3xl opacity-90" />
      }
    >
      <PerformanceMonitor flipflops={1} onDecline={() => setLow(true)} />
      <DynamicLights reduced={reduced} />
      {/* estudio fotográfico armado con paneles de luz: reflejos realistas sin descargar HDRs */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3.2} position={[0, 4.5, -1]} scale={[10, 2.4, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} position={[-5, 1, 1]} scale={[2.5, 9, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.8} position={[5, 0.5, 2]} scale={[2.5, 9, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1.6} color="#2f6bff" position={[0, 0, 7]} scale={5} />
        <Lightformer form="rect" intensity={0.9} color="#9cc0ff" position={[0, -4, 2]} scale={[10, 1.5, 1]} rotation-x={-Math.PI / 2} />
        <Lightformer form="circle" intensity={4} position={[-2.5, 3, 4]} scale={1.2} />
        <Lightformer form="rect" intensity={1.6} position={[0, 2, -6]} scale={[12, 4, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Watch variantId={variantId} isMobile={isMobile} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
