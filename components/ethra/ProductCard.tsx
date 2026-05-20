import Link from "next/link";
import { ProductCardGallery } from "./ProductCardGallery";
import { formatStorefrontPrice, getProductCategoryLabel, getProductGalleryUrls } from "@/lib/storefront/format";
import type { StorefrontProduct } from "@/lib/storefront/types";

interface ProductCardProps {
  product: StorefrontProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const images = getProductGalleryUrls(product);
  const categoryLabel = getProductCategoryLabel(product);

  return (
    <article className="group">
      <Link href={`/producto/${product.id}`} className="block">
        <ProductCardGallery urls={images} alt={product.name} priority={priority} />
        <div className="mt-5 flex items-start justify-between gap-4">
          <h3 className="font-serif text-lg text-ethra-black">{product.name}</h3>
          <span className="font-display text-xs tracking-wider text-ethra-charcoal whitespace-nowrap">
            {formatStorefrontPrice(product.price)}
          </span>
        </div>
        {categoryLabel && (
          <p className="mt-2 text-sm text-ethra-stone leading-relaxed max-w-xs">{categoryLabel}</p>
        )}
      </Link>
    </article>
  );
}
