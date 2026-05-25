import { Navbar } from "@/components/ethra/Navbar";
import { Footer } from "@/components/ethra/Footer";
import { ProductDetailView } from "@/components/ethra/ProductDetailView";
import { getProduct } from "@/lib/storefront/api";
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
    console.log("[ProductPage] respuesta del backend (getProduct):", JSON.stringify(product, null, 2));
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
