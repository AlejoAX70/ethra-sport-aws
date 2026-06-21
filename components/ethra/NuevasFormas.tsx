import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { StorefrontProduct } from "@/lib/storefront/types";

interface NuevasFormasProps {
  products: StorefrontProduct[];
}

export function NuevasFormas({ products }: NuevasFormasProps) {
  return (
    <section className="bg-ethra-cream pt-20 pb-28 md:pt-28 md:pb-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 md:mb-20">
          <div className="flex items-center gap-5">
            <span className="block w-px h-10 bg-ethra-gold/55 flex-shrink-0" aria-hidden />
            <div>
              <p className="font-display text-[8px] tracking-luxury uppercase text-ethra-stone mb-2">
                Temporada actual
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-ethra-black leading-none">
                Nuevas Formas
              </h2>
            </div>
          </div>

          <Link
            href="/catalogo"
            className="hidden md:inline-flex items-center gap-3 font-display text-[9px] tracking-luxury uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors duration-300 group"
          >
            Ver todo
            <span
              className="block h-px w-5 bg-ethra-charcoal/50 transition-all duration-400 group-hover:w-9 group-hover:bg-ethra-gold/60"
              aria-hidden
            />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i === 0} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-14 text-center md:hidden">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-3 font-display text-[9px] tracking-luxury uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors duration-300 group"
          >
            Ver catálogo completo
            <span className="block h-px w-5 bg-ethra-charcoal/50 group-hover:w-9 group-hover:bg-ethra-gold/60 transition-all duration-400" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
