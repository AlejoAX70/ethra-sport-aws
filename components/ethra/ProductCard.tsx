import Link from "next/link";
import { ProductCardGallery } from "./ProductCardGallery";
import {
  formatStorefrontPrice,
  getProductCategoryLabel,
  getProductGalleryUrls,
} from "@/lib/storefront/format";
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
        {/* Gallery */}
        <ProductCardGallery
          urls={images}
          alt={product.name}
          priority={priority}
        />

        {/* Info row */}
        <div className="mt-5">
          {/* Gold underline — expands on hover */}
          <div
            className="h-px mb-4 transition-all duration-500 origin-left"
            style={{
              background:
                "linear-gradient(to right, oklch(0.66 0.105 80 / 0.45), transparent)",
              transform: "scaleX(0.3)",
              transitionProperty: "transform",
            }}
            aria-hidden
          />

          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-lg text-ethra-black leading-snug">
              {product.name}
            </h3>
            {/* Price in gold */}
            <span
              className="font-display text-xs tracking-wider whitespace-nowrap mt-0.5"
              style={{ color: "oklch(0.60 0.105 80)" }}
            >
              {formatStorefrontPrice(product.price)}
            </span>
          </div>

          {categoryLabel && (
            <p className="mt-2 text-sm text-ethra-stone leading-relaxed max-w-xs font-light">
              {categoryLabel}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
