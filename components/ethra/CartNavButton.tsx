"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { CART_DRAWER_OPEN_EVENT } from "@/lib/cart-drawer";
import { useCart } from "@/hooks/useCart";
import { CartDrawer } from "./CartDrawer";

interface CartNavButtonProps {
  className?: string;
}

export function CartNavButton({ className = "" }: CartNavButtonProps) {
  const { itemCount } = useCart();
  // Estado local: el drawer es UI-only, no requiere coordinación cross-componente.
  // CartContext solo gestiona datos del carrito, no estado de presentación.
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const openDrawer = () => setDrawerOpen(true);
    window.addEventListener(CART_DRAWER_OPEN_EVENT, openDrawer);
    return () => window.removeEventListener(CART_DRAWER_OPEN_EVENT, openDrawer);
  }, []);

  const badgeLabel = itemCount > 9 ? "9+" : String(itemCount);
  const ariaLabel =
    itemCount > 0
      ? `Abrir bolsa de compras, ${itemCount} piezas`
      : "Abrir bolsa de compras, vacía";

  const liveStatus =
    itemCount > 0
      ? `${itemCount} ${itemCount === 1 ? "pieza" : "piezas"} en la bolsa`
      : "La bolsa está vacía";

  return (
    <>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label={ariaLabel}
        className={`relative transition-colors duration-300 hover:text-ethra-gold ${className}`}
      >
        <ShoppingBag className="h-5 w-5" strokeWidth={1.25} aria-hidden />
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {liveStatus}
        </span>
        {itemCount > 0 ? (
          <span
            key={itemCount}
            aria-hidden
            className="cart-badge-pop absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ethra-black font-display text-[9px] text-ethra-bone"
          >
            {badgeLabel}
          </span>
        ) : null}
      </button>
      <CartDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
