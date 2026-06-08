"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createPaymentIntent } from "@/lib/storefront/api";
import type { CreateIntentResponse } from "@/lib/storefront/types";
import { StorefrontApiError } from "@/lib/storefront/client";
import type { CartItem } from "@/store/cart";

export type CheckoutPhase =
  | "idle"
  | "creating_intent"
  | "widget_open"
  | "processing"
  | "approved"
  | "declined"
  | "error";

export interface GuestCheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export function useCheckout(items: CartItem[]) {
  const router = useRouter();
  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<CreateIntentResponse | null>(null);
  const [lineErrors, setLineErrors] = useState<string[]>([]);

  const submit = useCallback(
    async (customer: GuestCheckoutForm) => {
      if (phase === "creating_intent" || phase === "widget_open") return;

      setError(null);
      setLineErrors([]);
      setPhase("creating_intent");

      try {
        const payload = {
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? undefined,
            quantity: item.quantity,
          })),
          customer,
        };

        const response = await createPaymentIntent(payload);
        setIntent(response);
        setPhase("widget_open");
        return response;
      } catch (err) {
        if (err instanceof StorefrontApiError) {
          if (err.status === 409) {
            setError("Pagos no disponibles para esta tienda.");
          } else if (err.status === 422) {
            const data = err.data as { lines?: string[]; message?: string } | undefined;
            setLineErrors(data?.lines ?? []);
            setError(data?.message ?? "Algunos productos cambiaron. Revisa tu bolsa.");
          } else {
            setError(err.message);
          }
        } else {
          setError((err as Error)?.message ?? "No se pudo iniciar el pago.");
        }
        setPhase("error");
        return null;
      }
    },
    [items, phase],
  );

  const onWidgetClosed = useCallback(
    (reference: string) => {
      setPhase("processing");
      router.push(`/checkout/resultado?reference=${encodeURIComponent(reference)}`);
    },
    [router],
  );

  const reset = useCallback(() => {
    setPhase("idle");
    setError(null);
    setIntent(null);
    setLineErrors([]);
  }, []);

  return {
    phase,
    error,
    intent,
    lineErrors,
    submit,
    onWidgetClosed,
    reset,
    isSubmitting: phase === "creating_intent" || phase === "widget_open",
  };
}
