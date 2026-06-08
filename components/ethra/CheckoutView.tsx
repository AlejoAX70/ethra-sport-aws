"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckoutSummary } from "./CheckoutSummary";
import { WompiWidgetLauncher } from "./WompiWidgetLauncher";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Nombre requerido").max(255),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().min(7, "Teléfono requerido").max(64),
  address: z.string().min(5, "Dirección requerida").max(500),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutView() {
  const { items, isEmpty } = useCart();
  const { phase, error, intent, lineErrors, submit, onWidgetClosed, reset, isSubmitting } =
    useCheckout(items);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (isEmpty && phase === "idle") {
      toast.message("Tu bolsa está vacía");
    }
  }, [isEmpty, phase]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await submit(values);
  });

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="font-serif text-xl text-ethra-charcoal">No hay productos en tu bolsa</p>
        <Link
          href="/catalogo"
          className="mt-8 inline-block border border-ethra-black px-8 py-3 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-black transition-colors hover:bg-ethra-black hover:text-ethra-bone"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="font-serif text-3xl text-ethra-black">Checkout</h1>
        <p className="mt-2 font-display text-[11px] uppercase tracking-luxury text-ethra-stone">
          Datos de envío y contacto
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
              Nombre completo
            </label>
            <input
              id="fullName"
              {...form.register("fullName")}
              className="w-full border border-ethra-stone/30 bg-transparent px-4 py-3 font-display text-sm text-ethra-black outline-none focus:border-ethra-black"
            />
            {form.formState.errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...form.register("email")}
              className="w-full border border-ethra-stone/30 bg-transparent px-4 py-3 font-display text-sm text-ethra-black outline-none focus:border-ethra-black"
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
              Teléfono
            </label>
            <input
              id="phone"
              {...form.register("phone")}
              className="w-full border border-ethra-stone/30 bg-transparent px-4 py-3 font-display text-sm text-ethra-black outline-none focus:border-ethra-black"
            />
            {form.formState.errors.phone && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="mb-1.5 block font-display text-[10px] uppercase tracking-luxury text-ethra-stone">
              Dirección de envío
            </label>
            <textarea
              id="address"
              rows={3}
              {...form.register("address")}
              className="w-full resize-none border border-ethra-stone/30 bg-transparent px-4 py-3 font-display text-sm text-ethra-black outline-none focus:border-ethra-black"
            />
            {form.formState.errors.address && (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.address.message}</p>
            )}
          </div>

          {error && (
            <div className="border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
              {lineErrors.length > 0 && (
                <ul className="mt-2 list-disc pl-4">
                  {lineErrors.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
              {phase === "error" && (
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 font-display text-[10px] uppercase tracking-luxury underline"
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ethra-black px-6 py-4 font-display text-[11px] uppercase tracking-[0.14em] text-ethra-bone transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Procesando…" : "Pagar con Wompi"}
          </button>
        </form>

        {intent && phase === "widget_open" && (
          <div className="mt-6">
            <WompiWidgetLauncher
              intent={intent}
              customer={{
                fullName: form.getValues("fullName"),
                email: form.getValues("email"),
                phone: form.getValues("phone"),
              }}
              onComplete={onWidgetClosed}
              onError={(msg) => toast.error(msg)}
            />
          </div>
        )}
      </section>

      <CheckoutSummary />
    </div>
  );
}
