import { z } from "zod";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";

export type SessionCreationFormSchema = z.ZodType<SessionCreationFormData>;

// Will merge the schemas for each section here
export const useSessionSchema = () =>
  z.object({
    allowCustomNameAndDescription: z.boolean(),
    name_override: z.string(),
    description_override: z.string(),
    manager_only: z.boolean(),
  }) satisfies SessionCreationFormSchema;
