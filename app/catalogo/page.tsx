import { ShopLayout } from "@/components/ethra/ShopLayout";
import { getCatalog, getCategories, searchCatalog } from "@/lib/storefront/api";
import type { StorefrontPagination, StorefrontProduct } from "@/lib/storefront/types";
import { CatalogoContent } from "./CatalogoContent";

export const metadata = {
  title: "Catálogo — Ethra Sport",
  description: "Explora el catálogo completo de Ethra Sport.",
};

interface Props {
  searchParams: Promise<{ page?: string; categoryId?: string; q?: string }>;
}

const emptyPagination: StorefrontPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

export default async function CatalogoPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const categoryId = sp.categoryId || undefined;
  const q = sp.q?.trim() || "";

  const categoriesRes = await getCategories().catch(() => ({ categories: [] }));

  let products: StorefrontProduct[] = [];
  let pagination: StorefrontPagination | null = null;

  if (q) {
    const searchRes = await searchCatalog(q, 20).catch(() => ({ products: [] }));
    products = searchRes.products;
  } else {
    const catalogRes = await getCatalog({ page, limit: 20, categoryId }).catch(() => ({
      products: [],
      pagination: emptyPagination,
    }));
    products = catalogRes.products;
    pagination = catalogRes.pagination;
  }

  return (
    <ShopLayout>
      <CatalogoContent
        categories={categoriesRes.categories}
        products={products}
        pagination={pagination}
        page={page}
        categoryId={categoryId}
        q={q}
      />
    </ShopLayout>
  );
}
