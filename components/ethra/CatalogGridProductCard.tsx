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

        <div className="mt-3 px-1">
          <h3 className="truncate text-[13px] font-normal leading-snug text-ethra-black">
            {product.name}
          </h3>
          <p className="mt-1 text-[13px] font-normal leading-snug text-ethra-black">
            {formatCatalogGridPrice(product.price)}
          </p>
        </div>

        {!product.inStock ? (
          <p className="mt-1 px-1 font-display text-[10px] tracking-luxury uppercase text-ethra-stone">
            Agotado
          </p>
        ) : null}
      </Link>
    </article>
  );
}
