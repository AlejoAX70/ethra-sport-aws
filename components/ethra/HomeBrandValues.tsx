"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const VALUES = [
  {
    numeral: "I",
    title: "Calidad sin compromiso",
    body: "Seleccionamos cada tejido con la precisión de quien entiende que la calidad no se ve: se siente desde el primer contacto con la piel.",
  },
  {
    numeral: "II",
    title: "Diseño editorial",
    body: "Nuestras líneas son dictadas por la belleza de la forma femenina. Cada costura es intencional, cada silueta es una declaración.",
  },
  {
    numeral: "III",
    title: "Movimiento consciente",
    body: "Desarrollamos prendas que acompañan cada gesto, cada postura, cada ritmo. La ropa que desaparece para que solo existas tú.",
  },
];

export function HomeBrandValues() {
  const headerRef = useScrollReveal({ threshold: 0.15 });
  const gridRef = useScrollReveal({ threshold: 0.08 });

  return (
    <section
      className="py-28 md:py-44 px-6"
      style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <div ref={headerRef} className="mb-20 md:mb-28 text-center">
          <span
            className="font-display text-[8px] tracking-[0.44em] uppercase block mb-5"
            style={{ color: "oklch(0.66 0.105 80 / 0.60)" }}
          >
            Nuestros principios
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl"
            style={{ color: "oklch(0.965 0.005 85)" }}
          >
            La filosofía Ethra
          </h2>
        </div>

        {/* Values grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8 lg:gap-20 stagger-reveal"
        >
          {VALUES.map((value) => (
            <div key={value.numeral} className="group">
              {/* Gold top line — expands on hover */}
              <div
                className="h-px mb-10 transition-all duration-700"
                style={{
                  background:
                    "linear-gradient(to right, oklch(0.66 0.105 80 / 0.55), oklch(0.66 0.105 80 / 0.10), transparent)",
                }}
                aria-hidden
              />

              {/* Roman numeral */}
              <span
                className="font-display text-[9px] tracking-luxury uppercase block mb-7"
                style={{ color: "oklch(0.66 0.105 80 / 0.55)" }}
              >
                {value.numeral}
              </span>

              {/* Title */}
              <h3
                className="font-serif text-2xl md:text-[1.7rem] leading-snug mb-6"
                style={{ color: "oklch(0.965 0.005 85)" }}
              >
                {value.title}
              </h3>

              {/* Body */}
              <p
                className="font-light text-sm leading-relaxed"
                style={{ color: "oklch(0.965 0.005 85 / 0.42)" }}
              >
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
