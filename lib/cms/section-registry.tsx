import { Hero } from "@/components/ethra/Hero";
import { Testimonials } from "@/components/ethra/Testimonials";
import type { ReactNode } from "react";

type SectionComponent = React.ComponentType<{ content: Record<string, unknown> }>;

export const SECTION_REGISTRY: Record<string, SectionComponent> = {
  HERO: Hero as SectionComponent,
  TESTIMONIALS: Testimonials as SectionComponent,
};

export function renderSection(
  type: string,
  content: Record<string, unknown>,
  key: string,
): ReactNode {
  const Component = SECTION_REGISTRY[type];
  if (!Component) return null;
  return <Component key={key} content={content} />;
}

export function findSectionContent(
  sections: Array<{ section_type: string; content: Record<string, unknown> }>,
  type: string,
): Record<string, unknown> | undefined {
  return sections.find((s) => s.section_type === type)?.content;
}
