"use client";

import { useEffect, useRef, useState } from "react";
import type { CreateIntentResponse } from "@/lib/storefront/types";

declare global {
  interface Window {
    WidgetCheckout?: new (config: Record<string, unknown>) => {
      open: (callback: (result: { transaction?: { status?: string } }) => void) => void;
    };
  }
}

const WOMPI_WIDGET_URL = "https://checkout.wompi.co/widget.js";

interface WompiWidgetLauncherProps {
  intent: CreateIntentResponse;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  onComplete: (reference: string) => void;
  onError: (message: string) => void;
  onReady?: () => void;
}

function loadWompiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No browser"));
  if (window.WidgetCheckout) return Promise.resolve();

  const existing = document.querySelector(`script[src="${WOMPI_WIDGET_URL}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar Wompi")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WOMPI_WIDGET_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el widget de pago"));
    document.body.appendChild(script);
  });
}

export function WompiWidgetLauncher({
  intent,
  customer,
  onComplete,
  onError,
  onReady,
}: WompiWidgetLauncherProps) {
  const launched = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (launched.current) return;
    launched.current = true;

    let cancelled = false;

    (async () => {
      try {
        await loadWompiScript();
        if (cancelled || !window.WidgetCheckout) {
          throw new Error("Widget de Wompi no disponible");
        }

        if (!intent.publicKey) {
          throw new Error(
            "Llave pública de Wompi no configurada. Contacta al administrador de la tienda.",
          );
        }

        const checkout = new window.WidgetCheckout({
          currency: intent.currency,
          amountInCents: intent.amountInCents,
          reference: intent.reference,
          publicKey: intent.publicKey,
          signature: { integrity: intent.signature },
          redirectUrl: intent.redirectUrl,
          ...(intent.expirationTime ? { expirationTime: intent.expirationTime } : {}),
          customerData: {
            email: customer.email,
            fullName: customer.fullName,
            phoneNumber: customer.phone,
            phoneNumberPrefix: "+57",
          },
        });

        setLoading(false);
        onReady?.();
        checkout.open(() => {
          onComplete(intent.reference);
        });
      } catch (err) {
        if (!cancelled) {
          onError((err as Error)?.message ?? "Error al abrir el widget de pago");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [intent, customer, onComplete, onError, onReady]);

  if (loading) {
    return null;
  }

  return null;
}
