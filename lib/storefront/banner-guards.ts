import type {
  StorefrontBannersResponse,
  StorefrontModalBanner,
  StorefrontPersistentBanner,
} from "./types";

/** Debe coincidir con BANNER_MESSAGE_MAX_LENGTH del backend (inventario_back/src/banners/banner.constants.ts). */
const BANNER_MESSAGE_MAX_LENGTH = 120;

function hasValidLinkTarget(b: Record<string, unknown>): boolean {
  if (b.linkType === "PRODUCT") return typeof b.productId === "string" && !!b.productId;
  if (b.linkType === "CATEGORY") return typeof b.categoryId === "string" && !!b.categoryId;
  return false;
}

export function isValidStorefrontModalBanner(x: unknown): x is StorefrontModalBanner {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  if (typeof b.id !== "string" || !b.id) return false;
  if (b.bannerType !== "MODAL") return false;
  if (typeof b.imageUrl !== "string" || !b.imageUrl) return false;
  if (typeof b.altText !== "string" || !b.altText) return false;
  return hasValidLinkTarget(b);
}

export function isValidStorefrontPersistentBanner(x: unknown): x is StorefrontPersistentBanner {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  if (typeof b.id !== "string" || !b.id) return false;
  if (typeof b.message !== "string") return false;
  const message = b.message.trim();
  if (!message || message.length > BANNER_MESSAGE_MAX_LENGTH) return false;
  return hasValidLinkTarget(b);
}

export function parseStorefrontBannersResponse(raw: unknown): StorefrontBannersResponse {
  if (!raw || typeof raw !== "object") return {};
  const data = raw as Record<string, unknown>;
  const result: StorefrontBannersResponse = {};

  if (data.modal !== undefined && isValidStorefrontModalBanner(data.modal)) {
    result.modal = data.modal;
  }

  if (Array.isArray(data.persistent)) {
    // Un mensaje corrupto/mal formado se descarta individualmente — no
    // invalida el resto de mensajes persistentes activos.
    const persistent = data.persistent.filter(isValidStorefrontPersistentBanner);
    if (persistent.length > 0) result.persistent = persistent;
  }

  return result;
}
