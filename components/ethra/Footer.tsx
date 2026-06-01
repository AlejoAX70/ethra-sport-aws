import Link from "next/link";
import { EthraLogo } from "./EthraLogo";
import { ETHRA_BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-ethra-bone border-t border-border/60 py-16">
      <div className="mx-auto max-w-[1400px] px-6 text-center">
        <Link
          href="/"
          className="inline-flex flex-col items-center gap-3 transition-opacity hover:opacity-90"
          aria-label={`${ETHRA_BRAND.name} — Inicio`}
        >
          <EthraLogo variant="footer" />
        </Link>

        <div className="gold-line mt-8 mb-8 mx-auto max-w-md" />

        <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone mb-5">
          Pagos seguros con
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-ethra-charcoal font-display text-sm">
          <span className="font-bold italic">VISA</span>
          <span className="lowercase">mastercard</span>
          <span className="tracking-wider uppercase text-xs">American Express</span>
          <span className="italic font-light">pse</span>
          <span>Addi</span>
        </div>

        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link href="/colecciones" className="font-display text-[11px] tracking-wider uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors">Colecciones</Link>
          <Link href="/filosofia" className="font-display text-[11px] tracking-wider uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors">Filosofía</Link>
          <a href="#" className="font-display text-[11px] tracking-wider uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors">Diario</a>
          <a href="#" className="font-display text-[11px] tracking-wider uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors">Contacto</a>
          <a href="#" className="font-display text-[11px] tracking-wider uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors">Términos</a>
          <a href="#" className="font-display text-[11px] tracking-wider uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors">Privacidad</a>
        </nav>

        <p className="mt-10 font-display text-[10px] tracking-luxury uppercase text-ethra-stone">
          © 2024 Ethra Sport. Pureza en movimiento.
        </p>
      </div>
    </footer>
  );
}
