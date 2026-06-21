"use client";

import { useCallback, useMemo, useState } from "react";
import { ShopLayout } from "@/components/ethra/ShopLayout";
import { CategoryCatalogNav } from "@/components/ethra/CategoryCatalogNav";
import {
  CategoryCatalogToolbar,
  type CatalogGridColumns,
} from "@/components/ethra/CategoryCatalogToolbar";
import { CatalogGridProductCard } from "@/components/ethra/CatalogGridProductCard";
import { StorefrontError } from "@/components/ethra/StorefrontError";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { fetchCategoryProductsPage } from "@/lib/storefront/actions";
import {
  resolveCategoryPageContext,
  sortCatalogProducts,
  type CatalogSortOption,
} from "@/lib/storefront/format";
import { toCdnImageUrl } from "@/lib/cdn";
import type {
  StorefrontCategory,
  StorefrontPagination,
  StorefrontProduct,
} from "@/lib/storefront/types";

const PAGE_LIMIT = 20;

const gridColumnClasses: Record<CatalogGridColumns, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

function GridSkeleton({ columns }: { columns: CatalogGridColumns }) {
  return (
    <div className={`grid gap-2 md:gap-3 ${gridColumnClasses[columns]}`}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="aspect-[4/5] w-full animate-pulse bg-ethra-cream" />
      ))}
    </div>
  );
}

interface Props {
  categoryId: string;
  categories: StorefrontCategory[];
  initialProducts: StorefrontProduct[];
  initialPagination: StorefrontPagination;
}

export function CategoryProductsContent({
  categoryId,
  categories,
  initialProducts,
  initialPagination,
}: Props) {
  const [sort, setSort] = useState<CatalogSortOption>("newest");
  const [columns, setColumns] = useState<CatalogGridColumns>(4);
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const categoryContext = useMemo(
    () => resolveCategoryPageContext(categories, categoryId),
    [categories, categoryId],
  );

  /* Active category image for the hero */
  const activeCategoryImageUrl = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    return toCdnImageUrl(cat?.imageUrl);
  }, [categories, categoryId]);

  const sortedProducts = useMemo(
    () => sortCatalogProducts(products, sort),
    [products, sort],
  );

  const hasNextPage = pagination.hasNext;

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    setLoadError(null);

    try {
      const nextPage = pagination.page + 1;
      const res = await fetchCategoryProductsPage(categoryId, nextPage, PAGE_LIMIT);
      setProducts((prev) => [...prev, ...res.products]);
      setPagination(res.pagination);
    } catch {
      setLoadError("No se pudieron cargar más productos.");
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [categoryId, hasNextPage, isFetchingNextPage, pagination.page]);

  const sentinelRef = useInfiniteScroll(loadMore, hasNextPage);

  return (
    <ShopLayout padTop={false}>
      {/* ── Category hero ──────────────────────────────────── */}
      <div className="relative w-full h-[52vh] min-h-[360px] overflow-hidden">
        {/* Background image */}
        {activeCategoryImageUrl ? (
          <img
            src={activeCategoryImageUrl}
            alt={categoryContext.title}
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: "scale(1.04)" }}
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: "oklch(0.12 0.004 78)" }} />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/88" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          {/* Label */}
          <p
            className="font-display text-[8px] tracking-[0.44em] uppercase mb-5"
            style={{ color: "oklch(0.66 0.105 80 / 0.65)" }}
          >
            Colección
          </p>

          {/* Category name */}
          <h1
            className="font-serif text-5xl md:text-7xl leading-none"
            style={{ color: "oklch(0.965 0.005 85)" }}
          >
            {categoryContext.title}
          </h1>

          {/* Product count with gold rules */}
          {pagination.total > 0 && (
            <div className="flex items-center gap-5 mt-8">
              <span
                className="block h-px"
                style={{
                  width: "2.5rem",
                  background: "linear-gradient(to right, transparent, oklch(0.66 0.105 80 / 0.50))",
                }}
                aria-hidden
              />
              <span
                className="font-display text-[8px] tracking-luxury uppercase"
                style={{ color: "oklch(0.965 0.005 85 / 0.50)" }}
              >
                {pagination.total} {pagination.total === 1 ? "pieza" : "piezas"}
              </span>
              <span
                className="block h-px"
                style={{
                  width: "2.5rem",
                  background: "linear-gradient(to left, transparent, oklch(0.66 0.105 80 / 0.50))",
                }}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Products section ───────────────────────────────── */}
      <section className="bg-ethra-bone pb-20 md:pb-28">
        <CategoryCatalogNav
          items={categoryContext.navItems}
          activeId={categoryContext.activeId}
        />

        <CategoryCatalogToolbar
          sort={sort}
          onSortChange={setSort}
          columns={columns}
          onColumnsChange={setColumns}
          total={pagination.total}
        />

        <div className="mx-auto max-w-[1600px] px-3 pt-6 md:px-6 md:pt-8">
          {loadError ? (
            <div className="px-3 md:px-4 mb-6">
              <StorefrontError message={loadError} />
            </div>
          ) : null}

          {sortedProducts.length === 0 ? (
            <p className="py-20 text-center font-display text-sm text-ethra-stone tracking-wider uppercase">
              No hay productos en esta colección.
            </p>
          ) : (
            <div className={`grid gap-2 md:gap-3 ${gridColumnClasses[columns]}`}>
              {sortedProducts.map((product) => (
                <CatalogGridProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-px" aria-hidden="true" />

          {isFetchingNextPage ? (
            <div className={`mt-3 grid gap-2 md:gap-3 ${gridColumnClasses[columns]}`}>
              {Array.from({ length: columns }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/5] w-full animate-pulse bg-ethra-cream"
                />
              ))}
            </div>
          ) : null}

          {sortedProducts.length > 0 && !hasNextPage ? (
            <p className="mt-12 text-center font-display text-[9px] tracking-luxury uppercase text-ethra-stone">
              Has explorado toda la colección
            </p>
          ) : null}
        </div>
      </section>
    </ShopLayout>
  );
}
