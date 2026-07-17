import type { StorefrontBanner, StorefrontBannersResponse } from "./types";

export function isValidStorefrontBanner(x: unknown): x is StorefrontBanner {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  if (typeof b.id !== "string" || !b.id) return false;
  if (b.bannerType !== "MODAL" && b.bannerType !== "PERSISTENT") return false;
  if (typeof b.imageUrl !== "string" || !b.imageUrl) return false;
  if (typeof b.altText !== "string" || !b.altText) return false;
  if (b.linkType === "PRODUCT") return typeof b.productId === "string" && !!b.productId;
  if (b.linkType === "CATEGORY") return typeof b.categoryId === "string" && !!b.categoryId;
  return false;
}

export function parseStorefrontBannersResponse(raw: unknown): StorefrontBannersResponse {
  if (!raw || typeof raw !== "object") return {};
  const data = raw as Record<string, unknown>;
  const result: StorefrontBannersResponse = {};

  if (data.modal !== undefined && isValidStorefrontBanner(data.modal)) {
    result.modal = data.modal;
  }
  if (data.persistent !== undefined && isValidStorefrontBanner(data.persistent)) {
    result.persistent = data.persistent;
  }

  return result;
}
