import { z } from "zod";

import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import {
  FIELD_NAME_MAX_LENGTH,
  TEXTFIELD_MIN_LENGTH,
} from "../PackForm/schema";

export type PackFormNameSchema = z.ZodType<Pick<PackFormData, "name">>;

/**
 * Create the same schema for the Name as in the global schema,
 * to inject in the Edit Name schema.
 */
export const usePackNameSchema = () => {
  const { t } = useTranslation("details");

  return z.object({
    // Identity section
    name: z
      .string()
      .min(TEXTFIELD_MIN_LENGTH, t("formFields.requiredField"))
      .max(FIELD_NAME_MAX_LENGTH, t("formFields.name.errorMaxLength")),
  });
};
