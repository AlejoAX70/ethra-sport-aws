import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  getCatalog,
  getCategories,
  getCategoryProducts,
  getPaymentStatus,
  getProduct,
  getStoreInfo,
  searchCatalog,
} from "./api";
import type { CatalogQueryParams } from "./types";

export const storefrontKeys = {
  all: ["storefront"] as const,
  categories: () => [...storefrontKeys.all, "categories"] as const,
  catalog: (params: CatalogQueryParams) =>
    [...storefrontKeys.all, "catalog", params] as const,
  categoryProducts: (categoryId: string, params: Omit<CatalogQueryParams, "categoryId">) =>
    [...storefrontKeys.all, "category-products", categoryId, params] as const,
  categoryProductsInfinite: (categoryId: string, limit: number) =>
    [...storefrontKeys.all, "category-products-infinite", categoryId, limit] as const,
  product: (id: string) => [...storefrontKeys.all, "product", id] as const,
  search: (q: string, limit: number) => [...storefrontKeys.all, "search", q, limit] as const,
  storeInfo: () => [...storefrontKeys.all, "store-info"] as const,
  paymentStatus: (reference: string) =>
    [...storefrontKeys.all, "payment-status", reference] as const,
};

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: storefrontKeys.categories(),
    queryFn: getCategories,
    staleTime: 60_000,
  });

export const catalogQueryOptions = (params: CatalogQueryParams = {}) =>
  queryOptions({
    queryKey: storefrontKeys.catalog(params),
    queryFn: () => getCatalog(params),
    staleTime: 30_000,
  });

export const categoryProductsInfiniteQueryOptions = (
  categoryId: string,
  params: { limit?: number } = {},
) => {
  const limit = params.limit ?? 20;

  return infiniteQueryOptions({
    queryKey: storefrontKeys.categoryProductsInfinite(categoryId, limit),
    queryFn: ({ pageParam }) => getCategoryProducts(categoryId, { page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    staleTime: 30_000,
  });
};

export const productQueryOptions = (productId: string) =>
  queryOptions({
    queryKey: storefrontKeys.product(productId),
    queryFn: () => getProduct(productId),
    staleTime: 60_000,
  });

export const searchCatalogQueryOptions = (q: string, limit = 20) =>
  queryOptions({
    queryKey: storefrontKeys.search(q, limit),
    queryFn: () => searchCatalog(q, limit),
    enabled: q.trim().length > 0,
    staleTime: 30_000,
  });

export const storeInfoQueryOptions = () =>
  queryOptions({
    queryKey: storefrontKeys.storeInfo(),
    queryFn: getStoreInfo,
    staleTime: 120_000,
  });

const FINAL_PAYMENT_STATUSES = new Set(["APPROVED", "DECLINED", "ERROR", "VOIDED", "REFUNDED"]);

export const paymentStatusQueryOptions = (reference: string) =>
  queryOptions({
    queryKey: storefrontKeys.paymentStatus(reference),
    queryFn: () => getPaymentStatus(reference),
    enabled: reference.length > 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && FINAL_PAYMENT_STATUSES.has(status)) return false;
      return 3_000;
    },
    staleTime: 0,
  });
