import { Navbar } from "@/components/ethra/Navbar";
import { Hero } from "@/components/ethra/Hero";
import { HomeManifesto } from "@/components/ethra/HomeManifesto";
import { CategoryGrid } from "@/components/ethra/CategoryGrid";
import { HomeEditorial } from "@/components/ethra/HomeEditorial";
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
  const [categoriesRes, catalogRes, cmsPage, cmsConfig, mainMenu, footerMenu] =
    await Promise.all([
      getCategories().catch(() => ({ categories: [] })),
      getCatalog({ page: 1, limit: 3 }).catch(() => ({
        products: [],
        pagination: {
          page: 1,
          limit: 3,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      })),
      getCmsPage("pagina-principal").catch((e) => {
        console.error("[CMS] getCmsPage error:", e?.status, e?.message, e?.data);
        return null;
      }),
      getCmsConfig().catch((e) => {
        console.error("[CMS] getCmsConfig error:", e?.status, e?.message, e?.data);
        return null;
      }),
      getCmsMenu("main").catch((e) => {
        console.error("[CMS] getCmsMenu(main) error:", e?.status, e?.message, e?.data);
        return null;
      }),
      getCmsMenu("footer").catch((e) => {
        console.error("[CMS] getCmsMenu(footer) error:", e?.status, e?.message, e?.data);
        return null;
      }),
    ]);

  console.log("[CMS pagina-principal]", JSON.stringify({ cmsPage, cmsConfig, mainMenu, footerMenu }, null, 2));

  const sections = cmsPage?.sections ?? [];
  const heroContent = findSectionContent(sections, "HERO");
  const testimonialsContent = findSectionContent(sections, "TESTIMONIALS");

  const navItems = mainMenu?.items.map((i) => ({ label: i.label, href: i.url }));
  const footerLinks = footerMenu?.items.map((i) => ({ label: i.label, href: i.url }));

  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar menuItems={navItems} />

      <main>
        {/* 1. Hero — dramático, negro profundo + oro */}
        <Hero content={heroContent} />

        {/* 2. Manifiesto — sección oscura con cita editorial */}
        <HomeManifesto />

        {/* 3. Colecciones — carrusel editorial */}
        <CategoryGrid categories={categoriesRes.categories} />

        {/* 4. Split editorial — hardcoded por ahora */}
        <HomeEditorial />

        {/* 5. Nuevas formas — grid de productos */}
        <NuevasFormas products={catalogRes.products} />

        {/* 6. Testimoniales — fondo negro, estrellas doradas */}
        <Testimonials content={testimonialsContent} />
      </main>

      <Footer config={cmsConfig} footerLinks={footerLinks} />
    </div>
  );
}
