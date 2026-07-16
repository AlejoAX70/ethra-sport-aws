import type { StorefrontPrice, StorefrontProduct, StorefrontProductVariant, StorefrontDiscount } from "./types";
import { shouldShowDiscountBadge } from "./format";

export interface ProductColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSizeOption {
  id: string;
  label: string;
}

export interface ParsedProductVariants {
  colors: ProductColorOption[];
  sizes: ProductSizeOption[];
  hasVariants: boolean;
  findVariant: (colorId: string | null, sizeId: string | null) => StorefrontProductVariant | null;
  isColorAvailable: (colorId: string, selectedSizeId: string | null) => boolean;
  isSizeAvailable: (sizeId: string, selectedColorId: string | null) => boolean;
}

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

function isColorValue(value: unknown): value is { hex: string; name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "hex" in value &&
    "name" in value &&
    typeof (value as { hex: unknown }).hex === "string" &&
    typeof (value as { name: unknown }).name === "string"
  );
}

function colorIdFromValue(color: { hex: string; name: string }): string {
  return color.hex.toLowerCase();
}

function getColorFromAttributes(
  attributes: StorefrontProductVariant["attributes"],
): { hex: string; name: string } | null {
  for (const [key, value] of Object.entries(attributes)) {
    if (/color/i.test(key) && isColorValue(value)) return value;
  }
  for (const value of Object.values(attributes)) {
    if (isColorValue(value)) return value;
  }
  return null;
}

function getSizeFromAttributes(attributes: StorefrontProductVariant["attributes"]): string | null {
  for (const [key, value] of Object.entries(attributes)) {
    if (/talla|size/i.test(key) && typeof value === "string") return value;
  }
  for (const value of Object.values(attributes)) {
    if (typeof value === "string") return value;
  }
  return null;
}

function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const indexA = SIZE_ORDER.indexOf(a.toUpperCase());
    const indexB = SIZE_ORDER.indexOf(b.toUpperCase());
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b, "es");
  });
}

function capitalizeLabel(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function variantMatchesColor(
  variant: StorefrontProductVariant,
  colorId: string | null,
): boolean {
  if (!colorId) return true;
  const color = getColorFromAttributes(variant.attributes);
  return color ? colorIdFromValue(color) === colorId : false;
}

function variantMatchesSize(variant: StorefrontProductVariant, sizeId: string | null): boolean {
  if (!sizeId) return true;
  const size = getSizeFromAttributes(variant.attributes);
  return size === sizeId;
}

export function parseProductVariants(variants: StorefrontProductVariant[]): ParsedProductVariants {
  const colorMap = new Map<string, ProductColorOption>();
  const sizeSet = new Set<string>();

  for (const variant of variants) {
    const color = getColorFromAttributes(variant.attributes);
    if (color) {
      const id = colorIdFromValue(color);
      if (!colorMap.has(id)) {
        colorMap.set(id, {
          id,
          name: capitalizeLabel(color.name),
          hex: color.hex,
        });
      }
    }

    const size = getSizeFromAttributes(variant.attributes);
    if (size) sizeSet.add(size);
  }

  const colors = Array.from(colorMap.values());
  const sizes = sortSizes(Array.from(sizeSet)).map((label) => ({ id: label, label }));

  const findVariant = (colorId: string | null, sizeId: string | null) => {
    if (!variants.length) return null;
    return (
      variants.find(
        (variant) =>
          variantMatchesColor(variant, colorId) &&
          variantMatchesSize(variant, sizeId) &&
          variant.stock > 0,
      ) ??
      variants.find(
        (variant) =>
          variantMatchesColor(variant, colorId) && variantMatchesSize(variant, sizeId),
      ) ??
      null
    );
  };

  const isColorAvailable = (colorId: string, selectedSizeId: string | null) =>
    variants.some(
      (variant) =>
        variantMatchesColor(variant, colorId) &&
        variantMatchesSize(variant, selectedSizeId) &&
        variant.stock > 0,
    );

  const isSizeAvailable = (sizeId: string, selectedColorId: string | null) =>
    variants.some(
      (variant) =>
        variantMatchesSize(variant, sizeId) &&
        variantMatchesColor(variant, selectedColorId) &&
        variant.stock > 0,
    );

  return {
    colors,
    sizes,
    hasVariants: variants.length > 0,
    findVariant,
    isColorAvailable,
    isSizeAvailable,
  };
}

export function getVariantDisplayPrice(
  productPrice: StorefrontPrice,
  variant: StorefrontProductVariant | null,
): StorefrontPrice {
  const pricing = getVariantDisplayPricing(productPrice, variant, null);
  return pricing.price;
}

export interface VariantDisplayPricing {
  price: StorefrontPrice;
  originalPrice: StorefrontPrice | null;
  discount: StorefrontDiscount | null;
}

function resolveVariantDiscount(
  product: StorefrontProduct | null,
  price: StorefrontPrice,
  originalPrice: StorefrontPrice | null,
): StorefrontDiscount | null {
  return shouldShowDiscountBadge({
    badgeLabel: product?.discount?.badgeLabel,
    originalPrice,
    currentPrice: price,
  })
    ? (product?.discount ?? null)
    : null;
}

export function getVariantDisplayPricing(
  productPrice: StorefrontPrice,
  variant: StorefrontProductVariant | null,
  product: StorefrontProduct | null,
): VariantDisplayPricing {
  const override = variant?.priceOverride;
  if (override == null) {
    const originalPrice = product?.originalPrice ?? null;
    return {
      price: productPrice,
      originalPrice,
      discount: resolveVariantDiscount(product, productPrice, originalPrice),
    };
  }

  if (typeof override === "number") {
    const price = { amount: override, currency: productPrice.currency };
    const originalPrice = variant?.originalPriceOverride
      ? typeof variant.originalPriceOverride === "number"
        ? { amount: variant.originalPriceOverride, currency: productPrice.currency }
        : variant.originalPriceOverride
      : null;
    return {
      price,
      originalPrice,
      discount: resolveVariantDiscount(product, price, originalPrice),
    };
  }

  const originalFromOverride =
    override.originalAmount != null
      ? { amount: override.originalAmount, currency: override.currency }
      : variant?.originalPriceOverride
        ? typeof variant.originalPriceOverride === "number"
          ? { amount: variant.originalPriceOverride, currency: productPrice.currency }
          : variant.originalPriceOverride
        : null;

  return {
    price: override,
    originalPrice: originalFromOverride,
    discount: resolveVariantDiscount(product, override, originalFromOverride),
  };
}

export function getDefaultVariantSelection(parsed: ParsedProductVariants): {
  colorId: string | null;
  sizeId: string | null;
} {
  const colorId =
    parsed.colors.find((color) => parsed.isColorAvailable(color.id, null))?.id ??
    parsed.colors[0]?.id ??
    null;

  const sizeId =
    parsed.sizes.find((size) => parsed.isSizeAvailable(size.id, colorId))?.id ??
    parsed.sizes[0]?.id ??
    null;

  return { colorId, sizeId };
}
