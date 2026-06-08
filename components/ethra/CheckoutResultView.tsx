"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";
import { paymentStatusQueryOptions } from "@/lib/storefront/queries";

export function CheckoutResultView() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ??
    searchParams.get("id") ??
    "";
  const { clearCart } = useCart();

  const statusQuery = useQuery(paymentStatusQueryOptions(reference));

  const status = statusQuery.data?.status ?? "PENDING";
  const isFinal = useMemo(
    () => ["APPROVED", "DECLINED", "ERROR", "VOIDED", "REFUNDED"].includes(status),
    [status],
  );

  useEffect(() => {
    if (status === "APPROVED") {
      clearCart();
    }
  }, [status, clearCart]);

  const isPolling = !isFinal && !statusQuery.isError;
  const timedOut =
    isPolling &&
    statusQuery.fetchStatus === "idle" &&
    (statusQuery.dataUpdatedAt ?? 0) > 0 &&
    Date.now() - (statusQuery.dataUpdatedAt ?? 0) > 60_000;

  let title = "Procesando tu pago";
  let description = "Estamos confirmando la transacción. Esto puede tardar unos segundos.";
  let tone: "neutral" | "success" | "error" = "neutral";

  if (status === "APPROVED") {
    title = "Pago aprobado";
    description = "Gracias por tu compra. Recibirás confirmación por correo.";
    tone = "success";
  } else if (status === "DECLINED") {
    title = "Pago rechazado";
    description = "Tu banco o la pasarela rechazó el pago. Puedes intentar de nuevo.";
    tone = "error";
  } else if (status === "ERROR" || status === "VOIDED") {
    title = "No se completó el pago";
    description = "Ocurrió un problema con la transacción.";
    tone = "error";
  } else if (statusQuery.isError) {
    title = "No pudimos verificar el pago";
    description = "Si ya pagaste, guardaremos tu referencia y te contactaremos.";
    tone = "error";
  } else if (timedOut) {
    title = "Confirmación en curso";
    description =
      "Tu pago puede tardar un poco más. Revisa tu correo; la referencia quedó registrada.";
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <div
        className={
          tone === "success"
            ? "text-emerald-700"
            : tone === "error"
              ? "text-red-700"
              : "text-ethra-charcoal"
        }
      >
        <h1 className="font-serif text-3xl">{title}</h1>
        <p className="mt-4 font-display text-sm text-ethra-stone">{description}</p>
      </div>

      {reference && (
        <p className="mt-6 font-mono text-xs text-ethra-stone">
          Referencia: {reference}
        </p>
      )}

      {isPolling && !timedOut && (
        <p className="mt-4 font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
          Verificando…
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/catalogo"
          className="border border-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone"
        >
          Volver a la tienda
        </Link>
        {(status === "DECLINED" || status === "ERROR") && (
          <Link
            href="/checkout"
            className="bg-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-bone"
          >
            Reintentar pago
          </Link>
        )}
      </div>
    </div>
  );
}
