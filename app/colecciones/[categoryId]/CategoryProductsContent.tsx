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
        <div key={index} className="aspect-[4/5] w-full animate-pulse bg-[#f3f3f3]" />
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
    <ShopLayout>
      <section className="bg-ethra-bone pb-20 md:pb-28">
        <CategoryCatalogNav items={categoryContext.navItems} activeId={categoryContext.activeId} />

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
            <p className="py-20 text-center font-display text-sm text-ethra-stone">
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
                <div key={index} className="aspect-[4/5] w-full animate-pulse bg-[#f3f3f3]" />
              ))}
            </div>
          ) : null}

          {sortedProducts.length > 0 && !hasNextPage ? (
            <p className="mt-10 text-center font-display text-[10px] tracking-luxury uppercase text-ethra-stone">
              Has visto todos los productos
            </p>
          ) : null}
        </div>
      </section>
    </ShopLayout>
  );
}
