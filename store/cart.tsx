"use client";

import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "ethra_cart";

export interface CartItem {
  productId: string;
  variantId: string | null;
  sku: string | null;
  name: string;
  imageUrl: string;
  categoryName: string;
  price: { amount: number; currency: string };
  selectedColor: { id: string; hex: string; name: string } | null;
  selectedSize: { id: string; label: string } | null;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantId: string | null } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; variantId: string | null; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

export interface CartContextValue {
  state: CartState;
  dispatch: Dispatch<CartAction>;
}

function itemKey(productId: string, variantId: string | null): string {
  return `${productId}::${variantId ?? ""}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isVariantColor(
  value: unknown,
): value is { id: string; hex: string; name: string } {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.hex === "string" &&
    typeof value.name === "string"
  );
}

function isVariantSize(value: unknown): value is { id: string; label: string } {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string"
  );
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) return false;

  const price = value.price;
  if (
    !isRecord(price) ||
    typeof price.amount !== "number" ||
    !Number.isFinite(price.amount) ||
    typeof price.currency !== "string"
  ) {
    return false;
  }

  const quantity = value.quantity;
  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 10
  ) {
    return false;
  }

  if (
    typeof value.productId !== "string" ||
    (value.variantId !== null && typeof value.variantId !== "string") ||
    (value.sku !== null && typeof value.sku !== "string") ||
    typeof value.name !== "string" ||
    typeof value.imageUrl !== "string"
  ) {
    return false;
  }

  const color = value.selectedColor;
  if (color !== null && !isVariantColor(color)) return false;

  const size = value.selectedSize;
  if (size !== null && !isVariantSize(size)) return false;

  return true;
}

function normalizeCartItem(item: CartItem & { categoryName?: string }): CartItem {
  return {
    ...item,
    categoryName:
      typeof item.categoryName === "string" ? item.categoryName : "",
    quantity: Math.min(10, Math.max(1, item.quantity)),
  };
}

export function parseStoredCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isCartItem).map(normalizeCartItem);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = itemKey(action.payload.productId, action.payload.variantId);
      const existingIndex = state.items.findIndex(
        (item) => itemKey(item.productId, item.variantId) === key,
      );

      if (existingIndex >= 0) {
        const items = [...state.items];
        const existing = items[existingIndex];
        const nextQty = Math.min(10, existing.quantity + action.payload.quantity);
        items[existingIndex] = { ...existing, quantity: nextQty };
        return { items };
      }

      return {
        items: [
          ...state.items,
          { ...action.payload, quantity: Math.min(10, action.payload.quantity) },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.variantId === action.payload.variantId
            ),
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity < 1 || action.payload.quantity > 10) {
        return state;
      }
      return {
        items: state.items.map((item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    case "HYDRATE":
      return { items: parseStoredCartItems(action.payload) };
    default:
      return state;
  }
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      const items = parseStoredCartItems(parsed);
      if (items.length > 0) {
        dispatch({ type: "HYDRATE", payload: items });
      }
    } catch {
      // JSON inválido — carrito vacío
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // quota exceeded, etc.
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
  );
}
