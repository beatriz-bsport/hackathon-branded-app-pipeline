import type { z } from "zod";

import type { UseFormControllerOutput } from "@bsport/form";

export type GiftcardFormData = {
  // Identity section
  name: string;
  description: string;
  cover: File | string | null;
  // Pricing section
  price: number | null;
  min_price: number | null;
  max_price: number | null;
  hasCustomPrice: boolean;
  available_payment_method_identifiers: number[];
  bookkeeping_account: number | null;
  // Expiration Days section
  hasExpirationDays: boolean; // -> Control the toggle
  expiration_days: number | null;
  // Visibility
  manager_only: boolean;
  // Advanced
  tags_on_consumer_item_creation: number[];
};

export type GiftcardFormSchema = z.ZodType<GiftcardFormData>;

export type GiftcardFormMethods = UseFormControllerOutput<GiftcardFormSchema>;
