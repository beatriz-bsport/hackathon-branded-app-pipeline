import { z } from "zod";

import { GenderFilterValue } from "@bsport/api-cdp/smartlist";

import { GENDER_OPTIONS } from "./constants";

export const genderFilterSchema = z.object({
  id: z.number().int().positive().optional(),
  smartlist: z.number().int().positive(),
  value: z.enum([GENDER_OPTIONS.male, GENDER_OPTIONS.female]),
});

export const genderFilterValueSchema = z.enum([
  GenderFilterValue.MALE,
  GenderFilterValue.FEMALE,
]);
