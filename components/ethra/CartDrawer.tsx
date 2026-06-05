"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useIsMobile } from "@/hooks/use-mobile";
import { CartItemCard } from "./CartItemCard";
import { CartSummary } from "./CartSummary";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CartEmptyState({
  onClose,
  exploreCtaRef,
}: {
  onClose: () => void;
  exploreCtaRef: React.RefObject<HTMLAnchorElement | null>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <ShoppingBag
        className="h-12 w-12 text-ethra-stone/50"
        strokeWidth={1}
        aria-hidden
      />
      <div className="gold-line mx-auto mt-6 max-w-[60px] w-full" aria-hidden />
      <p className="mt-6 font-serif text-lg text-ethra-charcoal">
        Tu bolsa está vacía
      </p>
      <p className="mt-2 font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
        Descubre piezas esenciales
      </p>
      <Link
        ref={exploreCtaRef}
        href="/colecciones"
        onClick={onClose}
        className="mt-8 border border-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
      >
        EXPLORAR COLECCIONES
      </Link>
    </div>
  );
}

function CartDrawerContent({
  onClose,
  closeRef,
  exploreCtaRef,
}: {
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  exploreCtaRef: React.RefObject<HTMLAnchorElement | null>;
}) {
  const { items, isEmpty, itemCount } = useCart();

  const pieceLabel =
    itemCount === 1 ? "(1 pieza)" : `(${itemCount} piezas)`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-ethra-bone">
      <header className="shrink-0 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-[11px] uppercase tracking-luxury text-ethra-charcoal">
              BOLSA
            </h2>
            {!isEmpty ? (
              <span className="font-display text-[11px] text-ethra-stone">
                {pieceLabel}
              </span>
            ) : null}
          </div>
          <Dialog.Close asChild>
            <button
              ref={closeRef}
              type="button"
              aria-label="Cerrar bolsa"
              className="p-2 text-ethra-stone transition-colors hover:text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </Dialog.Close>
        </div>
        <div className="gold-line mt-5 w-full" aria-hidden />
      </header>

      {isEmpty ? (
        <CartEmptyState onClose={onClose} exploreCtaRef={exploreCtaRef} />
      ) : (
        <>
          <ul
            role="list"
            className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin md:scrollbar-thin"
          >
            {items.map((item) => (
              <CartItemCard
                key={`${item.productId}-${item.variantId ?? "base"}`}
                item={item}
                onClose={onClose}
                onRemovedLastItem={() => exploreCtaRef.current?.focus()}
              />
            ))}
          </ul>
          <CartSummary onEmptied={() => exploreCtaRef.current?.focus()} />
        </>
      )}
    </div>
  );
}

function MobileCartDrawerContent({
  onClose,
  closeRef,
  exploreCtaRef,
}: {
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  exploreCtaRef: React.RefObject<HTMLAnchorElement | null>;
}) {
  const { items, isEmpty, itemCount } = useCart();

  const pieceLabel =
    itemCount === 1 ? "(1 pieza)" : `(${itemCount} piezas)`;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-t-lg bg-ethra-bone">
      <div className="mx-auto mt-3 mb-1 h-1 w-10 shrink-0 rounded-full bg-ethra-stone/30" aria-hidden />

      <header className="shrink-0 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-[11px] uppercase tracking-luxury text-ethra-charcoal">
              BOLSA
            </h2>
            {!isEmpty ? (
              <span className="font-display text-[11px] text-ethra-stone">
                {pieceLabel}
              </span>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar bolsa"
            className="p-2 text-ethra-stone transition-colors hover:text-ethra-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethra-gold focus-visible:ring-offset-2"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="gold-line mt-5 w-full" aria-hidden />
      </header>

      {isEmpty ? (
        <CartEmptyState onClose={onClose} exploreCtaRef={exploreCtaRef} />
      ) : (
        <>
          <ul role="list" className="flex-1 overflow-y-auto px-6 py-4">
            {items.map((item) => (
              <CartItemCard
                key={`${item.productId}-${item.variantId ?? "base"}`}
                item={item}
                onClose={onClose}
                onRemovedLastItem={() => exploreCtaRef.current?.focus()}
              />
            ))}
          </ul>
          <CartSummary onEmptied={() => exploreCtaRef.current?.focus()} />
        </>
      )}
    </div>
  );
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const isMobile = useIsMobile();
  const closeRef = useRef<HTMLButtonElement>(null);
  const exploreCtaRef = useRef<HTMLAnchorElement>(null);
  const { isEmpty } = useCart();
  const wasEmptyRef = useRef(isEmpty);

  const handleClose = () => onOpenChange(false);

  useEffect(() => {
    if (open && closeRef.current) {
      const id = requestAnimationFrame(() => closeRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    const becameEmpty = open && isEmpty && !wasEmptyRef.current;
    wasEmptyRef.current = isEmpty;

    if (becameEmpty) {
      const id = requestAnimationFrame(() => exploreCtaRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open, isEmpty]);

  if (isMobile) {
    return (
      <Drawer.Root
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-60 bg-ethra-black/30 backdrop-blur-[2px]" />
          <Drawer.Content
            className="cart-drawer-mobile fixed inset-x-0 bottom-0 z-61 flex max-h-[85dvh] flex-col rounded-t-lg bg-ethra-bone outline-none"
            aria-describedby={undefined}
          >
            <Drawer.Title className="sr-only">Bolsa de compras</Drawer.Title>
            <MobileCartDrawerContent
              onClose={handleClose}
              closeRef={closeRef}
              exploreCtaRef={exploreCtaRef}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cart-drawer-overlay fixed inset-0 z-60 bg-ethra-black/30 backdrop-blur-[2px]" />
        <Dialog.Content
          className="cart-drawer-panel fixed right-0 top-0 z-61 flex h-dvh w-full max-w-[480px] flex-col bg-ethra-bone shadow-none outline-none focus:outline-none"
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            closeRef.current?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Bolsa de compras</Dialog.Title>
          <CartDrawerContent
            onClose={handleClose}
            closeRef={closeRef}
            exploreCtaRef={exploreCtaRef}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
