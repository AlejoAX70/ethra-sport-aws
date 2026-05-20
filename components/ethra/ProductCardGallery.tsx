"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_CHANGE_MS = 300;
const CYCLE_MS = 900;
const FADE_MS = 500;

interface ProductCardGalleryProps {
  urls: string[];
  alt: string;
  variant?: "default" | "catalog";
  showCta?: boolean;
  priority?: boolean;
}

export function ProductCardGallery({
  urls,
  alt,
  variant = "default",
  showCta = true,
  priority = false,
}: ProductCardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearCycle = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    urls.slice(1).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);

  const handleMouseEnter = useCallback(() => {
    if (urls.length <= 1) return;

    setIsHovering(true);
    clearCycle();

    timeoutRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % urls.length);
      intervalRef.current = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % urls.length);
      }, CYCLE_MS);
    }, INITIAL_CHANGE_MS);
  }, [clearCycle, urls.length]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    clearCycle();
    setActiveIndex(0);
  }, [clearCycle]);

  useEffect(() => clearCycle, [clearCycle]);

  const isCatalog = variant === "catalog";
  const hoverScale = isCatalog ? "scale-[1.02]" : "scale-[1.04]";

  return (
    <div
      className={`relative overflow-hidden ${
        isCatalog ? "aspect-[4/5] bg-[#f3f3f3]" : "aspect-[4/5] bg-ethra-cream"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {urls.map((url, index) => (
        <img
          key={url}
          src={url}
          alt={alt}
          loading={priority && index === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full transition-[opacity,transform,filter] ease-in-out ${
            isCatalog ? "object-contain p-8 md:p-10" : "object-cover"
          } ${index === activeIndex ? "opacity-100" : "opacity-0"} ${
            isHovering ? `${hoverScale} brightness-95` : "scale-100 brightness-100"
          }`}
          style={{ transitionDuration: `${FADE_MS}ms, 800ms, 400ms` }}
        />
      ))}

      {!isCatalog ? (
        <div
          className={`absolute inset-0 bg-ethra-black/0 transition-colors duration-500 ${
            isHovering ? "bg-ethra-black/10" : ""
          }`}
        />
      ) : null}

      {showCta ? (
        <div
          className={`absolute inset-x-0 bottom-0 flex justify-center pb-6 transition-all duration-500 ${
            isHovering ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span className="bg-ethra-bone px-8 py-3 font-display text-[10px] tracking-luxury uppercase text-ethra-black shadow-sm transition-colors duration-300 hover:bg-ethra-black hover:text-ethra-bone">
            Ver pieza
          </span>
        </div>
      ) : null}
    </div>
  );
}
