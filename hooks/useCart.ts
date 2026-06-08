import { useCallback, useContext, useMemo } from "react";
import { CartContext, type CartItem } from "@/store/cart";

export function useCart(): {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  currency: string;
  isEmpty: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number,
  ) => void;
  clearCart: () => void;
  restoreItems: (items: CartItem[]) => void;
} {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  const { state, dispatch } = context;

  const itemCount = useMemo(
    () => state.items.reduce((acc, item) => acc + item.quantity, 0),
    [state.items],
  );

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (acc, item) => acc + item.price.amount * item.quantity,
        0,
      ),
    [state.items],
  );

  const currency = state.items[0]?.price.currency ?? "COP";
  const isEmpty = state.items.length === 0;

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }),
    [dispatch],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string | null) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } }),
    [dispatch],
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string | null, quantity: number) =>
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, variantId, quantity },
      }),
    [dispatch],
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), [dispatch]);

  const restoreItems = useCallback(
    (items: CartItem[]) => dispatch({ type: "HYDRATE", payload: items }),
    [dispatch],
  );

  return {
    items: state.items,
    itemCount,
    subtotal,
    currency,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    restoreItems,
  };
}
