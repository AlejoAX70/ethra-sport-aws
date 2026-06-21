"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IMAGE_CDN_BASE } from "@/lib/cdn";

const EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/productos/26392545-8d5a-4d60-8c2a-343c92cc5f90/tercera.webp`;

export function HomeEditorial() {
  const textRef = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
    >
      <div className="flex flex-col md:flex-row min-h-[90vh] md:min-h-[85vh]">
        {/* Image side */}
        <div className="relative w-full md:w-[52%] min-h-[55vw] md:min-h-0 overflow-hidden">
          <img
            src={EDITORIAL_IMAGE}
            alt="Ethra Sport — Editorial"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.04]"
          />
          {/* Gradient that merges image into dark panel on desktop */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(to right, transparent 55%, oklch(0.10 0.004 78) 100%)",
            }}
            aria-hidden
          />
          {/* Gradient at bottom on mobile */}
          <div
            className="absolute inset-0 block md:hidden"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, oklch(0.10 0.004 78) 100%)",
            }}
            aria-hidden
          />
        </div>

        {/* Text panel */}
        <div
          ref={textRef}
          className="w-full md:w-[48%] flex flex-col justify-center px-8 md:px-14 lg:px-20 py-16 md:py-0"
        >
          {/* Act label */}
          <div className="flex items-center gap-4 mb-10">
            <span className="block h-px w-8" style={{ backgroundColor: "oklch(0.66 0.105 80 / 0.45)" }} />
            <span
              className="font-display text-[8px] tracking-[0.44em] uppercase"
              style={{ color: "oklch(0.66 0.105 80 / 0.65)" }}
            >
              Acto I
            </span>
          </div>

          {/* Heading */}
          <h2
            className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] leading-tight mb-8"
            style={{ color: "oklch(0.965 0.005 85)" }}
          >
            Donde el deporte
            <br />
            <span
              className="italic font-light"
              style={{ color: "oklch(0.78 0.085 80 / 0.82)" }}
            >
              encuentra el arte
            </span>
          </h2>

          {/* Body */}
          <p
            className="font-light text-sm leading-loose mb-12 max-w-sm"
            style={{ color: "oklch(0.965 0.005 85 / 0.48)" }}
          >
            Cada colección es el resultado de un proceso creativo donde la
            funcionalidad técnica se funde con una estética editorial rigurosa.
            No hacemos ropa deportiva. Creamos piezas que trascienden el
            movimiento.
          </p>

          {/* Gold rule */}
          <div
            className="h-px w-16 mb-10"
            style={{ backgroundColor: "oklch(0.66 0.105 80 / 0.35)" }}
            aria-hidden
          />

          {/* CTA text link */}
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-4 font-display text-[9px] tracking-luxury uppercase transition-colors duration-300 w-fit"
            style={{ color: "oklch(0.965 0.005 85 / 0.55)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.66 0.105 80)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.965 0.005 85 / 0.55)";
            }}
          >
            Ver catálogo completo
            <span
              className="block h-px transition-all duration-500 ease-out group-hover:w-16"
              style={{
                width: "2rem",
                backgroundColor: "oklch(0.66 0.105 80 / 0.50)",
              }}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
