import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { StaffFormSchema } from "./types";

export const useStaffFormSchema = (): StaffFormSchema => {
  const { t } = useTranslation("staff-form");

  const requiredErrorMessage = t("formFields.errors.required");

  return z.object({
    firstName: z
      .string()
      .trim()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage),
    lastName: z
      .string()
      .trim()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage),
    email: z
      .string()
      .trim()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
      .email(t("formFields.errors.invalidEmail")),
    password: z
      .string()
      .min(
        FIELD_CONSTRAINTS.PASSWORD_MIN_LENGTH,
        t("formFields.errors.passwordTooShort"),
      ),
    commissionPercentage: z.coerce
      .number()
      .min(
        FIELD_CONSTRAINTS.COMMISSION_MIN,
        t("formFields.errors.commissionRange"),
      )
      .max(
        FIELD_CONSTRAINTS.COMMISSION_MAX,
        t("formFields.errors.commissionRange"),
      )
      .refine(
        (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
        t("formFields.errors.commissionPrecision"),
      ),
    role: z
      .string()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage),
  });
};
