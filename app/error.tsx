"use client";

import Link from "next/link";
import { EthraLogo } from "@/components/ethra/EthraLogo";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ethra-bone px-6">
      <Link href="/" className="mb-10 transition-opacity hover:opacity-90" aria-label="Ethra Sport — Inicio">
        <EthraLogo variant="display" />
      </Link>
      <div className="max-w-md text-center">
        <h1 className="font-display text-sm tracking-luxury uppercase text-ethra-charcoal">
          Esta página no cargó
        </h1>
        <p className="mt-3 text-sm text-ethra-stone">
          Algo salió mal. Puedes intentar recargar o volver al inicio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center border border-ethra-black bg-ethra-black px-6 py-3 font-display text-[11px] tracking-[0.14em] uppercase text-ethra-bone transition-colors hover:bg-transparent hover:text-ethra-black"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-ethra-stone/40 px-6 py-3 font-display text-[11px] tracking-[0.14em] uppercase text-ethra-charcoal transition-colors hover:border-ethra-black"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
