"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { toCdnImageUrl } from "@/lib/cdn";
import { resolveBannerHref } from "@/lib/storefront/banner-link";
import type { StorefrontBanner } from "@/lib/storefront/types";
import { useBannerVisibility } from "@/hooks/useBannerVisibility";
import { useSetBannerOffsetVar } from "@/hooks/useSetBannerOffsetVar";

export function PersistentPromoBanner({ banner }: { banner?: StorefrontBanner }) {
  const { state, isHydrated, dismissPersistent } = useBannerVisibility();
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const isVisible = Boolean(banner && isHydrated && state.dismissedPersistentBannerId !== banner?.id);
  useSetBannerOffsetVar(isVisible ? node : null);

  if (!banner || !isHydrated) return null;
  if (state.dismissedPersistentBannerId === banner.id) return null;

  const href = resolveBannerHref(banner);

  return (
    <div
      ref={setNode}
      className="fixed inset-x-0 top-0 z-[55] h-8 md:h-9 lg:h-10 bg-ethra-charcoal text-ethra-bone motion-safe:animate-in motion-safe:slide-in-from-top motion-safe:fade-in duration-200"
    >
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center px-10">
        <Link href={href} className="flex h-full items-center gap-2" aria-label={banner.altText}>
          <Image
            src={toCdnImageUrl(banner.imageUrl)}
            alt=""
            width={120}
            height={28}
            className="h-5 md:h-6 w-auto object-contain"
          />
        </Link>
        <button
          type="button"
          onClick={() => dismissPersistent(banner.id)}
          aria-label="Cerrar banner"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
