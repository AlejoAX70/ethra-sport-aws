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
  originalAmount?: number;
}

export type StorefrontDiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface StorefrontDiscount {
  scopeType: "PRODUCT" | "CATEGORY";
  discountType: StorefrontDiscountType;
  value: number;
  badgeLabel: string;
  endsAt?: string | null;
}

export interface StorefrontTax {
  id: string;
  name: string;
  percentage: number;
}

export interface StorefrontVariantColor {
  hex: string;
  name: string;
}

export type StorefrontVariantAttributeValue = string | StorefrontVariantColor;

export interface StorefrontProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, StorefrontVariantAttributeValue>;
  stock: number;
  priceOverride: number | StorefrontPrice | null;
  originalPriceOverride?: number | StorefrontPrice | null;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  category: StorefrontCategoryRef | null;
  subcategory: StorefrontCategoryRef | null;
  images: StorefrontProductImages;
  price: StorefrontPrice;
  originalPrice?: StorefrontPrice;
  discount?: StorefrontDiscount;
  taxes: StorefrontTax[];
  variants?: StorefrontProductVariant[];
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
  paymentsEnabled?: boolean;
  currency?: string;
}

export interface CreateIntentRequest {
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface CreateIntentResponse {
  reference: string;
  amountInCents: number;
  currency: string;
  publicKey: string;
  signature: string;
  environment: "sandbox" | "production";
  redirectUrl: string;
  expirationTime?: number;
}

export interface PaymentStatusResponse {
  status: string;
  saleId: string;
  reference: string;
  updatedAt: string;
}

export interface CatalogQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
}

export interface ContactMessagePayload {
  fullName: string;
  email: string;
  phone?: string | null;
  requestType: 'INQUIRY' | 'COMPLAINT' | 'CLAIM' | 'SUGGESTION' | 'OTHER';
  subject: string;
  message: string;
}

export interface StorefrontBanner {
  id: string;
  bannerType: "MODAL" | "PERSISTENT";
  imageUrl: string;
  altText: string;
  linkType: "PRODUCT" | "CATEGORY";
  productId?: string;
  categoryId?: string;
}

export interface StorefrontBannersResponse {
  modal?: StorefrontBanner;
  persistent?: StorefrontBanner;
}
