import type { CmsPageResponse } from "./types";

type CmsSection = CmsPageResponse["sections"][number];

export interface EmphasisSplit {
  lead: string;
  tail?: string;
}

/**
 * Divide un texto en una parte normal y una parte final resaltada (cursiva
 * dorada), replicando el estilo editorial de la pagina. Prioridad:
 * 1) un salto de linea explicito ("\n") puesto en el panel,
 * 2) la ultima coma o dos puntos del texto,
 * 3) mitad por conteo de palabras (ultimo recurso — no siempre coincide con
 *    el corte que un editor humano habria elegido).
 * Para que el corte sea exacto en todos los casos, agrega un "\n" en el
 * panel justo donde debe empezar la parte en cursiva.
 */
export function splitEmphasisTail(text: string | undefined): EmphasisSplit {
  if (!text) return { lead: "" };
  const stripped = text.trim();
  if (stripped.includes("\n")) {
    const idx = stripped.indexOf("\n");
    return { lead: stripped.slice(0, idx).trim(), tail: stripped.slice(idx + 1).trim() };
  }
  const lastPunct = Math.max(stripped.lastIndexOf(","), stripped.lastIndexOf(":"));
  if (lastPunct > -1 && lastPunct < stripped.length - 1) {
    return {
      lead: stripped.slice(0, lastPunct + 1).trim(),
      tail: stripped.slice(lastPunct + 1).trim(),
    };
  }
  const words = stripped.split(/\s+/);
  if (words.length < 4) return { lead: stripped };
  const mid = Math.ceil(words.length / 2);
  return { lead: words.slice(0, mid).join(" "), tail: words.slice(mid).join(" ") };
}

function splitParagraphs(paragraphs: unknown): string[] {
  if (!Array.isArray(paragraphs)) return [];
  return paragraphs
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .flatMap((p) => p.split(/\n{2,}/))
    .map((p) => p.trim())
    .filter(Boolean);
}

function stripQuoteMarks(text: string | undefined): string {
  if (!text) return "";
  return text.trim().replace(/^["'“‘]+/, "").replace(/["'”’]+$/, "");
}

function byType(sections: CmsSection[], type: string): CmsSection[] {
  return sections.filter((s) => s.section_type === type);
}

function findTextBlockByHeading(blocks: CmsSection[], heading: string): CmsSection | undefined {
  return blocks.find(
    (b) => (b.content?.heading as string | undefined)?.trim().toLowerCase() === heading.toLowerCase(),
  );
}

function firstParagraph(section: CmsSection | undefined): string | undefined {
  return splitParagraphs(section?.content?.paragraphs)[0];
}

export interface FilosofiaContent {
  hero?: { heading: EmphasisSplit; subtitle?: string; imageUrl?: string };
  sectionI?: { quote?: EmphasisSplit; paragraphs: string[] };
  sectionII?: { quote?: string; paragraphs: string[] };
  sectionIII?: { quote?: EmphasisSplit; paragraphs: string[] };
  darkQuote?: { quote: EmphasisSplit; cite?: string; imageUrl?: string };
  galleries: Array<{ images: Array<{ url: string; alt: string }> }>;
  closingCta?: {
    heading: EmphasisSplit;
    body?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
}

/**
 * Mapea las sections de la pagina CMS "filosofia" a los props de
 * FilosofiaContent. Los TEXT_BLOCK se ubican por su campo `heading`
 * ("Titulo 1", "PARRAFO 1", etc.) porque asi los nombro quien cargo el
 * contenido — son mas estables que la posicion, pero si se renombran dejan
 * de matchear (fallback: la section simplemente no se usa, no rompe nada).
 */
export function extractFilosofiaContent(sections: CmsSection[]): FilosofiaContent {
  const hero = sections.find((s) => s.section_type === "HERO");
  const textBlocks = byType(sections, "TEXT_BLOCK");
  const galleries = byType(sections, "GALLERY");
  const banner = sections.find((s) => s.section_type === "BANNER");
  const ctas = byType(sections, "CTA");

  const heroContent = hero?.content as Record<string, string> | undefined;

  const quoteI = findTextBlockByHeading(textBlocks, "Titulo 1");
  const bodyI = findTextBlockByHeading(textBlocks, "PARRAFO 1");
  const quoteII = findTextBlockByHeading(textBlocks, "Titulo 2");
  const bodyII = findTextBlockByHeading(textBlocks, "PARRAFO 2");
  const quoteIII = findTextBlockByHeading(textBlocks, "Titulo 4");
  const bodyIII = findTextBlockByHeading(textBlocks, "PARRAFO 3");

  const bannerContent = banner?.content as Record<string, string> | undefined;

  const collectionsCta = ctas.find((c) =>
    (c.content?.primary_btn_url as string | undefined)?.includes("colecciones"),
  );
  const catalogCta = ctas.find((c) =>
    (c.content?.primary_btn_url as string | undefined)?.includes("catalogo"),
  );
  const collectionsCtaContent = collectionsCta?.content as Record<string, string> | undefined;
  const catalogCtaContent = catalogCta?.content as Record<string, string> | undefined;

  return {
    hero: heroContent
      ? {
          heading: splitEmphasisTail(heroContent.title),
          subtitle: heroContent.subtitle,
          imageUrl: heroContent.background_image_url,
        }
      : undefined,
    sectionI: quoteI || bodyI
      ? { quote: splitEmphasisTail(firstParagraph(quoteI)), paragraphs: splitParagraphs(bodyI?.content?.paragraphs) }
      : undefined,
    sectionII: quoteII || bodyII
      ? { quote: stripQuoteMarks(firstParagraph(quoteII)), paragraphs: splitParagraphs(bodyII?.content?.paragraphs) }
      : undefined,
    sectionIII: quoteIII || bodyIII
      ? { quote: splitEmphasisTail(firstParagraph(quoteIII)), paragraphs: splitParagraphs(bodyIII?.content?.paragraphs) }
      : undefined,
    darkQuote: bannerContent
      ? {
          quote: splitEmphasisTail(stripQuoteMarks(bannerContent.title)),
          cite: bannerContent.subtitle,
          imageUrl: bannerContent.desktop_image_url ?? bannerContent.mobile_image_url,
        }
      : undefined,
    galleries: galleries.map((g) => ({
      images: ((g.content?.images as Array<{ url: string; alt: string }> | undefined) ?? []).map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
    })),
    closingCta: collectionsCtaContent
      ? {
          heading: splitEmphasisTail(collectionsCtaContent.title),
          body: collectionsCtaContent.description,
          primaryLabel: collectionsCtaContent.primary_btn_label,
          primaryUrl: collectionsCtaContent.primary_btn_url,
          secondaryLabel: collectionsCtaContent.secondary_btn_label ?? catalogCtaContent?.primary_btn_label,
          secondaryUrl: collectionsCtaContent.secondary_btn_url ?? catalogCtaContent?.primary_btn_url,
        }
      : undefined,
  };
}
