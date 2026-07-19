import Link from "next/link";
import { ProductCardGallery } from "./ProductCardGallery";
import { DiscountBadge } from "./DiscountBadge";
import { SoldOutRibbon } from "./SoldOutRibbon";
import {
  formatStorefrontPrice,
  getEffectiveOriginalPrice,
  getProductCategoryLabel,
  getProductGalleryUrls,
  hasActiveDiscount,
  formatDiscountBadge,
} from "@/lib/storefront/format";
import type { StorefrontProduct } from "@/lib/storefront/types";

interface ProductCardProps {
  product: StorefrontProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const images = getProductGalleryUrls(product);
  const categoryLabel = getProductCategoryLabel(product);
  const discounted = hasActiveDiscount(product);
  const originalPrice = getEffectiveOriginalPrice(product);
  const badge = discounted ? formatDiscountBadge(product) : null;

  return (
    <article className="group">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative">
          <ProductCardGallery
            urls={images}
            alt={product.name}
            priority={priority}
          />
          {badge ? (
            <div className="absolute left-3 top-3 z-10">
              <DiscountBadge label={badge} />
            </div>
          ) : null}
          {!product.inStock ? <SoldOutRibbon /> : null}
        </div>

        <div className="mt-5">
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
            <div className="text-right">
              <span
                className="font-display text-xs tracking-wider whitespace-nowrap mt-0.5 block"
                style={{ color: "oklch(0.60 0.105 80)" }}
              >
                {formatStorefrontPrice(product.price)}
              </span>
              <span className="min-h-[14px] block text-[10px] text-ethra-stone line-through">
                {discounted && originalPrice
                  ? formatStorefrontPrice(originalPrice)
                  : ""}
              </span>
            </div>
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
