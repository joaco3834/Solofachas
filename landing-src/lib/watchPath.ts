// Recorrido del reloj según el scroll (lo usan el 3D y el modo liviano)
import { sceneState } from "./sceneState";
export type Key = { p: [number, number, number]; r: [number, number, number]; s: number };

// 0 = portada · 1 = "Se nota de lejos" · 2 = "La malla" · 3 = "Probalo"
export const DESKTOP: Key[] = [
  { p: [1.8, -0.05, 0], r: [0.35, -0.6, 0.12], s: 0.94 },
  { p: [-1.4, -0.05, 0.3], r: [0.04, 0.28, 0], s: 1.0 },
  { p: [1.45, 0, 0.2], r: [0.9, -1.25, 0.25], s: 1 },
  { p: [-1.4, -0.05, 0], r: [0.18, 0.4, -0.05], s: 1 },
];
export const MOBILE: Key[] = [
  { p: [0, -1.08, 0], r: [0.35, -0.5, 0.1], s: 0.58 },
  { p: [0, -1.0, 0.25], r: [0.04, 0.25, 0], s: 0.68 },
  { p: [0, -1.02, 0], r: [0.9, -1.2, 0.25], s: 0.62 },
  { p: [0, -1.3, 0], r: [0.2, 0.35, 0], s: 0.5 },
];

export function sample(keys: Key[], progress: number): Key {
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


// En el celu, el último punto del recorrido se ajusta al hueco libre de "Elegí tu esfera"
export function keysFor(isMobile: boolean): Key[] {
  if (!isMobile) return DESKTOP;
  const slot = sceneState.slot;
  if (!slot) return MOBILE;
  const last = MOBILE[MOBILE.length - 1];
  return [...MOBILE.slice(0, -1), { p: [0, slot.y, 0], r: last.r, s: slot.s }];
}
