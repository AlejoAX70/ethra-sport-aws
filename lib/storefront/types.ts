export interface StorefrontCategoryRef {
  id: string;
  name: string;
}

export interface StorefrontSubcategory extends StorefrontCategoryRef {
  imageUrl: string;
}

export interface StorefrontCategory extends StorefrontCategoryRef {
  imageUrl: string;
  subcategories: StorefrontSubcategory[];
}

export interface StorefrontCategoriesResponse {
  categories: StorefrontCategory[];
}

export interface StorefrontProductImageItem {
  url: string;
  filename: string;
  sortOrder: number;
}

export interface StorefrontProductImages {
  basePath: string;
  primary: string;
  images?: StorefrontProductImageItem[];
}

export interface StorefrontPrice {
  amount: number;
  currency: string;
}

export interface StorefrontTax {
  id: string;
  name: string;
  percentage: number;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  category: StorefrontCategoryRef | null;
  subcategory: StorefrontCategoryRef | null;
  images: StorefrontProductImages;
  price: StorefrontPrice;
  taxes: StorefrontTax[];
  inStock: boolean;
  totalStock: number;
  createdAt: string;
}

export interface StorefrontPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StorefrontCatalogResponse {
  products: StorefrontProduct[];
  pagination: StorefrontPagination;
}

export interface StorefrontSearchResponse {
  products: StorefrontProduct[];
}

export interface StorefrontStoreInfo {
  id: string;
  name: string;
  logoUrl: string;
}

export interface CatalogQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
}
