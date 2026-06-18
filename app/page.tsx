import { Navbar } from "@/components/ethra/Navbar";
import { Hero } from "@/components/ethra/Hero";
import { CategoryGrid } from "@/components/ethra/CategoryGrid";
import { NuevasFormas } from "@/components/ethra/NuevasFormas";
import { Testimonials } from "@/components/ethra/Testimonials";
import { Footer } from "@/components/ethra/Footer";
import { getCategories, getCatalog } from "@/lib/storefront/api";
import { getCmsPage, getCmsConfig, getCmsMenu } from "@/lib/cms/api";
import { findSectionContent } from "@/lib/cms/section-registry";
import { CmsApiError } from "@/lib/cms/client";

/** Datos frescos del API en cada visita */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categoriesRes, catalogRes, cmsPage, cmsConfig, mainMenu, footerMenu] = await Promise.all([
    getCategories().catch(() => ({ categories: [] })),
    getCatalog({ page: 1, limit: 3 }).catch(() => ({ products: [], pagination: { page: 1, limit: 3, total: 0, totalPages: 0, hasNext: false, hasPrev: false } })),
    getCmsPage("home").catch((e) => (e instanceof CmsApiError && e.status === 404 ? null : null)),
    getCmsConfig().catch(() => null),
    getCmsMenu("main").catch(() => null),
    getCmsMenu("footer").catch(() => null),
  ]);

  const sections = cmsPage?.sections ?? [];
  const heroContent = findSectionContent(sections, "HERO");
  const testimonialsContent = findSectionContent(sections, "TESTIMONIALS");

  const navItems = mainMenu?.items.map((i) => ({ label: i.label, href: i.url }));
  const footerLinks = footerMenu?.items.map((i) => ({ label: i.label, href: i.url }));

  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar menuItems={navItems} />
      <main>
        <Hero content={heroContent} />
        <CategoryGrid categories={categoriesRes.categories} />
        <NuevasFormas products={catalogRes.products} />
        <Testimonials content={testimonialsContent} />
      </main>
      <Footer config={cmsConfig} footerLinks={footerLinks} />
    </div>
  );
}
