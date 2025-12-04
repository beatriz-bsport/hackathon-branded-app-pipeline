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
    credits: z.number().min(0),
    waiting_list_max_size: z.number().min(0),
    // TODO : ADD VALIDATION FOR EFFECTIF BASED ON ROOM BLUEPRINT CAPACITY
    effectif: z.number().min(0),
  }) satisfies SessionCreationFormSchema;
