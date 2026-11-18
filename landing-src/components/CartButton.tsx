"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CATALOGO } from "@/lib/data";
import { money, priceNum, useCart } from "@/lib/cart";

// Botón flotante "Tu pedido" (lleva al catálogo con el pedido abierto) y aviso al agregar
export default function CartButton() {
  const lines = useCart();
  const n = lines.reduce((s, l) => s + l.q, 0);
  const total = lines.reduce((s, l) => s + priceNum(l.p) * l.q, 0);
  const [toast, setToast] = useState<string | null>(null);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setToast((e as CustomEvent<string>).detail);
      setBump((b) => b + 1);
      clearTimeout(t);
      t = setTimeout(() => setToast(null), 3200);
    };
    window.addEventListener("sf-added", on);
    return () => {
      window.removeEventListener("sf-added", on);
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-[calc(84px+env(safe-area-inset-bottom))] left-1/2 z-[55] w-max max-w-[calc(100%-32px)] -translate-x-1/2 rounded-2xl bg-silver px-4 py-3 text-center text-sm font-semibold text-ink shadow-2xl"
          >
            Agregado al pedido: {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {n > 0 && (
          <motion.a
            href={`${CATALOGO}#pedido`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-[55] flex items-center gap-2.5 rounded-full bg-cobalt px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,.45)]"
          >
            Tu pedido
            <motion.span
              key={bump}
              initial={{ scale: bump ? 1.5 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-[13px] text-cobalt"
            >
              {n}
            </motion.span>
            {money(total)}
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
