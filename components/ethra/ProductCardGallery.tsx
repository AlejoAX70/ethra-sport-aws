"use client";

import { useState, useCallback, useRef } from "react";

interface ProductCardGalleryProps {
  images: string[];
  alt: string;
  priority?: boolean;
}

export function ProductCardGallery({ images, alt, priority = false }: ProductCardGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = useCallback(() => {
    if (images.length <= 1) return;
    setIsHovering(true);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 1200);
  }, [images.length]);

  const stopCycle = useCallback(() => {
    setIsHovering(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIndex(0);
  }, []);

  return (
    <div
      className="relative overflow-hidden aspect-[4/5] bg-ethra-cream"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading={priority && i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full transition-[opacity,transform,filter] ease-in-out object-cover ${
            i === activeIndex ? "opacity-100 scale-100 brightness-100" : "opacity-0 scale-100 brightness-100"
          }`}
          style={{ transitionDuration: "500ms, 800ms, 400ms" }}
        />
      ))}
      <div className={`absolute inset-0 bg-ethra-black/0 transition-colors duration-500 ${isHovering ? "bg-ethra-black/5" : ""}`} />
      <div className={`absolute inset-x-0 bottom-0 flex justify-center pb-6 transition-all duration-500 ${isHovering ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
        <span className="bg-ethra-bone px-8 py-3 font-display text-[10px] tracking-luxury uppercase text-ethra-black shadow-sm transition-colors duration-300 hover:bg-ethra-black hover:text-ethra-bone">
          Ver pieza
        </span>
      </div>
    </div>
  );
}
