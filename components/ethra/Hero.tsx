"use client";

import { useEffect, useRef } from "react";
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
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const bgImage = content?.background_image_url ?? DEFAULT_HERO_IMAGE;
  const title = content?.title ?? "ETHRA";
  const subtitle = content?.subtitle ?? "Pureza en movimiento";
  const titleParts = title.includes("\n") ? title.split("\n") : [title, "sport"];

  useEffect(() => {
    const img = imgRef.current;
    const titleEl = titleRef.current;
    const subtitleEl = subtitleRef.current;
    if (img) {
      img.onload = () => {
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
      };
      if (img.complete) {
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
      }
    }
    setTimeout(() => {
      if (titleEl) { titleEl.style.opacity = "1"; titleEl.style.transform = "translateY(0)"; }
    }, 300);
    setTimeout(() => {
      if (subtitleEl) { subtitleEl.style.opacity = "1"; subtitleEl.style.transform = "translateY(0)"; }
    }, 700);
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden">
      <img
        ref={imgRef}
        src={bgImage}
        alt="Ethra Sport"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out"
        style={{ opacity: 0, transform: "scale(1.08)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          className="font-serif text-ethra-bone leading-none drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] transition-all duration-[1200ms] ease-out"
          style={{ opacity: 0, transform: "translateY(24px)" }}
        >
          <span className="block text-[18vw] md:text-[12rem] tracking-tight">{titleParts[0]}</span>
          {titleParts[1] && (
            <span className="block italic font-normal -mt-4 md:-mt-10 text-[10vw] md:text-7xl">{titleParts[1]}</span>
          )}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-16 md:mt-24 font-display text-[11px] tracking-luxury uppercase text-ethra-bone/85 transition-all duration-[1000ms] ease-out"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
