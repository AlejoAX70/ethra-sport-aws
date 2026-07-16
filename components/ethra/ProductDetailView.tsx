"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { StorefrontProduct } from "@/lib/storefront/types";
import {
  formatStorefrontPrice,
  getProductCategoryLabel,
  getProductGalleryUrls,
  getProductImageUrl,
  shouldShowDiscountBadge,
} from "@/lib/storefront/format";
import { useCart } from "@/hooks/useCart";
import { requestOpenCartDrawer } from "@/lib/cart-drawer";
import { toast } from "sonner";
import { toCdnImageUrl } from "@/lib/cdn";
import {
  getDefaultVariantSelection,
  getVariantDisplayPricing,
  parseProductVariants,
} from "@/lib/storefront/variants";
import { DiscountBadge } from "./DiscountBadge";

interface ProductDetailViewProps {
  product: StorefrontProduct;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const images = getProductGalleryUrls(product);
  const displayImages =
    images.length > 0
      ? images
      : [toCdnImageUrl(product.images.primary || product.images.basePath)].filter(Boolean);

  const parsedVariants = useMemo(
    () => parseProductVariants(product.variants ?? []),
    [product.variants],
  );

  const defaultSelection = useMemo(
    () => getDefaultVariantSelection(parsedVariants),
    [parsedVariants],
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(defaultSelection.colorId);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(defaultSelection.sizeId);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    setSelectedColorId(defaultSelection.colorId);
    setSelectedSizeId(defaultSelection.sizeId);
  }, [product.id, defaultSelection.colorId, defaultSelection.sizeId]);

  const selectedVariant = parsedVariants.hasVariants
    ? parsedVariants.findVariant(selectedColorId, selectedSizeId)
    : null;

  const displayPricing = getVariantDisplayPricing(
    product.price,
    selectedVariant,
    product,
  );
  const displayPrice = displayPricing.price;
  const showDiscountBadge = shouldShowDiscountBadge({
    badgeLabel: displayPricing.discount?.badgeLabel,
    originalPrice: displayPricing.originalPrice,
    currentPrice: displayPrice,
  });
  const discountBadgeLabel = showDiscountBadge
    ? (displayPricing.discount?.badgeLabel ?? null)
    : null;

  const offerEndsCopy = useMemo(() => {
    const endsAt = product.discount?.endsAt;
    if (!endsAt) return null;
    const ends = new Date(endsAt);
    const days = Math.ceil((ends.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 1 || days > 14) return null;
    return `Oferta termina el ${ends.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}`;
  }, [product.discount?.endsAt]);

  const canPurchase = parsedVariants.hasVariants
    ? Boolean(selectedVariant && selectedVariant.stock > 0)
    : product.inStock;

  const stockLabel = parsedVariants.hasVariants
    ? selectedVariant
      ? selectedVariant.stock > 0
        ? `${selectedVariant.stock} unidades disponibles`
        : "Agotado en esta combinación"
      : "Selecciona talla y color"
    : product.inStock
      ? `${product.totalStock} unidades disponibles`
      : "Agotado";

  const handleColorChange = (colorId: string) => {
    setSelectedColorId(colorId);
    if (selectedSizeId && !parsedVariants.isSizeAvailable(selectedSizeId, colorId)) {
      const nextSize = parsedVariants.sizes.find((size) =>
        parsedVariants.isSizeAvailable(size.id, colorId),
      );
      setSelectedSizeId(nextSize?.id ?? null);
    }
  };

  const breadcrumbParts = [product.category?.name, product.subcategory?.name].filter(
    Boolean,
  ) as string[];

  const selectedColor = parsedVariants.colors.find((c) => c.id === selectedColorId) ?? null;
  const selectedSize = parsedVariants.sizes.find((s) => s.id === selectedSizeId) ?? null;

  const buildCartItemPayload = () => {
    const imageUrl =
      displayImages[activeImageIndex] ?? getProductImageUrl(product);

    return {
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      sku: selectedVariant?.sku ?? null,
      name: product.name,
      imageUrl,
      categoryName: getProductCategoryLabel(product),
      price: displayPrice,
      originalPrice: displayPricing.originalPrice,
      discountBadgeLabel,
      selectedColor: selectedColor
        ? { id: selectedColor.id, hex: selectedColor.hex, name: selectedColor.name }
        : null,
      selectedSize: selectedSize
        ? { id: selectedSize.id, label: selectedSize.label }
        : null,
      quantity: 1,
    };
  };

  const handleAddToCart = () => {
    if (!canPurchase || isAdding) return;

    setIsAdding(true);
    addItem(buildCartItemPayload());

    const descriptionParts = [
      product.name,
      selectedSize?.label,
      selectedColor?.name,
    ].filter(Boolean);

    toast.success("Agregado a tu bolsa", {
      description: descriptionParts.join(" · "),
      duration: 4000,
      action: {
        label: "Ver bolsa",
        onClick: () => requestOpenCartDrawer(),
      },
    });

    window.setTimeout(() => setIsAdding(false), 600);
  };

  const handleBuyNow = () => {
    if (!canPurchase || isBuyingNow) return;

    setIsBuyingNow(true);
    addItem(buildCartItemPayload());
    router.push("/checkout");
  };

  const addToCartAriaLabel = [
    `Agregar ${product.name}`,
    selectedSize ? `talla ${selectedSize.label}` : null,
    selectedColor ? `color ${selectedColor.name}` : null,
    "al carrito",
  ]
    .filter(Boolean)
    .join(", ");

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

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="font-sans text-lg font-semibold text-ethra-black md:text-xl">
              {formatStorefrontPrice(displayPrice)}
            </p>
            {discountBadgeLabel ? (
              <DiscountBadge label={discountBadgeLabel} />
            ) : null}
          </div>
          {showDiscountBadge && displayPricing.originalPrice ? (
            <p className="mt-1 text-sm text-ethra-stone line-through">
              {formatStorefrontPrice(displayPricing.originalPrice)}
            </p>
          ) : null}
          {offerEndsCopy ? (
            <p className="mt-2 font-display text-[11px] text-ethra-stone">{offerEndsCopy}</p>
          ) : null}

          {parsedVariants.sizes.length > 0 ? (
            <div className="mt-8">
              <p className="font-display text-[11px] tracking-[0.12em] uppercase text-ethra-charcoal">
                Talla
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {parsedVariants.sizes.map((size) => {
                  const available = parsedVariants.isSizeAvailable(size.id, selectedColorId);
                  return (
                    <li key={size.id}>
                      <button
                        type="button"
                        disabled={!available}
                        onClick={() => available && setSelectedSizeId(size.id)}
                        className={`font-display text-[13px] tracking-wide transition-colors ${
                          !available
                            ? "cursor-not-allowed text-ethra-stone/50 line-through decoration-ethra-stone/60"
                            : selectedSizeId === size.id
                              ? "font-semibold text-ethra-black underline underline-offset-4"
                              : "text-ethra-charcoal hover:text-ethra-black"
                        }`}
                      >
                        {size.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {parsedVariants.colors.length > 0 ? (
            <div className="mt-8">
              <p className="font-display text-[11px] tracking-[0.12em] uppercase text-ethra-charcoal">
                Colores
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {parsedVariants.colors.map((color) => {
                  const available = parsedVariants.isColorAvailable(color.id, selectedSizeId);
                  return (
                    <button
                      key={color.id}
                      type="button"
                      disabled={!available}
                      onClick={() => available && handleColorChange(color.id)}
                      aria-label={color.name}
                      aria-pressed={selectedColorId === color.id}
                      title={available ? color.name : `${color.name} — agotado`}
                      className={`h-9 w-9 border-2 transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                        selectedColorId === color.id
                          ? "border-ethra-black ring-1 ring-ethra-black ring-offset-2 ring-offset-ethra-bone"
                          : "border-ethra-stone/30 hover:border-ethra-charcoal"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
              </div>
              {selectedColorId ? (
                <p className="mt-2 font-display text-[11px] text-ethra-stone">
                  {parsedVariants.colors.find((color) => color.id === selectedColorId)?.name}
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="mt-6 font-display text-[11px] text-ethra-stone">{stockLabel}</p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              disabled={!canPurchase || isBuyingNow}
              onClick={handleBuyNow}
              className="w-full bg-ethra-black px-6 py-4 font-display text-[11px] tracking-[0.14em] uppercase text-ethra-bone transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isBuyingNow ? "REDIRIGIENDO..." : "COMPRAR AHORA"}
            </button>
            <button
              type="button"
              disabled={!canPurchase || isAdding}
              onClick={handleAddToCart}
              aria-label={addToCartAriaLabel}
              className="w-full border border-ethra-black bg-transparent px-6 py-4 font-display text-[11px] tracking-[0.14em] uppercase text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isAdding ? "AGREGANDO..." : "AGREGAR AL CARRITO"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
