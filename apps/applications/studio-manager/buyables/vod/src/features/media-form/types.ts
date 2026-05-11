import type { z } from "zod";

import type { UseFormControllerOutput } from "@bsport/form";

export type MediaFormData = {
  name: string;
  description: string;
  credit_price: number;
  manager_only: boolean;
  is_rental: boolean;
  rental_days: number;
  cover: File | string | null;
  category: number | null;
  level: number | null;
  coaches: number[];
};

export type MediaFormSchema = z.ZodType<MediaFormData>;

export type MediaFormMethods = UseFormControllerOutput<MediaFormSchema>;
