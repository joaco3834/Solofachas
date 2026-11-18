"use client";

import { motion } from "framer-motion";

// Letras que suben desde una máscara, una por una
export default function SplitText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden pb-[0.06em] ${className}`} aria-hidden="true">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "110%", rotate: 8 }}
          animate={{ y: "0%", rotate: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
