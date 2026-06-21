"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function HomeManifesto() {
  const quoteRef = useScrollReveal({ threshold: 0.18 });
  const bodyRef = useScrollReveal({ threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

  return (
    <section
      className="relative overflow-hidden py-28 md:py-44 px-6"
      style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
    >
      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
        aria-hidden
      />

      {/* Corner accent lines */}
      <div className="absolute top-10 left-10 w-12 h-12 border-t border-l border-ethra-gold/20 pointer-events-none" aria-hidden />
      <div className="absolute top-10 right-10 w-12 h-12 border-t border-r border-ethra-gold/20 pointer-events-none" aria-hidden />
      <div className="absolute bottom-10 left-10 w-12 h-12 border-b border-l border-ethra-gold/20 pointer-events-none" aria-hidden />
      <div className="absolute bottom-10 right-10 w-12 h-12 border-b border-r border-ethra-gold/20 pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Top ornament */}
        <div className="flex items-center justify-center gap-5 mb-14" aria-hidden>
          <span
            className="block h-px bg-gradient-to-r from-transparent to-ethra-gold/45"
            style={{ width: "clamp(40px, 8vw, 80px)" }}
          />
          <span className="text-ethra-gold/60 text-xs">◆</span>
          <span
            className="block h-px bg-gradient-to-l from-transparent to-ethra-gold/45"
            style={{ width: "clamp(40px, 8vw, 80px)" }}
          />
        </div>

        {/* Quote */}
        <div ref={quoteRef}>
          <blockquote className="font-serif text-3xl md:text-5xl leading-tight font-light italic mb-7" style={{ color: "oklch(0.965 0.005 85)" }}>
            &ldquo;La elegancia no&nbsp;es ser notada,
            <br />
            es ser recordada.&rdquo;
          </blockquote>
          <cite className="not-italic font-display text-[9px] tracking-[0.42em] uppercase block mb-16" style={{ color: "oklch(0.66 0.105 80 / 0.65)" }}>
            — Principio Ethra
          </cite>
        </div>

        {/* Gold separator */}
        <div className="gold-line mx-auto mb-12" style={{ maxWidth: "200px" }} aria-hidden />

        {/* Body */}
        <div ref={bodyRef}>
          <p className="font-light text-base leading-loose mb-14 mx-auto" style={{ color: "oklch(0.965 0.005 85 / 0.52)", maxWidth: "480px" }}>
            Diseñamos para la mujer que no necesita elegir entre el rendimiento
            y la belleza. Cada pieza nace del entendimiento profundo del cuerpo
            femenino en movimiento.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/colecciones"
              className="group relative inline-flex items-center gap-4 overflow-hidden border px-9 py-3.5 font-display text-[9px] tracking-luxury uppercase transition-all duration-500"
              style={{
                borderColor: "oklch(0.66 0.105 80 / 0.45)",
                color: "oklch(0.66 0.105 80)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "oklch(0.66 0.105 80)";
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.10 0.004 78)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.66 0.105 80)";
              }}
            >
              Ver colecciones
            </Link>

            <Link
              href="/filosofia"
              className="font-display text-[9px] tracking-luxury uppercase transition-colors duration-300 pb-px"
              style={{
                color: "oklch(0.965 0.005 85 / 0.42)",
                borderBottom: "1px solid oklch(0.965 0.005 85 / 0.18)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.66 0.105 80 / 0.80)";
                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "oklch(0.66 0.105 80 / 0.40)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.965 0.005 85 / 0.42)";
                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "oklch(0.965 0.005 85 / 0.18)";
              }}
            >
              Nuestra filosofía
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
