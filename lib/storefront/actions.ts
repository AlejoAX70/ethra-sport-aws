"use server";

import { getCategoryProducts } from "./api";

export async function fetchCategoryProductsPage(
  categoryId: string,
  page: number,
  limit = 20,
) {
  return getCategoryProducts(categoryId, { page, limit });
}
