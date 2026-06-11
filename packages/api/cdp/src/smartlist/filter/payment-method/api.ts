import { mutationOptions } from "@tanstack/react-query";

import { type Fetch } from "@bsport/store-base";

import { SMARTLIST_API_V1 } from "../../constants";
import type {
  CreatePaymentMethodFilterPayload,
  PaymentMethodFilter,
  UpdatePaymentMethodFilterPayload,
  UpsertPaymentMethodFilterVariables,
} from "./types";

const PAYMENT_METHOD_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/payment_method`;

export const createPaymentMethodFilter = async (
  fetch: Fetch<PaymentMethodFilter>,
  payload: CreatePaymentMethodFilterPayload,
): Promise<PaymentMethodFilter> => {
  const { data } = await fetch(`${PAYMENT_METHOD_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchPaymentMethodFilter = async (
  fetch: Fetch<PaymentMethodFilter>,
  filterId: number,
  payload: UpdatePaymentMethodFilterPayload,
): Promise<PaymentMethodFilter> => {
  const { data } = await fetch(
    `${PAYMENT_METHOD_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deletePaymentMethodFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${PAYMENT_METHOD_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

export const createPaymentMethodFilterMutationOptions = (
  fetch: Fetch<PaymentMethodFilter>,
) =>
  mutationOptions({
    mutationFn: (payload: CreatePaymentMethodFilterPayload) =>
      createPaymentMethodFilter(fetch, payload),
  });

export const patchPaymentMethodFilterMutationOptions = (
  fetch: Fetch<PaymentMethodFilter>,
) =>
  mutationOptions({
    mutationFn: ({
      filterId,
      payload,
    }: {
      filterId: number;
      payload: UpdatePaymentMethodFilterPayload;
    }) => patchPaymentMethodFilter(fetch, filterId, payload),
  });

export const upsertPaymentMethodFilterMutationOptions = (
  fetch: Fetch<PaymentMethodFilter>,
) =>
  mutationOptions({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertPaymentMethodFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create payment method filter.");
        }
        return createPaymentMethodFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update payment method filter.");
      }

      return patchPaymentMethodFilter(fetch, filterId, updatePayload);
    },
  });

export const deletePaymentMethodFilterMutationOptions = (fetch: Fetch<void>) =>
  mutationOptions({
    mutationFn: (filterId: number) =>
      deletePaymentMethodFilter(fetch, filterId),
  });
