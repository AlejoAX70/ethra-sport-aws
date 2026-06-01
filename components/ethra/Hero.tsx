"use client";

import { useEffect, useRef } from "react";
import { IMAGE_CDN_BASE } from "@/lib/cdn";

const HERO_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/productos/26392545-8d5a-4d60-8c2a-343c92cc5f90/tercera.webp`;

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
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
      if (title) { title.style.opacity = "1"; title.style.transform = "translateY(0)"; }
    }, 300);
    setTimeout(() => {
      if (subtitle) { subtitle.style.opacity = "1"; subtitle.style.transform = "translateY(0)"; }
    }, 700);
  }, []);

  return (
    <section className="relative h-screen min-h-[720px] w-full overflow-hidden">
      <img
        ref={imgRef}
        src={HERO_IMAGE}
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
          <span className="block text-[18vw] md:text-[12rem] tracking-tight">ETHRA</span>
          <span className="block italic font-normal -mt-4 md:-mt-10 text-[10vw] md:text-7xl">sport</span>
        </h1>
        <p
          ref={subtitleRef}
          className="mt-16 md:mt-24 font-display text-[11px] tracking-luxury uppercase text-ethra-bone/85 transition-all duration-[1000ms] ease-out"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          Pureza en movimiento
        </p>
      </div>
    </section>
  );
}
