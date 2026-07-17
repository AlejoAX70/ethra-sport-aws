"use client";

import { useContext } from "react";
import { BannerVisibilityContext } from "@/store/banner-visibility";

export function useBannerVisibility() {
  const ctx = useContext(BannerVisibilityContext);
  if (!ctx) {
    throw new Error("useBannerVisibility must be used within BannerVisibilityProvider");
  }
  return ctx;
}
