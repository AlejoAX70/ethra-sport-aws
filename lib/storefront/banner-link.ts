interface BannerLinkTarget {
  linkType: "PRODUCT" | "CATEGORY";
  productId?: string;
  categoryId?: string;
}

export function resolveBannerHref(banner: BannerLinkTarget): string {
  if (banner.linkType === "PRODUCT" && banner.productId) {
    return `/producto/${banner.productId}`;
  }
  if (banner.linkType === "CATEGORY" && banner.categoryId) {
    return `/colecciones/${banner.categoryId}`;
  }
  return "/";
}
