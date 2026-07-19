import Link from "next/link";
import type { StorefrontProduct } from "@/lib/storefront/types";
import {
  formatCatalogGridPrice,
  getEffectiveOriginalPrice,
  getProductGalleryUrls,
  hasActiveDiscount,
  formatDiscountBadge,
} from "@/lib/storefront/format";
import { ProductCardGallery } from "./ProductCardGallery";
import { DiscountBadge } from "./DiscountBadge";
import { SoldOutRibbon } from "./SoldOutRibbon";

interface CatalogGridProductCardProps {
  product: StorefrontProduct;
}

export function CatalogGridProductCard({ product }: CatalogGridProductCardProps) {
  const galleryUrls = getProductGalleryUrls(product);
  const discounted = hasActiveDiscount(product);
  const originalPrice = getEffectiveOriginalPrice(product);
  const badge = discounted ? formatDiscountBadge(product) : null;

  return (
    <article className="group">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative">
          <ProductCardGallery
            urls={galleryUrls}
            alt={product.name}
            variant="catalog"
            showCta={false}
          />
          {badge ? (
            <div className="absolute left-2 top-2 z-10">
              <DiscountBadge label={badge} />
            </div>
          ) : null}
          {!product.inStock ? <SoldOutRibbon /> : null}
        </div>

        <div className="mt-3 px-0.5">
          <h3 className="truncate text-[13px] font-normal leading-snug text-ethra-black transition-colors duration-300 group-hover:text-ethra-charcoal">
            {product.name}
          </h3>

          <p
            className="mt-1 text-[13px] font-normal leading-snug"
            style={{ color: "oklch(0.58 0.105 80)" }}
          >
            {formatCatalogGridPrice(product.price)}
          </p>

          <p className="mt-0.5 min-h-[16px] text-[11px] text-ethra-stone line-through">
            {discounted && originalPrice ? formatCatalogGridPrice(originalPrice) : ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
