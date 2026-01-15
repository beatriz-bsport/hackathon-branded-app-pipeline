import { z } from "zod";

/** @todo Follow same pattern as in legacy file: libs/giftcard/components/GiftcardFormDrawer/types.ts */
export type GiftcardFormData = {
  name: string;
  description: string;
};

export type GiftcardFormSchema = z.ZodType<GiftcardFormData>;
