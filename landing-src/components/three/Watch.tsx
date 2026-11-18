"use client";

import * as THREE from "three";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { sceneState } from "@/lib/sceneState";
import { VARIANTS, type Variant, type VariantId } from "@/lib/data";
import Haze from "./Haze";

/* ---------- Recorrido del reloj según el scroll ---------- */
type Key = { p: [number, number, number]; r: [number, number, number]; s: number };

// 0 = portada · 1 = "Se nota de lejos" · 2 = "La malla" · 3 = "Probalo"
const DESKTOP: Key[] = [
  { p: [1.8, -0.05, 0], r: [0.35, -0.6, 0.12], s: 0.94 },
  { p: [-1.35, 0, 0.55], r: [0.04, 0.28, 0], s: 1.12 },
  { p: [1.45, 0, 0.2], r: [0.9, -1.25, 0.25], s: 1 },
  { p: [-1.4, -0.05, 0], r: [0.18, 0.4, -0.05], s: 1 },
];
const MOBILE: Key[] = [
  { p: [0, -1.08, 0], r: [0.35, -0.5, 0.1], s: 0.58 },
  { p: [0, -1.0, 0.25], r: [0.04, 0.25, 0], s: 0.68 },
  { p: [0, -1.02, 0], r: [0.9, -1.2, 0.25], s: 0.62 },
  { p: [0, -1.3, 0], r: [0.2, 0.35, 0], s: 0.5 },
];

function sample(keys: Key[], progress: number): Key {
  const n = keys.length - 1;
  const x = Math.min(Math.max(progress, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  let t = x - i;
  t = t * t * (3 - 2 * t);
  const a = keys[i];
  const b = keys[i + 1];
  const l = (u: number, v: number) => u + (v - u) * t;
  return {
    p: [l(a.p[0], b.p[0]), l(a.p[1], b.p[1]), l(a.p[2], b.p[2])],
    r: [l(a.r[0], b.r[0]), l(a.r[1], b.r[1]), l(a.r[2], b.r[2])],
    s: l(a.s, b.s),
  };
}

/* ---------- Esfera dibujada en canvas (efecto solar, índices y logo) ---------- */
function makeDial(v: Variant) {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const C = S / 2;

  g.fillStyle = v.dial;
  g.fillRect(0, 0, S, S);

  // acabado "sunburst"
  for (let i = 0; i < 480; i++) {
    const a = (i / 480) * Math.PI * 2;
    g.strokeStyle = i % 2 ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.07)";
    g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(C, C);
    g.lineTo(C + Math.cos(a) * S, C + Math.sin(a) * S);
    g.stroke();
  }
  const vg = g.createRadialGradient(C, C, S * 0.05, C, C, S * 0.5);
  vg.addColorStop(0, "rgba(255,255,255,0.14)");
  vg.addColorStop(0.65, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.5)");
  g.fillStyle = vg;
  g.fillRect(0, 0, S, S);

  g.save();
  g.translate(C, C);
  // pista de minutos
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue;
    g.save();
    g.rotate((i / 60) * Math.PI * 2);
    g.fillStyle = v.marker;
    g.globalAlpha = 0.6;
    g.fillRect(-2, -S * 0.475, 4, S * 0.022);
    g.restore();
  }
  g.globalAlpha = 1;
  // índices de hora con brillo
  for (let i = 0; i < 12; i++) {
    g.save();
    g.rotate((i / 12) * Math.PI * 2);
    const big = i % 3 === 0;
    const w = big ? 26 : 14;
    const h = big ? 92 : 64;
    const y = -S * 0.452;
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.beginPath();
    g.roundRect(-w / 2 + 3, y + 4, w, h, 5);
    g.fill();
    g.fillStyle = v.marker;
    g.beginPath();
    g.roundRect(-w / 2, y, w, h, 5);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.65)";
    g.fillRect(-w / 2 + 3, y + 5, Math.max(3, w * 0.28), h - 10);
    g.restore();
  }
  g.restore();

  g.fillStyle = v.marker;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 50px Unbounded, 'Arial Black', sans-serif";
  g.fillText("SOLOFACHAS", C, C - S * 0.17);
  g.globalAlpha = 0.75;
  g.font = "600 24px Figtree, sans-serif";
  g.fillText("C A T A M A R C A", C, C + S * 0.22);
  g.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([
      document.fonts.load("800 50px Unbounded"),
      document.fonts.load("600 24px Figtree"),
    ])
      .catch(() => null)
      .then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

/* ---------- Malla de eslabones alrededor de la muñeca ---------- */
const LINKS = 30;
const RY = 1.05; // radio vertical de la muñeca
const RZ = 1.0; // radio en profundidad
const CZ = 0.405; // centro de la muñeca (detrás del reloj)
const A0 = Math.asin(1 / RY);

function linkPose(i: number) {
  const a = A0 + ((Math.PI * 2 - A0 * 2) * (i + 0.5)) / LINKS;
  const y = RY * Math.sin(a);
  const z = -CZ + RZ * Math.cos(a);
  const phi = Math.atan2(-RZ * Math.sin(a), RY * Math.cos(a));
  return { y, z, phi };
}

const STONES = 44;

type Props = { variantId: VariantId; isMobile: boolean; reduced: boolean };

export default function Watch({ variantId, isMobile, reduced }: Props) {
  const v = VARIANTS.find((x) => x.id === variantId) ?? VARIANTS[0];
  const scene = useThree((s) => s.scene);

  const pos = useRef<THREE.Group>(null!);
  const rot = useRef<THREE.Group>(null!);
  const hourH = useRef<THREE.Group>(null!);
  const minH = useRef<THREE.Group>(null!);
  const secH = useRef<THREE.Group>(null!);
  const strass = useRef<THREE.Group>(null!);
  const centerLinks = useRef<THREE.InstancedMesh>(null!);
  const sideLinks = useRef<THREE.InstancedMesh>(null!);
  const stones = useRef<THREE.InstancedMesh>(null!);

  // al cambiar de color, el reloj da una vuelta completa
  const spin = useRef({ target: 0, cur: 0 });
  const base = useRef({ x: 0, y: 0, z: 0 });
  const first = useRef(true);
  const snapped = useRef(false);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    spin.current.target += Math.PI * 2;
  }, [variantId]);

  const fontsReady = useFontsReady();
  const dialTex = useMemo(() => makeDial(v), [v, fontsReady]);
  useEffect(() => () => dialTex.dispose(), [dialTex]);

  const geo = useMemo(
    () => ({
      center: new RoundedBoxGeometry(0.36, 0.125, 0.09, 2, 0.03),
      side: new RoundedBoxGeometry(0.24, 0.125, 0.08, 2, 0.03),
      stone: new THREE.IcosahedronGeometry(0.036, 0),
      lug: new RoundedBoxGeometry(0.15, 0.32, 0.2, 2, 0.05),
    }),
    [],
  );

  // Materiales livianos: nada de "transmission" (obligaba a dibujar la escena dos veces por cuadro)
  const mats = useMemo(() => {
    const v0 = VARIANTS[0];
    return {
      metal: new THREE.MeshStandardMaterial({ color: v0.caseColor, metalness: 1, roughness: 0.16 }),
      strap: new THREE.MeshStandardMaterial({ color: v0.strapColor, metalness: 1, roughness: 0.14 }),
      strapSide: new THREE.MeshStandardMaterial({ color: v0.strapColor, metalness: 1, roughness: 0.34 }),
      hand: new THREE.MeshStandardMaterial({ color: v0.handColor, metalness: 0.75, roughness: 0.22, emissive: v0.handColor, emissiveIntensity: 0.18 }),
      sec: new THREE.MeshStandardMaterial({ color: "#2f6bff", metalness: 0.5, roughness: 0.3, emissive: "#2f6bff", emissiveIntensity: 0.35 }),
      dial: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.32, metalness: 0.3 }),
      // cristal: solo suma los reflejos del estudio encima de la esfera (efecto vidrio sin costo extra)
      glass: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        metalness: 1,
        roughness: 0.04,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      stone: new THREE.MeshStandardMaterial({ color: "#fff1f6", metalness: 1, roughness: 0.03, flatShading: true }),
    };
  }, []);

  useEffect(() => {
    mats.dial.map = dialTex;
    mats.dial.needsUpdate = true;
  }, [dialTex, mats]);

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(geo).forEach((g) => g.dispose());
    },
    [mats, geo],
  );

  // ubicar eslabones y piedras una sola vez
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < LINKS; i++) {
      const { y, z, phi } = linkPose(i);
      o.position.set(0, y, z);
      o.rotation.set(phi, 0, 0);
      o.updateMatrix();
      centerLinks.current.setMatrixAt(i, o.matrix);
      for (const s of [-1, 1]) {
        o.position.set(s * 0.31, y, z - 0.005);
        o.updateMatrix();
        sideLinks.current.setMatrixAt(i * 2 + (s > 0 ? 1 : 0), o.matrix);
      }
    }
    centerLinks.current.instanceMatrix.needsUpdate = true;
    sideLinks.current.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < STONES; i++) {
      const a = (i / STONES) * Math.PI * 2;
      o.position.set(Math.cos(a) * 0.975, Math.sin(a) * 0.975, 0.215);
      o.rotation.set(i * 1.7, i * 0.9, a);
      o.updateMatrix();
      stones.current.setMatrixAt(i, o.matrix);
    }
    stones.current.instanceMatrix.needsUpdate = true;
  }, []);

  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    const { damp } = THREE.MathUtils;
    const k = sample(isMobile ? MOBILE : DESKTOP, sceneState.progress);
    const px = sceneState.pointerX;
    const py = sceneState.pointerY;

    // posición y escala siguen al scroll
    const g = pos.current;
    if (!snapped.current) {
      snapped.current = true;
      g.position.set(k.p[0], k.p[1] - 0.4, k.p[2]);
      g.scale.setScalar(k.s * 0.85);
      base.current = { x: k.r[0], y: k.r[1] - 0.8, z: k.r[2] };
    }
    const float = reduced ? 0 : Math.sin(t * 0.8) * 0.05;
    g.position.x = damp(g.position.x, k.p[0], 3, d);
    g.position.y = damp(g.position.y, k.p[1] + float, 3, d);
    g.position.z = damp(g.position.z, k.p[2], 3, d);
    g.scale.setScalar(damp(g.scale.x, k.s, 3, d));

    // rotación suave + inclinación con el puntero
    const wobble = reduced ? 0 : Math.sin(t * 0.45) * 0.35;
    base.current.x = damp(base.current.x, k.r[0] - py * 0.25, 3, d);
    base.current.y = damp(base.current.y, k.r[1] + wobble + px * 0.4, 3, d);
    base.current.z = damp(base.current.z, k.r[2], 3, d);
    spin.current.cur = damp(spin.current.cur, spin.current.target, 2.4, d);
    rot.current.rotation.set(base.current.x, base.current.y + spin.current.cur, base.current.z);

    // agujas con la hora real
    const now = new Date();
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    secH.current.rotation.z = -(s / 60) * Math.PI * 2;
    minH.current.rotation.z = -(m / 60) * Math.PI * 2;
    hourH.current.rotation.z = -(h / 12) * Math.PI * 2;

    // transición de materiales entre colores
    const f = 1 - Math.exp(-5 * d);
    mats.metal.color.lerp(tmp.set(v.caseColor), f);
    mats.strap.color.lerp(tmp.set(v.strapColor), f);
    mats.strapSide.color.lerp(tmp.set(v.strapColor), f);
    mats.hand.color.lerp(tmp.set(v.handColor), f);
    mats.hand.emissive.lerp(tmp.set(v.handColor), f);
    mats.strap.metalness = damp(mats.strap.metalness, v.strapMetalness, 5, d);
    mats.strap.roughness = damp(mats.strap.roughness, v.strapRoughness * 0.7, 5, d);
    mats.strapSide.metalness = damp(mats.strapSide.metalness, v.strapMetalness, 5, d);
    mats.strapSide.roughness = damp(mats.strapSide.roughness, Math.min(1, v.strapRoughness + 0.12), 5, d);
    const ss = damp(strass.current.scale.x, v.strass ? 1 : 0.001, 6, d);
    strass.current.scale.setScalar(ss);
    strass.current.visible = ss > 0.01;

    // los reflejos se mueven con el puntero
    const er = scene.environmentRotation;
    er.y = damp(er.y, px * 0.9 + Math.sin(t * 0.15) * 0.4, 2, d);
    er.x = damp(er.x, -py * 0.25, 2, d);
  });

  return (
    <group ref={pos}>
      <Haze reduced={reduced} count={isMobile ? 4 : 6} />
      <Sparkles count={isMobile ? 16 : 40} scale={[4.6, 3.6, 3]} size={isMobile ? 2.2 : 3} speed={reduced ? 0 : 0.35} noise={0.6} opacity={0.9} color="#9cc0ff" />
      <Sparkles count={isMobile ? 6 : 14} scale={[3.6, 3, 2.4]} size={isMobile ? 3 : 4} speed={reduced ? 0 : 0.25} noise={0.4} color="#ffd9a0" />

      <group ref={rot}>
        {/* caja */}
        <mesh material={mats.metal} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[1, 1, 0.3, 64]} />
        </mesh>
        <mesh material={mats.metal} position-z={0.15}>
          <torusGeometry args={[0.97, 0.075, 20, 96]} />
        </mesh>
        <mesh material={mats.metal} position-z={-0.15}>
          <torusGeometry args={[0.94, 0.06, 12, 64]} />
        </mesh>
        <mesh material={mats.metal} position-z={-0.18} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.8, 0.86, 0.06, 48]} />
        </mesh>

        {/* esfera */}
        <mesh material={mats.dial} position-z={0.16}>
          <circleGeometry args={[0.92, 64]} />
        </mesh>

        {/* agujas */}
        <group position-z={0.18}>
          <group ref={hourH}>
            <mesh material={mats.hand} position-y={0.22}>
              <boxGeometry args={[0.07, 0.48, 0.02]} />
            </mesh>
          </group>
          <group ref={minH} position-z={0.014}>
            <mesh material={mats.hand} position-y={0.33}>
              <boxGeometry args={[0.05, 0.72, 0.02]} />
            </mesh>
          </group>
          <group ref={secH} position-z={0.028}>
            <mesh material={mats.sec} position-y={0.28}>
              <boxGeometry args={[0.016, 0.86, 0.01]} />
            </mesh>
          </group>
          <mesh material={mats.hand} position-z={0.034} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.045, 0.045, 0.03, 32]} />
          </mesh>
        </group>

        {/* cristal abombado con reflejos */}
        <mesh material={mats.glass} position-z={-2.685} rotation-x={Math.PI / 2}>
          <sphereGeometry args={[3, 64, 12, 0, Math.PI * 2, 0, 0.3116]} />
        </mesh>

        {/* corona */}
        <mesh material={mats.metal} position-x={1.06} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.1, 0.1, 0.16, 32]} />
        </mesh>
        <mesh material={mats.metal} position-x={1.15} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.1, 0.03, 32]} />
        </mesh>

        {/* asas */}
        {([[-0.38, 1], [0.38, 1], [-0.38, -1], [0.38, -1]] as const).map(([x, y], i) => (
          <mesh key={i} geometry={geo.lug} material={mats.metal} position={[x, y * 0.93, -0.04]} />
        ))}

        {/* strass del bisel (modelo rosa) */}
        <group ref={strass} scale={0.001}>
          <instancedMesh ref={stones} args={[geo.stone, mats.stone, STONES]} />
        </group>

        {/* malla */}
        <instancedMesh ref={centerLinks} args={[geo.center, mats.strap, LINKS]} />
        <instancedMesh ref={sideLinks} args={[geo.side, mats.strapSide, LINKS * 2]} />
      </group>
    </group>
  );
}
