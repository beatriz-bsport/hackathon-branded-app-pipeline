import { z } from "zod";

import type { SelectableNotificationType } from "#src/utils/types";

import type { TriggerConfigValidationFormData } from "./types";

export const triggerConfigValidationSchema = z.object({
  itemIds: z.array(z.number()).optional(),
  notificationType: z.custom<SelectableNotificationType>(),
}) satisfies z.ZodType<TriggerConfigValidationFormData>;

export type triggerConfigValidationFormSchema = z.infer<
  typeof triggerConfigValidationSchema
>;
