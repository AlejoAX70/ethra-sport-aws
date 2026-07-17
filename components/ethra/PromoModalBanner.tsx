"use client";

import { useRef } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toCdnImageUrl } from "@/lib/cdn";
import { resolveBannerHref } from "@/lib/storefront/banner-link";
import type { StorefrontBanner } from "@/lib/storefront/types";
import { useBannerVisibility } from "@/hooks/useBannerVisibility";

export function PromoModalBanner({ banner }: { banner?: StorefrontBanner }) {
  const { state, isHydrated, dismissModal } = useBannerVisibility();
  const closeRef = useRef<HTMLButtonElement>(null);

  if (!banner || !isHydrated) return null;
  if (state.dismissedModalBannerId === banner.id) return null;

  const href = resolveBannerHref(banner);

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) dismissModal(banner.id);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-ethra-black/50 backdrop-blur-[2px] motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out duration-200" />
        <Dialog.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            closeRef.current?.focus();
          }}
          className="fixed z-[71] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out motion-safe:data-[state=closed]:zoom-out-95 duration-250 ease-out"
        >
          <Dialog.Title className="sr-only">Banner promocional</Dialog.Title>
          {/* Sin aspect-ratio fijo: el tamaño lo define la imagen misma (w-fit),
              acotado a lo sumo al 80% del viewport en cada eje. */}
          <div className="relative w-fit overflow-hidden rounded-sm bg-ethra-cream">
            <Link href={href} className="block" aria-label={banner.altText}>
              {/* eslint-disable-next-line @next/next/no-img-element -- tamaño intrínseco desconocido de antemano (lo define el admin al subir la imagen); next/image exige width/height o un contenedor ya dimensionado. */}
              <img
                src={toCdnImageUrl(banner.imageUrl)}
                alt={banner.altText}
                className="block max-h-[80vh] max-w-[80vw]"
              />
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissModal(banner.id);
              }}
              aria-label="Cerrar banner promocional"
              className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ethra-black/40 text-white backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
