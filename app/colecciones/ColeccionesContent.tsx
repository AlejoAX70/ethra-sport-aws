import Link from "next/link";
import { ShopLayout } from "@/components/ethra/ShopLayout";
import type { StorefrontCategory } from "@/lib/storefront/types";

interface Props {
  categories: StorefrontCategory[];
}

export function ColeccionesContent({ categories }: Props) {
  return (
    <ShopLayout>
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl text-ethra-black mb-14">Colecciones</h1>

        {categories.length === 0 ? (
          <p className="text-center font-display text-sm text-ethra-stone py-16">
            Aún no hay categorías publicadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/colecciones/${cat.id}`}
                  className="group relative block aspect-[4/5] overflow-hidden"
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="font-serif text-3xl md:text-4xl text-ethra-bone">{cat.name}</h2>
                    {cat.subcategories.length > 0 ? (
                      <p className="mt-2 font-display text-[10px] tracking-luxury uppercase text-ethra-bone/80">
                        {cat.subcategories.length} subcategorías
                      </p>
                    ) : null}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </ShopLayout>
  );
}
