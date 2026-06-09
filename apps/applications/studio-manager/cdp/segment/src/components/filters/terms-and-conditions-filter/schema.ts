import { z } from "zod";

export const termsAndConditionsFilterSchema = z.object({
  id: z.number().int().positive().optional(),
  smartlist: z.number().int().positive(),
  value: z.boolean(),
});
