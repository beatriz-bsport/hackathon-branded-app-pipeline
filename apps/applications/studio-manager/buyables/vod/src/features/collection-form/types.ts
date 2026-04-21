import type { z } from "zod";

import type { UseFormControllerOutput } from "@bsport/form";

export type CollectionFormData = {
  name: string;
  description: string;
  cover: File | string | null;
};

export type CollectionFormSchema = z.ZodType<CollectionFormData>;

export type CollectionFormMethods =
  UseFormControllerOutput<CollectionFormSchema>;
