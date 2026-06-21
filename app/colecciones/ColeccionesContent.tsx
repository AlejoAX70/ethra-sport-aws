"use client";

import Link from "next/link";
import { ShopLayout } from "@/components/ethra/ShopLayout";
import { toCdnImageUrl } from "@/lib/cdn";
import type { StorefrontCategory } from "@/lib/storefront/types";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ─── Single category card ─────────────────────────────────── */

interface CategoryCardProps {
  cat: StorefrontCategory;
  eager?: boolean;
}

function CategoryCard({ cat, eager = false }: CategoryCardProps) {
  return (
    <Link
      href={`/colecciones/${cat.id}`}
      className="group relative block w-full h-full overflow-hidden cursor-pointer"
    >
      {/* Photo */}
      <img
        src={toCdnImageUrl(cat.imageUrl)}
        alt={cat.name}
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      {/* Subtle vignette at sides */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Gold corner frames — appear on hover */}
      <div
        className="absolute top-5 left-5 w-8 h-8 border-t border-l border-ethra-gold/0 transition-all duration-500 group-hover:border-ethra-gold/55"
        aria-hidden
      />
      <div
        className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-ethra-gold/0 transition-all duration-500 group-hover:border-ethra-gold/55"
        aria-hidden
      />
      {/* Gold border overlay */}
      <div
        className="absolute inset-0 border border-ethra-gold/0 transition-all duration-500 group-hover:border-ethra-gold/30"
        aria-hidden
      />

      {/* Text */}
      <div className="absolute bottom-0 left-0 p-7 md:p-9">
        {cat.subcategories.length > 0 && (
          <p
            className="font-display text-[8px] tracking-[0.44em] uppercase mb-3"
            style={{ color: "oklch(0.78 0.085 80 / 0.72)" }}
          >
            {cat.subcategories.length}{" "}
            {cat.subcategories.length === 1 ? "colección" : "colecciones"}
          </p>
        )}

        <h2 className="font-serif text-ethra-bone leading-tight text-3xl md:text-4xl">
          {cat.name}
        </h2>

        <div className="flex items-center gap-3 mt-4">
          <span className="font-display text-[8px] tracking-luxury uppercase text-ethra-bone/72">
            Explorar
          </span>
          <span
            className="h-px bg-ethra-gold-light/55 transition-all duration-500 group-hover:w-10"
            style={{ width: "1.5rem" }}
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

/* ─── Page component ────────────────────────────────────────── */

interface Props {
  categories: StorefrontCategory[];
}

export function ColeccionesContent({ categories }: Props) {
  const headerRef = useScrollReveal({ threshold: 0.1 });
  const gridRef = useScrollReveal({ threshold: 0.04 });

  const hasCategories = categories.length > 0;

  return (
    <ShopLayout padTop={false}>
      {/* ── Dark hero header ────────────────────────────────── */}
      <div
        className="relative w-full pt-24 pb-20 md:pt-32 md:pb-28 px-6 text-center overflow-hidden"
        style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
      >
        {/* Subtle corner ornaments */}
        <div
          className="absolute top-8 left-8 w-10 h-10 border-t border-l border-ethra-gold/15 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute top-8 right-8 w-10 h-10 border-t border-r border-ethra-gold/15 pointer-events-none"
          aria-hidden
        />

        <div ref={headerRef} className="mx-auto max-w-2xl">
          {/* Diamond ornament */}
          <div className="flex items-center justify-center gap-5 mb-10" aria-hidden>
            <span
              className="block h-px bg-gradient-to-r from-transparent to-ethra-gold/40"
              style={{ width: "clamp(36px, 6vw, 72px)" }}
            />
            <span className="text-ethra-gold/55 text-xs">◆</span>
            <span
              className="block h-px bg-gradient-to-l from-transparent to-ethra-gold/40"
              style={{ width: "clamp(36px, 6vw, 72px)" }}
            />
          </div>

          {/* Brand label */}
          <p
            className="font-display text-[8px] tracking-[0.44em] uppercase mb-5"
            style={{ color: "oklch(0.66 0.105 80 / 0.60)" }}
          >
            Ethra Sport
          </p>

          {/* Title */}
          <h1
            className="font-serif text-5xl md:text-7xl leading-none mb-8"
            style={{ color: "oklch(0.965 0.005 85)" }}
          >
            Colecciones
          </h1>

          {/* Gold separator */}
          <div
            className="gold-line mx-auto mb-7"
            style={{ maxWidth: "160px" }}
            aria-hidden
          />

          {/* Subtitle */}
          <p
            className="font-display text-[9px] tracking-luxury uppercase"
            style={{ color: "oklch(0.965 0.005 85 / 0.40)" }}
          >
            La esencia en movimiento
          </p>
        </div>
      </div>

      {/* ── Categories grid ─────────────────────────────────── */}
      {!hasCategories ? (
        <div
          className="py-28 text-center"
          style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
        >
          <p
            className="font-display text-sm tracking-luxury uppercase"
            style={{ color: "oklch(0.965 0.005 85 / 0.40)" }}
          >
            Aún no hay categorías publicadas.
          </p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2px]"
          style={{ backgroundColor: "oklch(0.08 0.003 76)" }}
        >
          {categories.map((cat, i) => (
            <div key={cat.id} className="aspect-[4/5]">
              <CategoryCard cat={cat} eager={i < 3} />
            </div>
          ))}
        </div>
      )}
    </ShopLayout>
  );
}
