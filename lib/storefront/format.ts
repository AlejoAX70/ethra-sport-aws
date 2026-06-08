import type {
  StorefrontCategory,
  StorefrontPrice,
  StorefrontProduct,
} from "./types";
import { toCdnImageUrl } from "@/lib/cdn";

export type CatalogSortOption = "newest" | "name-asc" | "price-asc" | "price-desc";

export interface CategoryNavItem {
  id: string;
  name: string;
}

export interface CategoryPageContext {
  title: string;
  navItems: CategoryNavItem[];
  activeId: string;
}

export function formatStorefrontPrice(price: StorefrontPrice): string {
  const hasDecimals = !Number.isInteger(price.amount);
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(price.amount);
  } catch {
    return `COP ${price.amount.toLocaleString("es-CO")}`;
  }
}

/** Convierte monto en pesos COP a centavos (consistente con backend). */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function formatCatalogGridPrice(price: StorefrontPrice): string {
  const amount = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price.amount)
    .replace(/,/g, ".");

  return `$ ${amount}`;
}

export function getProductCategoryLabel(product: StorefrontProduct): string {
  return product.subcategory?.name ?? product.category?.name ?? "";
}

export function getProductImageUrl(product: StorefrontProduct): string {
  return toCdnImageUrl(product.images.primary || product.images.basePath);
}

export function getProductGalleryUrls(product: StorefrontProduct): string[] {
  const gallery =
    product.images.images
      ?.slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => toCdnImageUrl(img.url))
      .filter(Boolean) ?? [];

  if (gallery.length > 0) return gallery;

  const primary = getProductImageUrl(product);
  return primary ? [primary] : [];
}

export function resolveCategoryPageContext(
  categories: StorefrontCategory[],
  categoryId: string,
): CategoryPageContext {
  const parentCategory = categories.find((category) => category.id === categoryId);

  if (parentCategory) {
    const navItems =
      parentCategory.subcategories.length > 0
        ? [
            { id: parentCategory.id, name: "Todos" },
            ...parentCategory.subcategories.map((subcategory) => ({
              id: subcategory.id,
              name: subcategory.name,
            })),
          ]
        : categories.map((category) => ({ id: category.id, name: category.name }));

    return {
      title: parentCategory.name,
      navItems,
      activeId: parentCategory.id,
    };
  }

  for (const category of categories) {
    const subcategory = category.subcategories.find((item) => item.id === categoryId);
    if (subcategory) {
      return {
        title: subcategory.name,
        navItems: [
          { id: category.id, name: "Todos" },
          ...category.subcategories.map((item) => ({ id: item.id, name: item.name })),
        ],
        activeId: subcategory.id,
      };
    }
  }

  return {
    title: "Colección",
    navItems: categories.map((category) => ({ id: category.id, name: category.name })),
    activeId: categoryId,
  };
}

export function sortCatalogProducts(
  products: StorefrontProduct[],
  sort: CatalogSortOption,
): StorefrontProduct[] {
  const sorted = [...products];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
    case "price-asc":
      return sorted.sort((a, b) => a.price.amount - b.price.amount);
    case "price-desc":
      return sorted.sort((a, b) => b.price.amount - a.price.amount);
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}
