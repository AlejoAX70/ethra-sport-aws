"use client";

import { Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DEFAULT_TESTIMONIALS = [
  {
    body: "La calidad es excepcional. Se siente como una segunda piel, pero con la estructura necesaria para entrenar. Una pieza de diseño.",
    author_name: "Elena M.",
  },
  {
    body: "Excelente producto, tal y como está en las fotos. La horma es perfecta y los tonos son sumamente elegantes.",
    author_name: "Gabriela V.",
  },
  {
    body: "Lo recomiendo 100%. Excelente calidad, el diseño minimalista es justo lo que buscaba para mi guardarropa activo.",
    author_name: "Stella R.",
  },
  {
    body: "Mi marca favorita por siempre. La atención al detalle y la pureza de las líneas no tienen comparación.",
    author_name: "Amanda T.",
  },
];

interface TestimonialsContent {
  title?: string;
  items?: Array<{ body: string; author_name: string; rating?: number }>;
}

interface TestimonialsProps {
  content?: TestimonialsContent;
}

export function Testimonials({ content }: TestimonialsProps) {
  const items = (content?.items ?? DEFAULT_TESTIMONIALS) as Array<{
    body: string;
    author_name: string;
    rating?: number;
  }>;
  const sectionTitle = content?.title ?? "Lo que dicen nuestras clientas";
  const headerRef = useScrollReveal({ threshold: 0.15 });
  const gridRef = useScrollReveal({ threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  return (
    <section
      className="relative overflow-hidden py-28 md:py-44 px-6"
      style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
    >
      {/* Large decorative quote mark */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 font-serif text-[18rem] leading-none select-none pointer-events-none"
        style={{ color: "oklch(0.66 0.105 80 / 0.05)" }}
        aria-hidden
      >
        &ldquo;
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 md:mb-24">
          <div className="flex items-center justify-center gap-5 mb-8" aria-hidden>
            <span
              className="block h-px"
              style={{
                width: "clamp(30px,5vw,60px)",
                background: "linear-gradient(to right, transparent, oklch(0.66 0.105 80 / 0.40))",
              }}
            />
            <span className="text-ethra-gold/50 text-xs">◆</span>
            <span
              className="block h-px"
              style={{
                width: "clamp(30px,5vw,60px)",
                background: "linear-gradient(to left, transparent, oklch(0.66 0.105 80 / 0.40))",
              }}
            />
          </div>
          <h2
            className="font-serif text-3xl md:text-5xl"
            style={{ color: "oklch(0.965 0.005 85)" }}
          >
            {sectionTitle}
          </h2>
        </div>

        {/* Testimonial cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px stagger-reveal"
          style={{ backgroundColor: "oklch(0.66 0.105 80 / 0.10)" }}
        >
          {items.map((t, i) => (
            <div
              key={i}
              className="flex flex-col p-8 md:p-10 transition-all duration-500 group"
              style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
            >
              {/* Gold top accent — appears fully on hover */}
              <div
                className="h-px mb-8 transition-all duration-600"
                style={{
                  background: "linear-gradient(to right, oklch(0.66 0.105 80 / 0.50), transparent)",
                }}
                aria-hidden
              />

              {/* Stars */}
              <div className="flex gap-1 mb-7">
                {[...Array(t.rating ?? 5)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-3 w-3"
                    style={{ fill: "oklch(0.66 0.105 80)", color: "oklch(0.66 0.105 80)" }}
                    strokeWidth={0}
                    aria-hidden
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm font-light leading-loose flex-1 italic"
                style={{ color: "oklch(0.965 0.005 85 / 0.60)" }}
              >
                &ldquo;{t.body}&rdquo;
              </p>

              {/* Gold line */}
              <div className="my-7 h-px" style={{ background: "oklch(0.66 0.105 80 / 0.18)" }} aria-hidden />

              {/* Author */}
              <p
                className="font-display text-[8px] tracking-luxury uppercase"
                style={{ color: "oklch(0.66 0.105 80 / 0.60)" }}
              >
                {t.author_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
