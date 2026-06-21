"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, ArrowRight, X } from "lucide-react";
import { ShopLayout } from "@/components/ethra/ShopLayout";
import { ProductCard } from "@/components/ethra/ProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type {
  StorefrontCategory,
  StorefrontPagination,
  StorefrontProduct,
} from "@/lib/storefront/types";

interface Props {
  categories: StorefrontCategory[];
  products: StorefrontProduct[];
  pagination: StorefrontPagination | null;
  page: number;
  categoryId?: string;
  q: string;
}

export function CatalogoContent({
  categories,
  products,
  pagination,
  page,
  categoryId,
  q,
}: Props) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(q);
  const gridRef = useScrollReveal({ threshold: 0.04 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("q", searchInput.trim());
    router.push(`/catalogo?${params}`);
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push("/catalogo");
  };

  const navigatePage = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (categoryId) params.set("categoryId", categoryId);
    router.push(`/catalogo?${params}`);
  };

  const isFiltered = !!q || !!categoryId;

  return (
    <ShopLayout padTop={false}>
      {/* ── Dark hero header ────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
      >
        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
          aria-hidden
        />

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-ethra-gold/15 pointer-events-none" aria-hidden />
        <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-ethra-gold/15 pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Ornament */}
            <div className="flex items-center justify-center gap-5 mb-10" aria-hidden>
              <span
                className="block h-px bg-gradient-to-r from-transparent to-ethra-gold/40"
                style={{ width: "clamp(32px,5vw,64px)" }}
              />
              <span className="text-ethra-gold/55 text-xs">◆</span>
              <span
                className="block h-px bg-gradient-to-l from-transparent to-ethra-gold/40"
                style={{ width: "clamp(32px,5vw,64px)" }}
              />
            </div>

            {/* Title */}
            <p
              className="font-display text-[8px] tracking-[0.44em] uppercase mb-4"
              style={{ color: "oklch(0.66 0.105 80 / 0.60)" }}
            >
              Ethra Sport
            </p>
            <h1
              className="font-serif text-5xl md:text-7xl leading-none mb-4"
              style={{ color: "oklch(0.965 0.005 85)" }}
            >
              Catálogo
            </h1>

            {/* Active filter context */}
            {q ? (
              <p
                className="font-display text-[9px] tracking-luxury uppercase mt-3 mb-10"
                style={{ color: "oklch(0.965 0.005 85 / 0.40)" }}
              >
                Resultados para &ldquo;{q}&rdquo;
              </p>
            ) : (
              <div
                className="gold-line mx-auto mt-6 mb-10"
                style={{ maxWidth: "140px" }}
                aria-hidden
              />
            )}

            {/* ── Integrated search bar ── */}
            <form onSubmit={handleSearch} className="relative flex items-stretch max-w-lg mx-auto">
              {/* Icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden>
                <Search
                  className="h-4 w-4"
                  style={{ color: "oklch(0.66 0.105 80 / 0.60)" }}
                />
              </span>

              {/* Input */}
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar en la colección..."
                aria-label="Buscar productos"
                className="flex-1 pl-11 pr-4 py-4 bg-transparent font-display text-[10px] tracking-wider placeholder:tracking-wider outline-none transition-colors duration-300"
                style={{
                  border: "1px solid oklch(0.965 0.005 85 / 0.15)",
                  borderRight: "none",
                  color: "oklch(0.965 0.005 85 / 0.85)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.66 0.105 80 / 0.50)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.965 0.005 85 / 0.15)";
                }}
              />

              {/* Clear button — appears when there is text */}
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Limpiar búsqueda"
                  className="px-3 flex items-center transition-colors duration-200"
                  style={{
                    border: "1px solid oklch(0.965 0.005 85 / 0.15)",
                    borderLeft: "none",
                    borderRight: "none",
                    color: "oklch(0.965 0.005 85 / 0.35)",
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {/* Submit button */}
              <button
                type="submit"
                aria-label="Buscar"
                className="px-6 py-4 font-display text-[9px] tracking-luxury uppercase transition-all duration-300"
                style={{
                  border: "1px solid oklch(0.66 0.105 80 / 0.40)",
                  color: "oklch(0.66 0.105 80)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "oklch(0.66 0.105 80)";
                  (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.10 0.004 78)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "oklch(0.66 0.105 80)";
                }}
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bone section: filters + products ───────────────── */}
      <div className="bg-ethra-bone">
        {/* ── Category filter tabs ── */}
        {!q && categories.length > 0 && (
          <nav
            className="border-b border-ethra-stone/15 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Filtrar por colección"
          >
            <ul className="flex gap-0 min-w-max px-6 md:px-10">
              {/* "Todos" tab */}
              <li className="relative">
                <Link
                  href="/catalogo"
                  className={`inline-block font-display text-[10px] tracking-luxury uppercase whitespace-nowrap py-5 px-5 transition-colors duration-300 ${
                    !categoryId
                      ? "text-ethra-black"
                      : "text-ethra-stone hover:text-ethra-charcoal"
                  }`}
                >
                  Todos
                </Link>
                {!categoryId && (
                  <span
                    className="absolute bottom-0 left-5 right-5 h-px"
                    style={{ background: "oklch(0.66 0.105 80 / 0.65)" }}
                    aria-hidden
                  />
                )}
              </li>

              {categories.map((cat) => {
                const isActive = categoryId === cat.id;
                return (
                  <li key={cat.id} className="relative">
                    <Link
                      href={`/catalogo?categoryId=${cat.id}`}
                      className={`inline-block font-display text-[10px] tracking-luxury uppercase whitespace-nowrap py-5 px-5 transition-colors duration-300 ${
                        isActive
                          ? "text-ethra-black"
                          : "text-ethra-stone hover:text-ethra-charcoal"
                      }`}
                    >
                      {cat.name}
                    </Link>
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-5 right-5 h-px"
                        style={{ background: "oklch(0.66 0.105 80 / 0.65)" }}
                        aria-hidden
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {/* ── Product count + context ── */}
        {!q && pagination && (
          <div className="px-6 md:px-10 pt-8 pb-4 flex items-center gap-4">
            <span
              className="block h-px w-6"
              style={{ background: "oklch(0.66 0.105 80 / 0.45)" }}
              aria-hidden
            />
            <p className="font-display text-[9px] tracking-luxury uppercase text-ethra-stone">
              {pagination.total} piezas
            </p>
          </div>
        )}

        {/* ── Product grid ── */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pb-28">
          {products.length === 0 ? (
            /* Empty state */
            <div className="py-28 text-center">
              <div className="flex items-center justify-center gap-5 mb-8" aria-hidden>
                <span className="block h-px w-10 bg-gradient-to-r from-transparent to-ethra-gold/35" />
                <span className="text-ethra-gold/40 text-xs">◆</span>
                <span className="block h-px w-10 bg-gradient-to-l from-transparent to-ethra-gold/35" />
              </div>
              <p className="font-serif text-2xl text-ethra-charcoal mb-4">
                {q ? `Sin resultados para "${q}"` : "Catálogo vacío"}
              </p>
              <p className="font-display text-[9px] tracking-luxury uppercase text-ethra-stone mb-10">
                {q
                  ? "Intenta con otras palabras o explora el catálogo completo"
                  : "Pronto habrá nuevas piezas disponibles"}
              </p>
              {q && (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center gap-3 font-display text-[9px] tracking-luxury uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors duration-300 border-b border-ethra-charcoal/30 hover:border-ethra-gold/40 pb-px"
                >
                  Ver catálogo completo
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid with stagger animation */}
              <div
                ref={gridRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 stagger-reveal pt-2"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* ── Pagination ── */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-20">
                  {/* Prev */}
                  <button
                    onClick={() => navigatePage(page - 1)}
                    disabled={!pagination.hasPrev}
                    aria-label="Página anterior"
                    className="group flex items-center gap-3 font-display text-[9px] tracking-luxury uppercase transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                    style={{ color: "oklch(0.28 0.003 80)" }}
                  >
                    <span
                      className="flex items-center justify-center h-10 w-10 border border-ethra-charcoal/25 transition-all duration-300 group-hover:border-ethra-black group-hover:bg-ethra-black group-hover:text-ethra-bone"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </span>
                    <span className="hidden md:inline">Anterior</span>
                  </button>

                  {/* Page indicator */}
                  <div className="flex items-center gap-3">
                    <span
                      className="block h-px"
                      style={{ width: "1.5rem", background: "oklch(0.66 0.105 80 / 0.40)" }}
                      aria-hidden
                    />
                    <span className="font-display text-[9px] tracking-luxury uppercase text-ethra-stone">
                      {pagination.page} &nbsp;/&nbsp; {pagination.totalPages}
                    </span>
                    <span
                      className="block h-px"
                      style={{ width: "1.5rem", background: "oklch(0.66 0.105 80 / 0.40)" }}
                      aria-hidden
                    />
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => navigatePage(page + 1)}
                    disabled={!pagination.hasNext}
                    aria-label="Página siguiente"
                    className="group flex items-center gap-3 font-display text-[9px] tracking-luxury uppercase transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                    style={{ color: "oklch(0.28 0.003 80)" }}
                  >
                    <span className="hidden md:inline">Siguiente</span>
                    <span
                      className="flex items-center justify-center h-10 w-10 border border-ethra-charcoal/25 transition-all duration-300 group-hover:border-ethra-black group-hover:bg-ethra-black group-hover:text-ethra-bone"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </div>
              )}

              {/* End of results */}
              {pagination && !pagination.hasNext && pagination.totalPages <= 1 && products.length > 0 && (
                <p className="mt-16 text-center font-display text-[9px] tracking-luxury uppercase text-ethra-stone/60">
                  Has explorado todo el catálogo
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </ShopLayout>
  );
}
