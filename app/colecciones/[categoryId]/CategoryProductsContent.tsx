"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ShopLayout } from "@/components/ethra/ShopLayout";
import { CategoryCatalogNav } from "@/components/ethra/CategoryCatalogNav";
import {
  CategoryCatalogToolbar,
  type CatalogGridColumns,
} from "@/components/ethra/CategoryCatalogToolbar";
import { CatalogGridProductCard } from "@/components/ethra/CatalogGridProductCard";
import { StorefrontError } from "@/components/ethra/StorefrontError";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  categoriesQueryOptions,
  categoryProductsInfiniteQueryOptions,
} from "@/lib/storefront/queries";
import { StorefrontApiError } from "@/lib/storefront/client";
import {
  resolveCategoryPageContext,
  sortCatalogProducts,
  type CatalogSortOption,
} from "@/lib/storefront/format";

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

export function CategoryProductsContent() {
  const params = useParams();
  const categoryId = typeof params.categoryId === "string" ? params.categoryId : "";

  const [sort, setSort] = useState<CatalogSortOption>("newest");
  const [columns, setColumns] = useState<CatalogGridColumns>(4);

  const categoriesQuery = useQuery(categoriesQueryOptions());
  const productsQuery = useInfiniteQuery(
    categoryProductsInfiniteQueryOptions(categoryId, { limit: PAGE_LIMIT }),
  );

  const categoryContext = useMemo(() => {
    if (!categoriesQuery.data?.categories) {
      return {
        title: "Colección",
        navItems: [],
        activeId: categoryId,
      };
    }

    return resolveCategoryPageContext(categoriesQuery.data.categories, categoryId);
  }, [categoriesQuery.data?.categories, categoryId]);

  const products = useMemo(() => {
    const loaded = productsQuery.data?.pages.flatMap((page) => page.products) ?? [];
    return sortCatalogProducts(loaded, sort);
  }, [productsQuery.data?.pages, sort]);

  const total = productsQuery.data?.pages[0]?.pagination.total;

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = productsQuery;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const sentinelRef = useInfiniteScroll(loadMore, Boolean(hasNextPage));

  const errorMessage =
    productsQuery.error instanceof StorefrontApiError
      ? productsQuery.error.message
      : productsQuery.error instanceof Error
        ? productsQuery.error.message
        : "No se pudieron cargar los productos.";

  return (
    <ShopLayout>
      <section className="bg-ethra-bone pb-20 md:pb-28">
        <CategoryCatalogNav items={categoryContext.navItems} activeId={categoryContext.activeId} />

        <CategoryCatalogToolbar
          sort={sort}
          onSortChange={setSort}
          columns={columns}
          onColumnsChange={setColumns}
          total={total}
        />

        <div className="mx-auto max-w-[1600px] px-3 pt-6 md:px-6 md:pt-8">
          {productsQuery.isPending ? <GridSkeleton columns={columns} /> : null}

          {productsQuery.isError ? (
            <div className="px-3 md:px-4">
              <StorefrontError message={errorMessage} />
            </div>
          ) : null}

          {productsQuery.isSuccess && products.length === 0 ? (
            <p className="py-20 text-center font-display text-sm text-ethra-stone">
              No hay productos en esta colección.
            </p>
          ) : null}

          {products.length > 0 ? (
            <div className={`grid gap-2 md:gap-3 ${gridColumnClasses[columns]}`}>
              {products.map((product) => (
                <CatalogGridProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}

          <div ref={sentinelRef} className="h-px" aria-hidden="true" />

          {productsQuery.isFetchingNextPage ? (
            <div className={`mt-3 grid gap-2 md:gap-3 ${gridColumnClasses[columns]}`}>
              {Array.from({ length: columns }).map((_, index) => (
                <div key={index} className="aspect-[4/5] w-full animate-pulse bg-[#f3f3f3]" />
              ))}
            </div>
          ) : null}

          {productsQuery.isSuccess && !productsQuery.hasNextPage && products.length > 0 ? (
            <p className="mt-10 text-center font-display text-[10px] tracking-luxury uppercase text-ethra-stone">
              Has visto todos los productos
            </p>
          ) : null}
        </div>
      </section>
    </ShopLayout>
  );
}
