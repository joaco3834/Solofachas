"use client";

import { useSyncExternalStore } from "react";

// Pedido compartido con el catálogo (misma clave en el navegador)
const KEY = "sf-pedido";
export type Line = { id: string; t: string; m: string | null; p: string; img: string; q: number };

export const priceNum = (p: string) => Number(String(p).replace(/[^0-9]/g, "")) || 0;
export const money = (n: number) => "$" + n.toLocaleString("es-AR");

let cache: Line[] = [];
let raw = "";
function read(): Line[] {
  try {
    const r = localStorage.getItem(KEY) || "[]";
    if (r !== raw) {
      raw = r;
      const v = JSON.parse(r);
      cache = Array.isArray(v) ? v : [];
    }
  } catch {
    cache = [];
  }
  return cache;
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key === KEY && l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  return useSyncExternalStore(subscribe, read, () => [] as Line[]);
}

export function addToCart(item: { t: string; p: string; img: string }, m: string | null = null) {
  const lines = [...read()].map((l) => ({ ...l }));
  const id = item.img + "|" + (m || "");
  const ex = lines.find((l) => l.id === id);
  if (ex) ex.q++;
  else lines.push({ id, t: item.t, m, p: item.p, img: item.img, q: 1 });
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {}
  emit();
  window.dispatchEvent(new CustomEvent("sf-added", { detail: item.t + (m ? ` (${m})` : "") }));
}
