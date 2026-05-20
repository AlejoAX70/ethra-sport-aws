import { Navbar } from "@/components/ethra/Navbar";
import { Footer } from "@/components/ethra/Footer";
import { ProductCard } from "@/components/ethra/ProductCard";
import { getCategories, getCategoryProducts } from "@/lib/storefront/api";
import { resolveCategoryPageContext } from "@/lib/storefront/format";

interface Props {
  params: Promise<{ categoryId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { categoryId } = await params;
  const { categories } = await getCategories().catch(() => ({ categories: [] }));
  const ctx = resolveCategoryPageContext(categories, categoryId);
  return { title: `${ctx.title} — Ethra Sport` };
}

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params;
  const [{ categories }, catalogRes] = await Promise.all([
    getCategories().catch(() => ({ categories: [] })),
    getCategoryProducts(categoryId, { page: 1, limit: 40 }).catch(() => ({
      products: [],
      pagination: { page: 1, limit: 40, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
    })),
  ]);

  const ctx = resolveCategoryPageContext(categories, categoryId);

  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h1 className="font-serif text-4xl md:text-5xl text-ethra-black mb-10">{ctx.title}</h1>
          {catalogRes.products.length === 0 ? (
            <p className="text-ethra-stone text-sm py-20 text-center">No hay productos en esta colección.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
              {catalogRes.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
