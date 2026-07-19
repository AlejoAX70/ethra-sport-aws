import type { CmsPageResponse } from "./types";

type CmsSection = CmsPageResponse["sections"][number];

/**
 * Labels estables que debe tener cada sección en el panel (Contenido Web →
 * página → bloque → campo "Nombre interno") para que el match no dependa del
 * orden. Si una sección no tiene el label correspondiente, se hace fallback
 * por posición (comportamiento anterior).
 */
const HOME_SECTION_LABELS = {
  manifestoQuote: "home-manifiesto-cita",
  manifestoBody: "home-manifiesto-parrafo",
  manifestoPrimaryCta: "home-manifiesto-boton-1",
  manifestoSecondaryCta: "home-manifiesto-boton-2",
  editorialBanner: "home-editorial-banner",
} as const;

function byLabel(sections: CmsSection[], sectionType: string, label: string): CmsSection | undefined {
  return sections.find((s) => s.section_type === sectionType && s.label === label);
}

export interface ManifestoContent {
  quote?: string;
  body?: string;
  primaryLinkLabel?: string;
  primaryLinkUrl?: string;
  secondaryLinkLabel?: string;
  secondaryLinkUrl?: string;
}

export interface EditorialContent {
  headingLine1?: string;
  headingLine2?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

/** Divide un heading en dos mitades por palabras (replica el corte editorial a dos líneas). */
function splitHeading(heading: string): { line1: string; line2: string } {
  const words = heading.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(" "),
    line2: words.slice(mid).join(" "),
  };
}

/**
 * Extrae el contenido de HomeManifesto a partir de los sections TEXT_BLOCK/CTA
 * de la página CMS. Primero intenta ubicar cada bloque por su `label` estable
 * (ver HOME_SECTION_LABELS); si el bloque no tiene ese label asignado en el
 * panel, hace fallback por posición relativa (1er TEXT_BLOCK = cita, 2do =
 * párrafo; 2do y 3er CTA = los dos links) — así el contenido actual sigue
 * funcionando aunque nadie haya puesto los labels todavía.
 */
export function extractManifestoContent(sections: CmsSection[]): ManifestoContent | undefined {
  const textBlocks = sections.filter((s) => s.section_type === "TEXT_BLOCK");
  const ctas = sections.filter((s) => s.section_type === "CTA");

  const quoteSection = byLabel(sections, "TEXT_BLOCK", HOME_SECTION_LABELS.manifestoQuote) ?? textBlocks[0];
  const bodySection = byLabel(sections, "TEXT_BLOCK", HOME_SECTION_LABELS.manifestoBody) ?? textBlocks[1];
  const primaryCtaSection = byLabel(sections, "CTA", HOME_SECTION_LABELS.manifestoPrimaryCta) ?? ctas[1];
  const secondaryCtaSection = byLabel(sections, "CTA", HOME_SECTION_LABELS.manifestoSecondaryCta) ?? ctas[2];

  const quote = (quoteSection?.content?.paragraphs as string[] | undefined)?.[0];
  const body = (bodySection?.content?.paragraphs as string[] | undefined)?.[0];
  const primaryCta = primaryCtaSection?.content as Record<string, string> | undefined;
  const secondaryCta = secondaryCtaSection?.content as Record<string, string> | undefined;

  if (!quote && !body && !primaryCta && !secondaryCta) return undefined;

  return {
    quote,
    body,
    primaryLinkLabel: primaryCta?.primary_btn_label,
    primaryLinkUrl: primaryCta?.primary_btn_url,
    secondaryLinkLabel: secondaryCta?.primary_btn_label,
    secondaryLinkUrl: secondaryCta?.primary_btn_url,
  };
}

export function extractEditorialContent(sections: CmsSection[]): EditorialContent | undefined {
  const banner =
    byLabel(sections, "BANNER", HOME_SECTION_LABELS.editorialBanner) ??
    sections.find((s) => s.section_type === "BANNER");
  if (!banner) return undefined;

  const content = banner.content as Record<string, string | undefined>;
  const { line1, line2 } = content.title ? splitHeading(content.title) : { line1: undefined, line2: undefined };

  return {
    headingLine1: line1,
    headingLine2: line2,
    body: content.subtitle,
    ctaLabel: content.cta_label,
    ctaUrl: content.cta_url,
    imageUrl: content.desktop_image_url ?? content.mobile_image_url,
  };
}
