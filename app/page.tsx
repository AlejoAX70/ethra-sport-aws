import { Navbar } from "@/components/ethra/Navbar";
import { Hero } from "@/components/ethra/Hero";
import { CategoryGrid } from "@/components/ethra/CategoryGrid";
import { NuevasFormas } from "@/components/ethra/NuevasFormas";
import { Testimonials } from "@/components/ethra/Testimonials";
import { Footer } from "@/components/ethra/Footer";
import { getCategories, getCatalog } from "@/lib/storefront/api";

/** Datos frescos del API en cada visita (igual que /catalogo) */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categoriesRes, catalogRes] = await Promise.all([
    getCategories().catch(() => ({ categories: [] })),
    getCatalog({ page: 1, limit: 3 }).catch(() => ({ products: [], pagination: { page: 1, limit: 3, total: 0, totalPages: 0, hasNext: false, hasPrev: false } })),
  ]);

  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <CategoryGrid categories={categoriesRes.categories} />
        <NuevasFormas products={catalogRes.products} />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
