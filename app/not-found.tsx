import Link from "next/link";
import { EthraLogo } from "@/components/ethra/EthraLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ethra-bone px-6">
      <Link href="/" className="mb-10 transition-opacity hover:opacity-90" aria-label="Ethra Sport — Inicio">
        <EthraLogo variant="display" />
      </Link>
      <div className="max-w-md text-center">
        <h1 className="font-serif text-6xl text-ethra-black md:text-7xl">404</h1>
        <h2 className="mt-4 font-display text-sm tracking-luxury uppercase text-ethra-charcoal">
          Página no encontrada
        </h2>
        <p className="mt-3 text-sm text-ethra-stone">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center border border-ethra-black bg-ethra-black px-6 py-3 font-display text-[11px] tracking-[0.14em] uppercase text-ethra-bone transition-colors hover:bg-transparent hover:text-ethra-black"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
