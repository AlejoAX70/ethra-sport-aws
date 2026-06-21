"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StorefrontCategory } from "@/lib/storefront/types";
import { toCdnImageUrl } from "@/lib/cdn";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AUTOPLAY_INTERVAL_MS = 5000;
const AUTOPLAY_PAUSE_MS = 10_000;

function useCategoryCarouselAutoplay(
  slideCount: number,
  emblaApi: ReturnType<typeof useEmblaCarousel>[1]
) {
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
    const id = window.setInterval(tick, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, slideCount]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("pointerDown", pauseAutoplay);
    return () => { emblaApi.off("pointerDown", pauseAutoplay); };
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
  const headerRef = useScrollReveal({ threshold: 0.15 });

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
    <section className="bg-ethra-bone pt-20 md:pt-32 pb-4">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Section header */}
        <div ref={headerRef} className="mb-12 md:mb-16 flex items-end justify-between">
          <div className="flex items-center gap-5">
            {/* Gold vertical accent */}
            <span className="block w-px h-10 bg-ethra-gold/60 flex-shrink-0" aria-hidden />
            <div>
              <p className="font-display text-[8px] tracking-luxury uppercase text-ethra-stone mb-2">
                Ethra Sport
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-ethra-black leading-none">
                Colecciones
              </h2>
            </div>
          </div>

          <Link
            href="/colecciones"
            className="hidden md:inline-flex items-center gap-3 font-display text-[9px] tracking-luxury uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors duration-300 group"
          >
            Ver todo
            <span className="block h-px w-5 bg-ethra-charcoal/50 transition-all duration-400 group-hover:w-9 group-hover:bg-ethra-gold/60" aria-hidden />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative w-full" role="region" aria-roledescription="carousel" aria-label="Colecciones">
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
                    {/* Image */}
                    <img
                      src={toCdnImageUrl(cat.imageUrl)}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                    />

                    {/* Overlay layers */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    {/* Gold border reveal on hover */}
                    <div
                      className="absolute inset-0 border border-ethra-gold/0 transition-all duration-500 group-hover:border-ethra-gold/40"
                      aria-hidden
                    />
                    {/* Inner gold frame accent (top-left corner) */}
                    <div
                      className="absolute top-4 left-4 w-8 h-8 border-t border-l border-ethra-gold/0 transition-all duration-500 group-hover:border-ethra-gold/60"
                      aria-hidden
                    />
                    <div
                      className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-ethra-gold/0 transition-all duration-500 group-hover:border-ethra-gold/60"
                      aria-hidden
                    />

                    {/* Text */}
                    <div className="absolute bottom-0 left-0 p-7 md:p-8">
                      <h3 className="font-serif text-3xl md:text-4xl text-ethra-bone mb-4 leading-tight">
                        {cat.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-[9px] tracking-luxury uppercase text-ethra-bone/80">
                          Ver colección
                        </span>
                        <span
                          className="h-px bg-ethra-gold-light/70 transition-all duration-500 group-hover:w-12"
                          style={{ width: "2rem" }}
                          aria-hidden
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows — styled with gold */}
          {categories.length > 1 && (
            <>
              <button
                type="button"
                className="inline-flex items-center justify-center absolute z-20 left-2 md:left-4 top-1/2 h-11 w-11 -translate-y-1/2 border border-ethra-charcoal/25 bg-ethra-bone/90 text-ethra-charcoal transition-all duration-300 hover:bg-ethra-black hover:text-ethra-bone hover:border-ethra-black disabled:opacity-40 disabled:pointer-events-none backdrop-blur-sm"
                disabled={!canPrev}
                onPointerDown={pauseAutoplay}
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Colección anterior"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center absolute z-20 right-2 md:right-4 top-1/2 h-11 w-11 -translate-y-1/2 border border-ethra-charcoal/25 bg-ethra-bone/90 text-ethra-charcoal transition-all duration-300 hover:bg-ethra-black hover:text-ethra-bone hover:border-ethra-black disabled:opacity-40 disabled:pointer-events-none backdrop-blur-sm"
                disabled={!canNext}
                onPointerDown={pauseAutoplay}
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Siguiente colección"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </>
          )}
        </div>

        {/* Swipe hint on mobile */}
        {categories.length > 2 && (
          <p className="mt-5 mb-0 text-center font-display text-[8px] tracking-luxury uppercase text-ethra-stone/60">
            Desliza para explorar
          </p>
        )}

        {/* Mobile "ver todo" */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/colecciones"
            className="inline-flex items-center gap-3 font-display text-[9px] tracking-luxury uppercase text-ethra-charcoal hover:text-ethra-gold transition-colors duration-300 group"
          >
            Ver todas las colecciones
            <span className="block h-px w-5 bg-ethra-charcoal/50 group-hover:w-9 group-hover:bg-ethra-gold/60 transition-all duration-400" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
