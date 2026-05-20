import { Navbar } from "@/components/ethra/Navbar";
import { Footer } from "@/components/ethra/Footer";
import { getProduct } from "@/lib/storefront/api";
import { formatStorefrontPrice, getProductGalleryUrls, getProductCategoryLabel } from "@/lib/storefront/format";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { productId } = await params;
  try {
    const product = await getProduct(productId);
    return { title: `${product.name} — Ethra Sport` };
  } catch {
    return { title: "Producto — Ethra Sport" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  let product;
  try {
    product = await getProduct(productId);
  } catch {
    notFound();
  }

  const images = getProductGalleryUrls(product);
  const categoryLabel = getProductCategoryLabel(product);

  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-2">
              {images.map((src, i) => (
                <div key={i} className="aspect-[4/5] overflow-hidden bg-ethra-cream">
                  <img src={src} alt={product.name} className="h-full w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              {categoryLabel && (
                <p className="font-display text-[10px] tracking-luxury uppercase text-ethra-stone mb-4">{categoryLabel}</p>
              )}
              <h1 className="font-serif text-4xl md:text-5xl text-ethra-black">{product.name}</h1>
              <p className="mt-6 font-display text-xl tracking-wider text-ethra-charcoal">
                {formatStorefrontPrice(product.price)}
              </p>
              <div className="gold-line my-8" />
              <p className="text-sm text-ethra-stone">
                {product.inStock ? `En stock (${product.totalStock} disponibles)` : "Agotado"}
              </p>
              <button
                disabled={!product.inStock}
                className="mt-8 w-full max-w-sm border border-ethra-black px-10 py-4 font-display text-[11px] tracking-luxury uppercase text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Agregar a la bolsa
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
