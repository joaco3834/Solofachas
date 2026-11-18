import { CATALOGO, IG, WA } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden px-4 pb-10 pt-20 md:px-10">
      <div className="flex flex-col justify-between gap-10 border-t border-line pt-10 md:flex-row">
        <div>
          <p className="font-display text-2xl font-extrabold">
            SOLO<span className="text-cobalt">FACHAS</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">Accesorios para hombre y mujer. San Fernando del Valle de Catamarca.</p>
        </div>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <li><a className="text-muted transition-colors hover:text-silver" href={WA} target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a className="text-muted transition-colors hover:text-silver" href={IG} target="_blank" rel="noopener">Instagram @solofachas__</a></li>
          <li><a className="text-muted transition-colors hover:text-silver" href={CATALOGO}>Catálogo completo</a></li>
        </ul>
      </div>
      <p aria-hidden="true" className="mt-16 select-none text-center font-display text-[10.5vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-panel">
        Solofachas
      </p>
    </footer>
  );
}
