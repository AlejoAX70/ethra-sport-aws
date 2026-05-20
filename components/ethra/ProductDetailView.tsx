"use client";

import { useState } from "react";
import Link from "next/link";
import type { StorefrontProduct } from "@/lib/storefront/types";
import { formatStorefrontPrice, getProductGalleryUrls } from "@/lib/storefront/format";

/** Datos de demostración hasta que el API exponga tallas y colores */
const MOCK_SIZES = [
  { id: "xs", label: "XS", available: true },
  { id: "s", label: "S", available: true },
  { id: "m", label: "M", available: true },
  { id: "l", label: "L", available: true },
  { id: "xl", label: "XL", available: false },
  { id: "xxl", label: "XXL", available: false },
  { id: "xxxl", label: "XXXL", available: false },
] as const;

const MOCK_COLORS = [
  { id: "bone", name: "Hueso", hex: "#E8E4DC" },
  { id: "stone", name: "Piedra", hex: "#8A8580" },
  { id: "black", name: "Negro", hex: "#1A1A1A" },
] as const;

interface ProductDetailViewProps {
  product: StorefrontProduct;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const images = getProductGalleryUrls(product);
  const displayImages = images.length > 0 ? images : [product.images.primary || product.images.basePath].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("xs");
  const [selectedColor, setSelectedColor] = useState<string>(MOCK_COLORS[0].id);

  const breadcrumbParts = [
    product.category?.name,
    product.subcategory?.name,
  ].filter(Boolean) as string[];

  const selectedSizeData = MOCK_SIZES.find((s) => s.id === selectedSize);
  const canPurchase = product.inStock && (selectedSizeData?.available ?? false);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-12 lg:px-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
        {/* Galería */}
        <div>
          <div className="flex items-stretch gap-3 md:gap-4">
            {displayImages.length > 1 ? (
              <div className="hidden w-[72px] shrink-0 flex-col gap-2 sm:flex md:w-24 lg:w-28">
                {displayImages.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative min-h-0 flex-1 w-full overflow-hidden border-2 bg-[#f3f3f3] transition-colors ${
                      activeImageIndex === index
                        ? "border-ethra-black"
                        : "border-transparent hover:border-ethra-stone/40"
                    }`}
                    aria-label={`Ver imagen ${index + 1}`}
                    aria-current={activeImageIndex === index}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-contain object-center p-0.5"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="relative flex min-h-[420px] min-w-0 flex-1 items-center justify-center bg-[#f3f3f3] md:min-h-[560px] lg:min-h-[640px]">
              {displayImages[activeImageIndex] ? (
                <img
                  src={displayImages[activeImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-contain object-center p-2 md:p-3"
                  loading="eager"
                />
              ) : null}
            </div>
          </div>

          {displayImages.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {displayImages.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 bg-[#f3f3f3] ${
                    activeImageIndex === index
                      ? "border-ethra-black"
                      : "border-transparent"
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain p-0.5" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Información */}
        <div className="flex flex-col lg:pt-2">
          {breadcrumbParts.length > 0 ? (
            <nav className="mb-4 font-display text-[11px] tracking-wide text-ethra-stone">
              {breadcrumbParts.map((part, i) => (
                <span key={part}>
                  {i > 0 ? <span className="mx-1.5">/</span> : null}
                  {i === 0 && product.category ? (
                    <Link
                      href={`/colecciones/${product.category.id}`}
                      className="hover:text-ethra-charcoal transition-colors"
                    >
                      {part}
                    </Link>
                  ) : (
                    <span>{part}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : (
            <Link
              href="/catalogo"
              className="mb-4 font-display text-[11px] tracking-wide text-ethra-stone hover:text-ethra-charcoal transition-colors"
            >
              Catálogo
            </Link>
          )}

          <h1 className="font-sans text-2xl font-normal leading-snug text-ethra-black md:text-[1.75rem] lg:text-3xl">
            {product.name}
          </h1>

          <p className="mt-5 font-sans text-lg font-semibold text-ethra-black md:text-xl">
            {formatStorefrontPrice(product.price)}
          </p>

          {/* Tallas (hardcoded) */}
          <div className="mt-8">
            <p className="font-display text-[11px] tracking-[0.12em] uppercase text-ethra-charcoal">
              Talla
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {MOCK_SIZES.map((size) => (
                <li key={size.id}>
                  <button
                    type="button"
                    disabled={!size.available}
                    onClick={() => size.available && setSelectedSize(size.id)}
                    className={`font-display text-[13px] tracking-wide transition-colors ${
                      !size.available
                        ? "cursor-not-allowed text-ethra-stone/50 line-through decoration-ethra-stone/60"
                        : selectedSize === size.id
                          ? "font-semibold text-ethra-black underline underline-offset-4"
                          : "text-ethra-charcoal hover:text-ethra-black"
                    }`}
                  >
                    {size.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Colores (hardcoded) */}
          <div className="mt-8">
            <p className="font-display text-[11px] tracking-[0.12em] uppercase text-ethra-charcoal">
              Colores
            </p>
            <div className="mt-3 flex gap-3">
              {MOCK_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  aria-label={color.name}
                  aria-pressed={selectedColor === color.id}
                  className={`h-9 w-9 border-2 transition-all ${
                    selectedColor === color.id
                      ? "border-ethra-black ring-1 ring-ethra-black ring-offset-2 ring-offset-ethra-bone"
                      : "border-ethra-stone/30 hover:border-ethra-charcoal"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <p className="mt-6 font-display text-[11px] text-ethra-stone">
            {product.inStock
              ? `${product.totalStock} unidades disponibles`
              : "Agotado"}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              disabled={!canPurchase}
              className="w-full bg-ethra-black px-6 py-4 font-display text-[11px] tracking-[0.14em] uppercase text-ethra-bone transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Comprar ahora
            </button>
            <button
              type="button"
              disabled={!canPurchase}
              className="w-full border border-ethra-black bg-transparent px-6 py-4 font-display text-[11px] tracking-[0.14em] uppercase text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone disabled:cursor-not-allowed disabled:opacity-40"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
