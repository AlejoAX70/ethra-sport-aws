import { getCategories, getCategoryProducts } from "@/lib/storefront/api";
import { CategoryProductsContent } from "./CategoryProductsContent";

const PAGE_LIMIT = 20;

interface Props {
  params: Promise<{ categoryId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { categoryId } = await params;
  return { title: `Colección — Ethra Sport`, description: `Productos de la colección ${categoryId}` };
}

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params;

  const [categoriesRes, productsRes] = await Promise.all([
    getCategories().catch(() => ({ categories: [] })),
    getCategoryProducts(categoryId, { page: 1, limit: PAGE_LIMIT }).catch(() => ({
      products: [],
      pagination: {
        page: 1,
        limit: PAGE_LIMIT,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    })),
  ]);

  return (
    <CategoryProductsContent
      categoryId={categoryId}
      categories={categoriesRes.categories}
      initialProducts={productsRes.products}
      initialPagination={productsRes.pagination}
    />
  );
}
