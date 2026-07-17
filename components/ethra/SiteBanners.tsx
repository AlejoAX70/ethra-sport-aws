"use client";

import { useQuery } from "@tanstack/react-query";
import { bannersQueryOptions } from "@/lib/storefront/queries";
import { PersistentPromoBanner } from "./PersistentPromoBanner";
import { PromoModalBanner } from "./PromoModalBanner";

export function SiteBanners() {
  const { data } = useQuery(bannersQueryOptions());

  return (
    <>
      <PersistentPromoBanner banner={data?.persistent} />
      <PromoModalBanner banner={data?.modal} />
    </>
  );
}
