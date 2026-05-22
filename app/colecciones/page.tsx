import { getCategories } from "@/lib/storefront/api";
import { ColeccionesContent } from "./ColeccionesContent";

export const metadata = {
  title: "Colecciones — Ethra Sport",
  description: "Explora las colecciones de ropa deportiva de lujo silencioso de Ethra Sport.",
};

export default async function ColeccionesPage() {
  const { categories } = await getCategories().catch(() => ({ categories: [] }));

  return <ColeccionesContent categories={categories} />;
}
