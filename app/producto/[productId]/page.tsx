import { Navbar } from "@/components/ethra/Navbar";
import { Footer } from "@/components/ethra/Footer";
import { ProductDetailView } from "@/components/ethra/ProductDetailView";
import { getProduct } from "@/lib/storefront/api";
import { formatStorefrontPrice, getEffectiveOriginalPrice, hasActiveDiscount } from "@/lib/storefront/format";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { productId } = await params;
  try {
    const product = await getProduct(productId);
    const priceLabel = formatStorefrontPrice(product.price);
    const originalPrice = getEffectiveOriginalPrice(product);
    const discountNote =
      hasActiveDiscount(product) && originalPrice
        ? ` Antes ${formatStorefrontPrice(originalPrice)}.`
        : "";
    return {
      title: `${product.name} — Ethra Sport`,
      description: `${product.name} — ${priceLabel}.${discountNote}`,
      openGraph: {
        title: product.name,
        description: `${priceLabel}.${discountNote}`,
      },
    };
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

  return (
    <div className="bg-ethra-bone min-h-screen">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <ProductDetailView product={product} />
      </main>
      <Footer />
    </div>
  );
}
