"use server";

import { getCategoryProducts, createPaymentIntent, getPaymentStatus } from "./api";
import type { CreateIntentRequest, CreateIntentResponse, PaymentStatusResponse } from "./types";
import { StorefrontApiError } from "./client";

export async function fetchCategoryProductsPage(
  categoryId: string,
  page: number,
  limit = 20,
) {
  return getCategoryProducts(categoryId, { page, limit });
}

export type PaymentIntentActionResult =
  | { ok: true; data: CreateIntentResponse }
  | { ok: false; status: number; message: string; data?: unknown };

export async function createPaymentIntentAction(
  dto: CreateIntentRequest,
): Promise<PaymentIntentActionResult> {
  try {
    const data = await createPaymentIntent(dto);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof StorefrontApiError) {
      return { ok: false, status: err.status, message: err.message, data: err.data };
    }
    return { ok: false, status: 500, message: (err as Error)?.message ?? "Error desconocido" };
  }
}

export type PaymentStatusActionResult =
  | { ok: true; data: PaymentStatusResponse }
  | { ok: false; status: number; message: string };

export async function getPaymentStatusAction(
  reference: string,
): Promise<PaymentStatusActionResult> {
  try {
    const data = await getPaymentStatus(reference);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof StorefrontApiError) {
      return { ok: false, status: err.status, message: err.message };
    }
    return { ok: false, status: 500, message: (err as Error)?.message ?? "Error desconocido" };
  }
}
