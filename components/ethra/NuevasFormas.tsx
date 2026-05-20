import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { StorefrontProduct } from "@/lib/storefront/types";

interface NuevasFormasProps {
  products: StorefrontProduct[];
}

export function NuevasFormas({ products }: NuevasFormasProps) {
  return (
    <section className="bg-ethra-bone pt-12 pb-24 md:pt-16 md:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between mb-14">
          <h2 className="font-serif text-4xl md:text-5xl text-ethra-black">Nuevas Formas</h2>
          <Link
            href="/catalogo"
            className="font-display text-[11px] tracking-luxury uppercase text-ethra-charcoal border-b border-ethra-charcoal pb-1 hover:text-ethra-gold hover:border-ethra-gold transition-colors"
          >
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} priority />
          ))}
        </div>
      </div>
    </section>
  );
}
