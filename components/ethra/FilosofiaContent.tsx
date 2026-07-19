"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShopLayout } from "@/components/ethra/ShopLayout";
import { IMAGE_CDN_BASE } from "@/lib/cdn";
import type { EmphasisSplit, FilosofiaContent as FilosofiaContentData } from "@/lib/cms/filosofia-content";

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

/* ─── Animation variants ─────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
} as const;

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
} as const;

/* ─── Sub-components ─────────────────────────────────────── */

function GoldOrnament() {
  return (
    <div className="flex items-center justify-center gap-5" aria-hidden>
      <span
        className="block h-px bg-gradient-to-r from-transparent"
        style={{ width: "clamp(32px,5vw,60px)", "--tw-gradient-to": "oklch(0.66 0.105 80 / 0.45)" } as React.CSSProperties}
      />
      <span style={{ color: "oklch(0.66 0.105 80 / 0.55)" }} className="text-xs">◆</span>
      <span
        className="block h-px bg-gradient-to-l from-transparent"
        style={{ width: "clamp(32px,5vw,60px)", "--tw-gradient-to": "oklch(0.66 0.105 80 / 0.45)" } as React.CSSProperties}
      />
    </div>
  );
}

interface SectionLabelProps {
  numeral: string;
  title: string;
}

function SectionLabel({ numeral, title }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-5 mb-12">
      <span
        className="font-serif text-4xl italic leading-none"
        style={{ color: "oklch(0.66 0.105 80 / 0.35)" }}
      >
        {numeral}
      </span>
      <span
        className="block h-px flex-1"
        style={{ background: "oklch(0.66 0.105 80 / 0.18)" }}
        aria-hidden
      />
      <span
        className="font-display text-[8px] tracking-[0.44em] uppercase"
        style={{ color: "oklch(0.66 0.105 80 / 0.55)" }}
      >
        {title}
      </span>
    </div>
  );
}

function EditorialImage({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <motion.div {...fadeIn} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out hover:scale-[1.03]"
      />
    </motion.div>
  );
}

/** Renderiza un texto con su cola en cursiva dorada (ver splitEmphasisTail). */
function Emphasis({ split, tailClassName = "italic" }: { split?: EmphasisSplit; tailClassName?: string }) {
  if (!split) return null;
  return (
    <>
      {split.lead}
      {split.tail && (
        <>
          {" "}
          <span className={tailClassName} style={{ color: "oklch(0.55 0.100 80)" }}>
            {split.tail}
          </span>
        </>
      )}
    </>
  );
}

/** Grid editorial de imagenes: 1 = ancho completo, 2 = dos columnas, 3+ = tres columnas. */
function EditorialGallery({ images }: { images: Array<{ url: string; alt: string }> }) {
  if (images.length === 0) return null;
  const colsClass = images.length >= 3 ? "sm:grid-cols-3" : images.length === 2 ? "md:grid-cols-2" : "";
  return (
    <section className="bg-ethra-bone pb-24 md:pb-32">
      <div className={`mx-auto grid max-w-[1400px] grid-cols-1 gap-[3px] px-3 md:px-6 lg:px-10 ${colsClass}`}>
        {images.map((img, i) => (
          <EditorialImage key={i} src={img.url} alt={img.alt} className="min-h-[380px] bg-ethra-cream" eager={i === 0} />
        ))}
      </div>
    </section>
  );
}

/* ─── Main component ─────────────────────────────────────── */

interface FilosofiaContentProps {
  content?: FilosofiaContentData;
}

export function FilosofiaContent({ content }: FilosofiaContentProps) {
  const heroHeading = content?.hero?.heading ?? { lead: "Donde el movimiento", tail: "se vuelve refugio" };
  const heroSubtitle = content?.hero?.subtitle ?? "Diseñado para mujeres que eligen sentir, no solo vestir";
  const heroImage = content?.hero?.imageUrl ?? HERO_IMAGE;

  const sectionIQuote = content?.sectionI?.quote ?? {
    lead: "El cuerpo de una mujer no necesita adornos que la limiten,",
    tail: "sino piezas que la acompañen.",
  };
  const sectionIParagraphs = content?.sectionI?.paragraphs?.length
    ? content.sectionI.paragraphs
    : [
        "Ethra Sport nace de una convicción simple y profunda: el cuerpo de una mujer no necesita adornos que la limiten, sino piezas que la acompañen con respeto, suavidad y fuerza.",
        "Cada prenda es un gesto de cuidado. Un espacio donde la piel respira, la silueta se honra y el movimiento recupera su lugar como ritual cotidiano — no como exigencia.",
      ];

  const galleries = content?.galleries?.length
    ? content.galleries
    : [
        { images: [
            { url: FIRST_EDITORIAL_IMAGE, alt: "Texturas y esencia de la marca Ethra" },
            { url: SECOND_EDITORIAL_IMAGE, alt: "Ritual de movimiento consciente" },
            { url: THIRD_EDITORIAL_IMAGE, alt: "Arquitectura del cuerpo en movimiento" },
          ] },
        { images: [
            { url: FOURTH_EDITORIAL_IMAGE, alt: "Detalle artesanal de confección" },
            { url: FIFTH_EDITORIAL_IMAGE, alt: "Movimiento y libertad" },
          ] },
        { images: [
            { url: SEVENTH_EDITORIAL_IMAGE, alt: "Luz y calma" },
            { url: EIGHTH_EDITORIAL_IMAGE, alt: "Mujeres en comunidad" },
            { url: NINTH_EDITORIAL_IMAGE, alt: "Detalle de silueta femenina" },
          ] },
      ];

  const sectionIIQuote = content?.sectionII?.quote ?? "\"La elegancia no es llamar la atención, es que te recuerden.\"";
  const sectionIIParagraphs = content?.sectionII?.paragraphs?.length
    ? content.sectionII.paragraphs
    : [
        "En nuestro universo, la moda deportiva deja de ser uniforme para convertirse en expresión. Tejidos que abrazan sin apretar. Cortes que siguen tu respiración. Colores que evocan calma, tierra y luz — porque sentirte bien también es una forma de elegancia.",
        "Creemos en la mujer que se mueve a su ritmo: la que entrena, camina, descansa y vuelve a empezar. La que no busca perfección, sino presencia.",
      ];

  const darkQuote = content?.darkQuote?.quote ?? { lead: "Vestirte bien es recordarte que mereces espacio, tiempo", tail: "y ternura." };
  const darkCite = content?.darkQuote?.cite ?? "Manifiesto Ethra Sport";
  const darkImage = content?.darkQuote?.imageUrl ?? SIXTH_EDITORIAL_IMAGE;

  const sectionIIIQuote = content?.sectionIII?.quote ?? {
    lead: "Lo verdadero lujo no es lo que se muestra:",
    tail: "es lo que te hace sentir en casa contigo misma.",
  };
  const sectionIIIParagraphs = content?.sectionIII?.paragraphs?.length
    ? content.sectionIII.paragraphs
    : [
        "Nuestro taller no persigue tendencias efímeras. Observa el cuerpo, escucha sus cambios y diseña piezas que permanecen — en el armario y en la memoria. Porque lo verdadero lujo no es lo que se muestra: es lo que te hace sentir en casa contigo misma.",
      ];

  const closingHeading = content?.closingCta?.heading ?? { lead: "Esta es nuestra manera", tail: "de acompañarte" };
  const closingBody = content?.closingCta?.body ??
    "Ethra Sport no te pide que cambies. Te invita a reconocerte: fuerte, sensible, en constante transformación. Y a elegir, cada día, la belleza de moverte con intención.";
  const closingPrimaryLabel = content?.closingCta?.primaryLabel ?? "Explorar colecciones";
  const closingPrimaryUrl = content?.closingCta?.primaryUrl ?? "/colecciones";
  const closingSecondaryLabel = content?.closingCta?.secondaryLabel ?? "Ver catálogo";
  const closingSecondaryUrl = content?.closingCta?.secondaryUrl ?? "/catalogo";

  return (
    <ShopLayout padTop={false}>
      {/* ══════════════════════════════════════════════════════
          HERO — Full-bleed dark with deep overlays
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "95vh" }}>
        {/* Background image */}
        <img
          src={heroImage}
          alt="Mujer en movimiento con piezas Ethra Sport"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />

        {/* Layered dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
          aria-hidden
        />

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-ethra-gold/15 pointer-events-none" aria-hidden />
        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-ethra-gold/15 pointer-events-none" aria-hidden />

        {/* Hero content */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 px-6 pb-16 md:px-10 md:pb-24"
        >
          <div className="mx-auto max-w-[1400px]">
            {/* Gold ornament */}
            <div className="flex items-center gap-4 mb-8">
              <span
                className="block h-px"
                style={{ width: "clamp(32px,5vw,56px)", background: "oklch(0.66 0.105 80 / 0.50)" }}
                aria-hidden
              />
              <span
                className="font-display text-[8px] tracking-[0.44em] uppercase"
                style={{ color: "oklch(0.66 0.105 80 / 0.70)" }}
              >
                Mundo Ethra
              </span>
            </div>

            <h1
              className="font-serif leading-[1.05] text-ethra-bone"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
            >
              {heroHeading.lead}
              {heroHeading.tail && (
                <span
                  className="block italic font-normal"
                  style={{ color: "oklch(0.78 0.085 80)" }}
                >
                  {heroHeading.tail}
                </span>
              )}
            </h1>

            <p
              className="mt-6 font-display text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "oklch(0.965 0.005 85 / 0.55)" }}
            >
              {heroSubtitle}
            </p>

            {/* Scroll cue */}
            <div className="mt-14 flex items-center gap-4" aria-hidden>
              <div
                className="h-10 w-px"
                style={{ background: "linear-gradient(to bottom, oklch(0.66 0.105 80 / 0.55), transparent)" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          I — Razón de ser
      ══════════════════════════════════════════════════════ */}
      <section className="bg-ethra-bone px-6 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...fadeUp}>
            <SectionLabel numeral="I" title="Razón de ser" />
          </motion.div>

          <div className="grid md:grid-cols-2 md:gap-20 items-start">
            <motion.div {...fadeUp}>
              <p className="font-serif text-3xl md:text-4xl leading-tight text-ethra-black mb-8">
                <Emphasis split={sectionIQuote} />
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="space-y-5 text-[15px] leading-[1.95] text-ethra-charcoal md:pt-2">
              {sectionIParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Editorial grid 1 ── */}
      <EditorialGallery images={galleries[0]?.images ?? []} />

      {/* ══════════════════════════════════════════════════════
          II — Expresión
      ══════════════════════════════════════════════════════ */}
      <section className="bg-ethra-bone px-6 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...fadeUp}>
            <SectionLabel numeral="II" title="Expresión" />
          </motion.div>

          <div className="grid md:grid-cols-2 md:gap-20 items-start">
            <motion.div {...fadeUp} className="space-y-5 text-[15px] leading-[1.95] text-ethra-charcoal">
              {sectionIIParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            <motion.div {...fadeUp}>
              <p className="font-serif text-2xl md:text-3xl leading-snug text-ethra-black italic">
                {sectionIIQuote}
              </p>
              <div
                className="mt-6 h-px"
                style={{ background: "oklch(0.66 0.105 80 / 0.30)", maxWidth: "120px" }}
                aria-hidden
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Editorial grid 2 ── */}
      <EditorialGallery images={galleries[1]?.images ?? []} />

      {/* ══════════════════════════════════════════════════════
          DARK QUOTE SECTION — Full atmosphere
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "72vh", backgroundColor: "oklch(0.10 0.004 78)" }}
      >
        {/* Background image at low opacity */}
        <div className="absolute inset-0">
          <img
            src={darkImage}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        </div>

        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
          aria-hidden
        />

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-ethra-gold/15 pointer-events-none" aria-hidden />
        <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-ethra-gold/15 pointer-events-none" aria-hidden />

        {/* Content */}
        <div className="relative flex items-center justify-center min-h-[72vh] px-6 py-20 md:px-10">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            {/* Decorative quote mark */}
            <div
              className="font-serif text-[7rem] md:text-[10rem] leading-none select-none mb-0 -mt-8"
              style={{ color: "oklch(0.66 0.105 80 / 0.14)", lineHeight: "0.7" }}
              aria-hidden
            >
              &ldquo;
            </div>

            <blockquote className="font-serif text-2xl md:text-4xl lg:text-5xl leading-snug text-ethra-bone mt-6">
              {darkQuote.lead}
              {darkQuote.tail && (
                <span
                  className="block italic font-normal mt-2"
                  style={{ color: "oklch(0.78 0.085 80)" }}
                >
                  {darkQuote.tail}
                </span>
              )}
            </blockquote>

            <div className="mt-10 mb-6">
              <GoldOrnament />
            </div>

            <cite
              className="not-italic font-display text-[9px] tracking-[0.38em] uppercase"
              style={{ color: "oklch(0.965 0.005 85 / 0.40)" }}
            >
              {darkCite}
            </cite>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          III — Permanencia
      ══════════════════════════════════════════════════════ */}
      <section className="bg-ethra-bone px-6 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...fadeUp}>
            <SectionLabel numeral="III" title="Permanencia" />
          </motion.div>

          <div className="grid md:grid-cols-2 md:gap-20 items-start">
            <motion.div {...fadeUp}>
              <p className="font-serif text-3xl md:text-4xl leading-tight text-ethra-black mb-8">
                {sectionIIIQuote.lead}
                {sectionIIIQuote.tail && (
                  <span className="block italic" style={{ color: "oklch(0.55 0.100 80)" }}>
                    {sectionIIIQuote.tail}
                  </span>
                )}
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="space-y-5 text-[15px] leading-[1.95] text-ethra-charcoal md:pt-2">
              {sectionIIIParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Editorial grid 3 ── */}
      <EditorialGallery images={galleries[2]?.images ?? []} />

      {/* ══════════════════════════════════════════════════════
          CLOSING CTA — Dark, premium
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden px-6 py-28 md:px-10 md:py-36"
        style={{ backgroundColor: "oklch(0.10 0.004 78)" }}
      >
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
          aria-hidden
        />

        {/* Corner ornaments */}
        <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-ethra-gold/15 pointer-events-none" aria-hidden />
        <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-ethra-gold/15 pointer-events-none" aria-hidden />

        <motion.div {...fadeUp} className="relative mx-auto max-w-2xl text-center">
          {/* Gold ornament */}
          <div className="mb-10">
            <GoldOrnament />
          </div>

          <p
            className="font-display text-[8px] tracking-[0.44em] uppercase mb-6"
            style={{ color: "oklch(0.66 0.105 80 / 0.60)" }}
          >
            Pureza en movimiento
          </p>

          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-ethra-bone mb-8">
            {closingHeading.lead}
            {closingHeading.tail && (
              <span
                className="block italic font-normal"
                style={{ color: "oklch(0.78 0.085 80)" }}
              >
                {closingHeading.tail}
              </span>
            )}
          </h2>

          {/* Gold separator */}
          <div
            className="mx-auto mb-8 h-px"
            style={{ maxWidth: "80px", background: "oklch(0.66 0.105 80 / 0.30)" }}
            aria-hidden
          />

          <p
            className="text-[15px] leading-[1.9] mb-12 max-w-xl mx-auto"
            style={{ color: "oklch(0.965 0.005 85 / 0.62)" }}
          >
            {closingBody}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={closingPrimaryUrl}
              className="inline-block px-10 py-4 font-display text-[10px] tracking-luxury uppercase transition-all duration-300"
              style={{
                border: "1px solid oklch(0.66 0.105 80 / 0.50)",
                color: "oklch(0.78 0.085 80)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "oklch(0.66 0.105 80)";
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.10 0.004 78)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.78 0.085 80)";
              }}
            >
              {closingPrimaryLabel}
            </Link>

            <Link
              href={closingSecondaryUrl}
              className="inline-block px-10 py-4 font-display text-[10px] tracking-luxury uppercase transition-all duration-300"
              style={{
                border: "1px solid oklch(0.965 0.005 85 / 0.15)",
                color: "oklch(0.965 0.005 85 / 0.55)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(0.965 0.005 85 / 0.35)";
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.965 0.005 85 / 0.85)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "oklch(0.965 0.005 85 / 0.15)";
                (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.965 0.005 85 / 0.55)";
              }}
            >
              {closingSecondaryLabel}
            </Link>
          </div>
        </motion.div>
      </section>
    </ShopLayout>
  );
}
