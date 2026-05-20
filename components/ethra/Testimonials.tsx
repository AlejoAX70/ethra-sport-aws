"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { text: "La calidad es excepcional. Se siente como una segunda piel, pero con la estructura necesaria para entrenar. Una pieza de diseño.", author: "Elena M." },
  { text: "Excelente producto, tal y como está en las fotos. La horma es perfecta y los tonos son sumamente elegantes.", author: "Gabriela V." },
  { text: "Lo recomiendo 100%. Excelente calidad, el diseño minimalista es justo lo que buscaba para mi guardarropa activo.", author: "Stella R." },
  { text: "Mi marca favorita por siempre. La atención al detalle y la pureza de las líneas no tienen comparación.", author: "Amanda T." },
];

export function Testimonials() {
  return (
    <section className="bg-ethra-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <h2 className="text-center font-serif text-3xl md:text-4xl text-ethra-black mb-16">
          Lo que dicen nuestras clientas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card p-8 flex flex-col h-full">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-ethra-black text-ethra-black" strokeWidth={0} aria-hidden />
                ))}
              </div>
              <p className="text-sm text-ethra-charcoal leading-relaxed flex-1 italic">
                &quot;{t.text}&quot;
              </p>
              <div className="gold-line my-6" />
              <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
