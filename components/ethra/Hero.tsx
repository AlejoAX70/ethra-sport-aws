"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { IMAGE_CDN_BASE } from "@/lib/cdn";

const DEFAULT_HERO_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/productos/26392545-8d5a-4d60-8c2a-343c92cc5f90/tercera.webp`;

interface HeroContent {
  background_image_url?: string;
  title?: string;
  subtitle?: string;
}

interface HeroProps {
  content?: HeroContent;
}

export function Hero({ content }: HeroProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const bgImage = content?.background_image_url ?? DEFAULT_HERO_IMAGE;
  const title = content?.title?.split("\n")[0] ?? "ETHRA";
  const subtitle = content?.subtitle ?? "Pureza en movimiento";

  useEffect(() => {
    const img = imgRef.current;
    const titleEl = titleRef.current;
    const ornamentEl = ornamentRef.current;
    const ctaEl = ctaRef.current;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealImg = () => {
      if (!img) return;
      img.style.opacity = "1";
      img.style.transform = "scale(1)";
    };

    if (img) {
      if (prefersReducedMotion) {
        revealImg();
      } else {
        img.onload = revealImg;
        if (img.complete) revealImg();
      }
    }

    if (prefersReducedMotion) {
      [titleEl, ornamentEl, ctaEl].forEach((el) => {
        if (el) { el.style.opacity = "1"; el.style.transform = "none"; }
      });
      return;
    }

    const show = (el: HTMLElement | null, delay: number) => {
      setTimeout(() => {
        if (!el) return;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    };

    show(titleEl, 280);
    show(ornamentEl, 680);
    show(ctaEl, 980);
  }, []);

  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden">
      {/* Background image — scales in on load */}
      <img
        ref={imgRef}
        src={bgImage}
        alt="Ethra Sport"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms] ease-out"
        style={{ opacity: 0, transform: "scale(1.09)" }}
      />

      {/* Deep dark overlays for black + gold aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/78 via-black/30 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

      {/* Top-left brand badge */}
      <div
        className="absolute top-24 left-8 md:left-14 z-10 flex items-center gap-3"
        aria-hidden
      >
        <span className="block h-px w-7 bg-ethra-gold/50" />
        <span className="font-display text-[8px] tracking-[0.45em] uppercase text-ethra-gold/70">
          Est. 2025
        </span>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Primary title */}
        <h1
          ref={titleRef}
          className="font-serif leading-none text-ethra-bone transition-all duration-[1400ms] ease-out"
          style={{ opacity: 0, transform: "translateY(32px)" }}
        >
          <span className="block text-[22vw] md:text-[13rem] tracking-tight drop-shadow-[0_4px_40px_rgba(0,0,0,0.65)]">
            {title}
          </span>
          <span className="block italic font-normal -mt-6 md:-mt-14 text-[9vw] md:text-[5.5rem]" style={{ color: "oklch(0.78 0.085 80 / 0.88)" }}>
            sport
          </span>
        </h1>

        {/* Ornament + subtitle + CTA */}
        <div
          ref={ornamentRef}
          className="mt-12 md:mt-18 flex flex-col items-center gap-6 transition-all duration-[1100ms] ease-out"
          style={{ opacity: 0, transform: "translateY(22px)" }}
        >
          {/* Diamond ornament with expanding lines */}
          <div className="flex items-center gap-5" aria-hidden>
            <span
              className="block h-px bg-gradient-to-r from-transparent to-ethra-gold/60"
              style={{ width: "clamp(40px, 6vw, 80px)" }}
            />
            <span className="text-ethra-gold/75 text-[10px]">◆</span>
            <span
              className="block h-px bg-gradient-to-l from-transparent to-ethra-gold/60"
              style={{ width: "clamp(40px, 6vw, 80px)" }}
            />
          </div>

          <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-bone/75">
            {subtitle}
          </p>
        </div>

        {/* CTA button */}
        <div
          ref={ctaRef}
          className="mt-10 md:mt-14 transition-all duration-[900ms] ease-out"
          style={{ opacity: 0, transform: "translateY(18px)" }}
        >
          <Link
            href="/catalogo"
            className="group relative inline-flex items-center gap-5 overflow-hidden border border-ethra-gold/35 px-10 py-4 font-display text-[9px] tracking-luxury uppercase text-ethra-bone/85 transition-colors duration-500 hover:text-white gold-shimmer-cta"
          >
            {/* Sliding gold fill */}
            <span
              className="absolute inset-0 -translate-x-full bg-ethra-gold/15 transition-transform duration-500 ease-out group-hover:translate-x-0"
              aria-hidden
            />
            <span className="relative">Explorar la colección</span>
            <span
              className="relative block h-px w-6 bg-ethra-gold/60 transition-all duration-500 group-hover:w-12 group-hover:bg-ethra-gold"
              aria-hidden
            />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 scroll-indicator"
        aria-hidden
      >
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-ethra-gold/50 to-transparent" />
        <div className="h-1.5 w-1.5 rounded-full bg-ethra-gold/55" />
      </div>
    </section>
  );
}
