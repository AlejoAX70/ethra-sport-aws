import { storefrontFetch } from "./client";
import type {
  CatalogQueryParams,
  CreateIntentRequest,
  CreateIntentResponse,
  PaymentStatusResponse,
  StorefrontCatalogResponse,
  StorefrontCategoriesResponse,
  StorefrontProduct,
  StorefrontSearchResponse,
  StorefrontStoreInfo,
} from "./types";

function toQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function getCategories() {
  return storefrontFetch<StorefrontCategoriesResponse>("/categories");
}

export function getCatalog(params: CatalogQueryParams = {}) {
  const qs = toQueryString({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    categoryId: params.categoryId,
  });
  return storefrontFetch<StorefrontCatalogResponse>(`/catalog${qs}`);
}

export function searchCatalog(q: string, limit = 20) {
  const qs = toQueryString({ q: q.trim(), limit });
  return storefrontFetch<StorefrontSearchResponse>(`/catalog/search${qs}`);
}

export function getProduct(productId: string) {
  return storefrontFetch<StorefrontProduct>(`/catalog/${encodeURIComponent(productId)}`);
}

export function getCategoryProducts(
  categoryId: string,
  params: Omit<CatalogQueryParams, "categoryId"> = {},
) {
  const qs = toQueryString({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });
  return storefrontFetch<StorefrontCatalogResponse>(
    `/categories/${encodeURIComponent(categoryId)}/products${qs}`,
  );
}

export function getStoreInfo() {
  return storefrontFetch<StorefrontStoreInfo>("/store-info");
}

export function createPaymentIntent(payload: CreateIntentRequest) {
  return storefrontFetch<CreateIntentResponse>("/payments/intent", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPaymentStatus(reference: string) {
  const qs = new URLSearchParams({ reference }).toString();
  return storefrontFetch<PaymentStatusResponse>(`/payments/status?${qs}`);
}
