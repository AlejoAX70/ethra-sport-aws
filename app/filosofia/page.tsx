import { FilosofiaContent } from "@/components/ethra/FilosofiaContent";
import { getCmsPage } from "@/lib/cms/api";
import { extractFilosofiaContent } from "@/lib/cms/filosofia-content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const cmsPage = await getCmsPage("filosofia").catch(() => null);
  const seo = cmsPage?.page.seo;

  return {
    title: seo?.meta_title ?? "Filosofía — Ethra Sport",
    description:
      seo?.meta_description ??
      "Conoce la filosofía de Ethra Sport: pureza en movimiento, diseño consciente.",
    openGraph: seo?.og_image_url ? { images: [{ url: seo.og_image_url }] } : undefined,
  };
}

export default async function FilosofiaPage() {
  const cmsPage = await getCmsPage("filosofia").catch((e) => {
    console.error("[CMS] getCmsPage(filosofia) error:", e?.status, e?.message, e?.data);
    return null;
  });

  const content = extractFilosofiaContent(cmsPage?.sections ?? []);

  return <FilosofiaContent content={content} />;
}
