import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreatePaymentPackFilterPayload,
  PaymentPackFilter,
  UpdatePaymentPackFilterPayload,
} from "./types";

const PAYMENT_PACK_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/payment_pack`;

export const createPaymentPackFilter = async (
  fetch: Fetch<PaymentPackFilter>,
  payload: CreatePaymentPackFilterPayload,
): Promise<PaymentPackFilter> => {
  const { data } = await fetch(`${PAYMENT_PACK_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchPaymentPackFilter = async (
  fetch: Fetch<PaymentPackFilter>,
  filterId: number,
  payload: UpdatePaymentPackFilterPayload,
): Promise<PaymentPackFilter> => {
  const { data } = await fetch(`${PAYMENT_PACK_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deletePaymentPackFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${PAYMENT_PACK_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
