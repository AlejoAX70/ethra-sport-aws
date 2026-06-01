"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { IMAGE_CDN_BASE } from "@/lib/cdn";

const HERO_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/9ed8075b-3d9e-46e1-b98d-df16b24c54c9.webp`;
const FIRST_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/b7e21df6-bffb-438a-a3e9-47ba94b153d3.webp`;
const SECOND_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/17932048-7275-479b-bf66-a148fbecc09f.webp`;
const THIRD_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/ffea1b44-d722-4133-be87-9bb05314f514.webp`;
const FOURTH_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/1eab8f85-4b19-4891-ae6e-c2a800f5207a.webp`;
const FIFTH_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/2fce6444-b41d-4b26-9274-e6889219591b.webp`;
const SIXTH_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/10c7f9d3-0b5b-4510-9411-72354c458e1a.webp`;
const SEVENTH_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/bf9f720c-ca46-4d62-8c24-7ff59136b97a.webp`;
const EIGHTH_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/5c697846-2974-4f7e-b11f-355f9b849a96.webp`;
const NINTH_EDITORIAL_IMAGE = `${IMAGE_CDN_BASE}/proveedores/4c39cb9b-109b-4000-93d1-08ecd15073b0/temporales/963052a5-a2c2-4df0-a059-fe68e7ada6e9.webp`;

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
} as const;

function PhilosophyText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div {...fadeUp} className={`mx-auto max-w-2xl px-6 text-center md:px-10 ${className}`}>
      <div className="space-y-6 text-[15px] leading-[1.9] text-ethra-charcoal md:text-base">{children}</div>
    </motion.div>
  );
}

function EditorialImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <motion.div {...fadeUp} className={`overflow-hidden bg-ethra-cream ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </motion.div>
  );
}

export function FilosofiaContent() {
  return (
    <>
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        <img src={HERO_IMAGE} alt="Mujer en movimiento con piezas Ethra Sport" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/70" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:px-10 md:pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-[1400px] text-center md:text-left">
            <p className="font-display text-[10px] tracking-[0.28em] uppercase text-ethra-bone/80">Mundo Ethra</p>
            <h1 className="mt-4 font-serif text-3xl leading-tight text-ethra-bone md:text-5xl lg:text-6xl">
              Donde el movimiento<span className="block italic font-normal">se vuelve refugio</span>
            </h1>
            <p className="mt-5 max-w-xl font-display text-[11px] tracking-[0.18em] uppercase text-ethra-bone/75 md:text-xs">Diseñado para mujeres que eligen sentir, no solo vestir</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-ethra-bone py-20 md:py-28">
        <PhilosophyText>
          <p>Ethra Sport nace de una convicción simple y profunda: el cuerpo de una mujer no necesita adornos que la limiten, sino piezas que la acompañen con respeto, suavidad y fuerza.</p>
          <p>Cada prenda es un gesto de cuidado. Un espacio donde la piel respira, la silueta se honra y el movimiento recupera su lugar como ritual cotidiano — no como exigencia.</p>
        </PhilosophyText>
      </section>

      <section className="bg-ethra-bone pb-20 md:pb-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2 px-3 md:grid-cols-2 md:px-6 lg:px-10">
          <EditorialImage src={FIRST_EDITORIAL_IMAGE} alt="Texturas y esencia de la marca Ethra" className="min-h-[520px] md:row-span-2 md:min-h-[760px]" />
          <EditorialImage src={SECOND_EDITORIAL_IMAGE} alt="Ritual de movimiento consciente" className="min-h-[280px] md:min-h-[374px]" />
          <EditorialImage src={THIRD_EDITORIAL_IMAGE} alt="Arquitectura del cuerpo en movimiento" className="min-h-[280px] md:min-h-[374px]" />
        </div>
      </section>

      <section className="bg-ethra-bone py-20 md:py-28">
        <PhilosophyText>
          <p>En nuestro universo, la moda deportiva deja de ser uniforme para convertirse en expresión. Tejidos que abrazan sin apretar. Cortes que siguen tu respiración. Colores que evocan calma, tierra y luz — porque sentirte bien también es una forma de elegancia.</p>
          <p>Creemos en la mujer que se mueve a su ritmo: la que entrena, camina, descansa y vuelve a empezar. La que no busca perfección, sino presencia.</p>
        </PhilosophyText>
      </section>

      <section className="bg-ethra-bone pb-20 md:pb-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2 px-3 md:grid-cols-2 md:px-6 lg:px-10">
          <EditorialImage src={FOURTH_EDITORIAL_IMAGE} alt="Detalle artesanal de confección" className="min-h-[420px]" />
          <EditorialImage src={FIFTH_EDITORIAL_IMAGE} alt="Movimiento y libertad" className="min-h-[420px]" />
        </div>
      </section>

      <section className="relative min-h-[520px] overflow-hidden md:min-h-[640px]">
        <img src={SIXTH_EDITORIAL_IMAGE} alt="Comunidad Ethra en movimiento" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex min-h-[520px] items-end px-6 pb-14 md:min-h-[640px] md:px-10 md:pb-20">
          <motion.div {...fadeUp} className="mx-auto w-full max-w-[1400px]">
            <p className="max-w-xl font-serif text-3xl leading-snug text-ethra-bone md:text-4xl">&ldquo;Vestirte bien es recordarte que mereces espacio, tiempo y ternura.&rdquo;</p>
            <p className="mt-5 font-display text-[10px] tracking-[0.24em] uppercase text-ethra-bone/75">Manifiesto Ethra Sport</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-ethra-bone py-20 md:py-28">
        <PhilosophyText>
          <p>Nuestro taller no persigue tendencias efímeras. Observa el cuerpo, escucha sus cambios y diseña piezas que permanecen — en el armario y en la memoria. Porque lo verdadero lujo no es lo que se muestra: es lo que te hace sentir en casa contigo misma.</p>
        </PhilosophyText>
        <div className="mx-auto mt-16 grid max-w-[1400px] grid-cols-1 gap-2 px-3 sm:grid-cols-3 md:px-6 lg:px-10">
          <EditorialImage src={SEVENTH_EDITORIAL_IMAGE} alt="Luz y calma" className="min-h-[320px]" />
          <EditorialImage src={EIGHTH_EDITORIAL_IMAGE} alt="Mujeres en comunidad" className="min-h-[320px]" />
          <EditorialImage src={NINTH_EDITORIAL_IMAGE} alt="Detalle de silueta femenina" className="min-h-[320px]" />
        </div>
      </section>

      <section className="bg-ethra-bone px-6 pb-24 pt-4 md:px-10 md:pb-32">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl border border-ethra-stone/20 px-8 py-14 text-center md:px-14 md:py-16">
          <p className="font-display text-[10px] tracking-[0.28em] uppercase text-ethra-stone">Pureza en movimiento</p>
          <h2 className="mt-5 font-serif text-3xl text-ethra-black md:text-4xl">Esta es nuestra manera de acompañarte</h2>
          <p className="mt-6 text-[15px] leading-[1.9] text-ethra-charcoal">Ethra Sport no te pide que cambies. Te invita a reconocerte: fuerte, sensible, en constante transformación. Y a elegir, cada día, la belleza de moverte con intención.</p>
          <Link href="/colecciones" className="mt-10 inline-block border border-ethra-black px-10 py-3.5 font-display text-[10px] tracking-luxury uppercase text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone">
            Explorar colecciones
          </Link>
        </motion.div>
      </section>
    </>
  );
}
