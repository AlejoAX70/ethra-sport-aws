"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StorefrontCategory } from "@/lib/storefront/types";
import { toCdnImageUrl } from "@/lib/cdn";

const AUTOPLAY_INTERVAL_MS = 5000;
const AUTOPLAY_PAUSE_MS = 10_000;

function useCategoryCarouselAutoplay(slideCount: number, emblaApi: ReturnType<typeof useEmblaCarousel>[1]) {
  const pauseUntilRef = useRef(0);

  const pauseAutoplay = useCallback(() => {
    pauseUntilRef.current = Date.now() + AUTOPLAY_PAUSE_MS;
  }, []);

  useEffect(() => {
    if (!emblaApi || slideCount <= 1) return;

    const tick = () => {
      if (Date.now() < pauseUntilRef.current) return;
      emblaApi.scrollNext();
    };

    const intervalId = window.setInterval(tick, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [emblaApi, slideCount]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("pointerDown", pauseAutoplay);
    return () => {
      emblaApi.off("pointerDown", pauseAutoplay);
    };
  }, [emblaApi, pauseAutoplay]);

  return { pauseAutoplay };
}

interface CategoryGridProps {
  categories: StorefrontCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    duration: 45,
    slidesToScroll: 1,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const { pauseAutoplay } = useCategoryCarouselAutoplay(categories.length, emblaApi);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="colecciones" className="bg-ethra-bone pt-16 md:pt-24 pb-0">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <h2 className="font-serif text-4xl md:text-5xl text-ethra-black">Colecciones</h2>
          <Link
            href="/colecciones"
            className="font-display text-[11px] tracking-luxury uppercase text-ethra-charcoal border-b border-ethra-charcoal pb-1 hover:text-ethra-gold hover:border-ethra-gold transition-colors"
          >
            Ver todo
          </Link>
        </div>
        <div className="relative w-full" role="region" aria-roledescription="carousel">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-2 md:-ml-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  role="group"
                  aria-roledescription="slide"
                  className="min-w-0 shrink-0 grow-0 basis-[85%] pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3"
                >
                  <Link
                    href={`/colecciones/${cat.id}`}
                    className="group relative block aspect-[4/5] overflow-hidden"
                  >
                    <img
                      src={toCdnImageUrl(cat.imageUrl)}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <h3 className="font-serif text-3xl md:text-4xl text-ethra-bone">{cat.name}</h3>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-display text-[10px] tracking-luxury uppercase text-ethra-bone/90">
                          Ver colección
                        </span>
                        <span className="h-px w-8 bg-ethra-gold-light transition-all duration-500 group-hover:w-14" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {categories.length > 1 && (
            <>
              <button
                type="button"
                className="inline-flex items-center justify-center border shadow-sm absolute z-20 left-2 md:left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-none border-ethra-charcoal/30 bg-ethra-bone/90 text-ethra-charcoal hover:bg-ethra-black hover:text-ethra-bone hover:border-ethra-black disabled:opacity-50 disabled:pointer-events-none"
                disabled={!canPrev}
                onPointerDown={pauseAutoplay}
                onClick={() => emblaApi?.scrollPrev()}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                <span className="sr-only">Previous slide</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center border shadow-sm absolute z-20 right-2 md:right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-none border-ethra-charcoal/30 bg-ethra-bone/90 text-ethra-charcoal hover:bg-ethra-black hover:text-ethra-bone hover:border-ethra-black disabled:opacity-50 disabled:pointer-events-none"
                disabled={!canNext}
                onPointerDown={pauseAutoplay}
                onClick={() => emblaApi?.scrollNext()}
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
                <span className="sr-only">Next slide</span>
              </button>
            </>
          )}
        </div>
        {categories.length > 3 && (
          <p className="mt-4 mb-0 text-center font-display text-[10px] tracking-luxury uppercase text-ethra-stone">
            Desliza para ver más colecciones
          </p>
        )}
      </div>
    </section>
  );
}
