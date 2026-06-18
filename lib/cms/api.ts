import { cmsFetch } from "./client";
import type { CmsConfigResponse, CmsMenuResponse, CmsPageResponse } from "./types";

export function getCmsPage(slug: string) {
  return cmsFetch<CmsPageResponse>(`/pages/${slug}`);
}

export function getCmsConfig() {
  return cmsFetch<CmsConfigResponse>("/config");
}

export function getCmsMenu(menuKey: string) {
  return cmsFetch<CmsMenuResponse>(`/menus/${menuKey}`);
}
