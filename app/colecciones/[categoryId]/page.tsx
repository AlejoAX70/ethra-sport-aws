import { CategoryProductsContent } from "./CategoryProductsContent";

interface Props {
  params: Promise<{ categoryId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { categoryId } = await params;
  return { title: `Colección — Ethra Sport`, description: `Productos de la colección ${categoryId}` };
}

export default function CategoryPage() {
  return <CategoryProductsContent />;
}
