"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatStorefrontPrice } from "@/lib/storefront/format";
import type { CartItem } from "@/store/cart";

const ITEM_REMOVE_MS = 300;

interface CartItemCardProps {
  item: CartItem;
  onClose: () => void;
  onRemovedLastItem?: () => void;
}

export function CartItemCard({
  item,
  onClose,
  onRemovedLastItem,
}: CartItemCardProps) {
  const { items, updateQuantity, removeItem } = useCart();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const rowRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!confirmDelete) return;
    const timer = window.setTimeout(() => setConfirmDelete(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirmDelete]);

  const colorName = item.selectedColor?.name ?? "";
  const sizeLabel = item.selectedSize?.label ?? "";
  const variantParts = [
    colorName,
    sizeLabel ? `Talla ${sizeLabel}` : "",
  ].filter(Boolean);
  const variantLabel = variantParts.join(" · ");

  const lineSubtotal = item.price.amount * item.quantity;

  const handleConfirmRemove = () => {
    setConfirmDelete(false);
    const row = rowRef.current;
    if (row) {
      row.style.setProperty("--cart-item-height", `${row.getBoundingClientRect().height}px`);
    }
    setIsRemoving(true);
    window.setTimeout(() => {
      const willBeEmpty = items.length === 1;
      removeItem(item.productId, item.variantId);
      if (willBeEmpty) {
        onRemovedLastItem?.();
      }
    }, ITEM_REMOVE_MS);
  };

  return (
    <li
      ref={rowRef}
      role="listitem"
      className={`flex gap-4 border-b border-border/40 py-5 last:border-b-0 overflow-hidden ${
        isRemoving ? "cart-item-exit" : "cart-item-enter"
      }`}
    >
      <Link
        href={`/producto/${item.productId}`}
        onClick={onClose}
        className="relative block h-[72px] w-[56px] shrink-0 bg-[#f3f3f3] md:h-24 md:w-[72px]"
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="72px"
          className="object-contain p-1"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-sans text-[13px] leading-snug text-ethra-black">
          {item.name}
        </p>
        {item.categoryName ? (
          <p className="mt-0.5 font-display text-[10px] uppercase tracking-wider text-ethra-stone">
            {item.categoryName}
          </p>
        ) : null}
        {variantLabel ? (
          <p className="mt-1.5 flex items-center gap-1.5 font-display text-[10px] text-ethra-charcoal">
            {item.selectedColor ? (
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full border border-ethra-stone/30"
                style={{ backgroundColor: item.selectedColor.hex }}
                aria-hidden
              />
            ) : null}
            <span>{variantLabel}</span>
          </p>
        ) : null}
        <p className="mt-1 font-display text-[11px] text-ethra-stone">
          {formatStorefrontPrice(item.price)}
        </p>

        <div className="mt-3 flex items-center gap-1">
          <button
            type="button"
            disabled={item.quantity === 1 || isRemoving}
            onClick={() =>
              item.quantity > 1 &&
              updateQuantity(item.productId, item.variantId, item.quantity - 1)
            }
            aria-label={`Reducir cantidad de ${item.name}`}
            className="p-2.5 text-ethra-charcoal transition-opacity hover:text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 md:p-2"
          >
            <Minus className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          </button>
          <span className="w-6 text-center font-display text-[12px] font-medium text-ethra-black">
            {item.quantity}
          </span>
          <button
            type="button"
            disabled={item.quantity >= 10 || isRemoving}
            onClick={() => {
              if (item.quantity < 10) {
                updateQuantity(item.productId, item.variantId, item.quantity + 1);
              }
            }}
            aria-label={`Aumentar cantidad de ${item.name}`}
            className="p-2.5 text-ethra-charcoal transition-opacity hover:text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 md:p-2"
          >
            <Plus className="h-3 w-3" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        {item.quantity > 1 ? (
          <p className="cart-subtotal-fade mt-2 font-display text-[12px] font-semibold text-ethra-black">
            {formatStorefrontPrice({
              amount: lineSubtotal,
              currency: item.price.currency,
            })}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 self-start">
        {confirmDelete ? (
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleConfirmRemove}
              aria-label={`Confirmar eliminación de ${item.name}`}
              className="font-display text-[9px] uppercase text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
            >
              SÍ
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              aria-label="Cancelar eliminación"
              className="font-display text-[9px] uppercase text-ethra-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
            >
              NO
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isRemoving}
            onClick={() => setConfirmDelete(true)}
            aria-label={`Eliminar ${item.name} de la bolsa`}
            className="p-2 text-ethra-stone/50 transition-colors hover:text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
          </button>
        )}
      </div>
    </li>
  );
}
