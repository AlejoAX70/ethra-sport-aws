import Link from "next/link";
import type { StorefrontProduct } from "@/lib/storefront/types";
import { formatCatalogGridPrice, getProductGalleryUrls } from "@/lib/storefront/format";
import { ProductCardGallery } from "./ProductCardGallery";

interface CatalogGridProductCardProps {
  product: StorefrontProduct;
}

export function CatalogGridProductCard({ product }: CatalogGridProductCardProps) {
  const galleryUrls = getProductGalleryUrls(product);

  return (
    <article className="group">
      <Link href={`/producto/${product.id}`} className="block">
        <ProductCardGallery
          urls={galleryUrls}
          alt={product.name}
          variant="catalog"
          showCta={false}
        />

        <div className="mt-3 px-0.5">
          {/* Product name */}
          <h3 className="truncate text-[13px] font-normal leading-snug text-ethra-black transition-colors duration-300 group-hover:text-ethra-charcoal">
            {product.name}
          </h3>

          {/* Price — in gold */}
          <p
            className="mt-1 text-[13px] font-normal leading-snug"
            style={{ color: "oklch(0.58 0.105 80)" }}
          >
            {formatCatalogGridPrice(product.price)}
          </p>

          {/* Out of stock */}
          {!product.inStock ? (
            <p className="mt-1 font-display text-[9px] tracking-luxury uppercase text-ethra-stone">
              Agotado
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
