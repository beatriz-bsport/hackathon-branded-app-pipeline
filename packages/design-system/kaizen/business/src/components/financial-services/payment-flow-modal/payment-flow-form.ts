import { z } from "zod";

import { getLocalNow } from "@bsport/datetime-manipulation";
import type { SelectedDate } from "@bsport/kaizen-primitive-core";

import {
  DEFAULT_MANUAL_PAYMENT_METHOD,
  type ManualMethodType,
} from "./payment-methods/manual/types";

export type PaymentTab = "one-time" | "installments";

export const INVOICE_ALREADY_PAID_ALERT = "This invoice is already paid.";

const manualMethodTypeSchema = z.enum([
  "card_manual_machine",
  "cash",
  "check",
  "vacation_check",
  "transfer",
  "american_express",
  "other",
  "client_credit_balance",
]);

const selectedDateSchema = z.custom<SelectedDate>();

export const paymentFlowFormSchema = z.object({
  savePaymentMethod: z.boolean(),
  terminalReaderId: z.string().nullable(),
  selectedGiftCardId: z.number().nullable(),
  manualType: manualMethodTypeSchema,
  manualDate: selectedDateSchema,
  manualNote: z.string(),
});

type PaymentFlowFormValues = z.infer<typeof paymentFlowFormSchema> & {
  manualType: ManualMethodType;
};

export const getPaymentFlowDefaultValues = (): PaymentFlowFormValues => ({
  savePaymentMethod: false,
  terminalReaderId: null,
  selectedGiftCardId: null,
  manualType: DEFAULT_MANUAL_PAYMENT_METHOD,
  manualDate: getLocalNow({}),
  manualNote: "",
});
