import type { z } from "zod";

import type { UseFormControllerOutput } from "@bsport/form";

/** @todo Follow same pattern as in legacy file: libs/giftcard/components/GiftcardFormDrawer/types.ts */
export type GiftcardFormData = {
  // Identity section
  name: string;
  description: string;
  // Pricing section
  price: number | null;
  min_price: number | null;
  max_price: number | null;
  hasCustomPrice: boolean;
};

export type GiftcardFormSchema = z.ZodType<GiftcardFormData>;

export type GiftcardFormMethods = UseFormControllerOutput<GiftcardFormSchema>;
