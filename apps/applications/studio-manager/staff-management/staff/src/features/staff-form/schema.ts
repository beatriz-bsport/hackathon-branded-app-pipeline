import { z } from "zod";

import { RoleType } from "@bsport/common/lib/master-data/user-role";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { StaffFormSchema } from "./types";

type UseStaffFormSchemaParams = {
  isEditMode?: boolean;
};

export const useStaffFormSchema = ({
  isEditMode = false,
}: UseStaffFormSchemaParams = {}): StaffFormSchema => {
  const { t } = useTranslation("staff-form");

  const requiredErrorMessage = t("formFields.errors.required");
  // In edit mode the password field is not rendered (details page shows it as
  // read-only, following legacy behaviour). The field stays in StaffFormData so
  // the create modal can reuse the same schema with the min-length constraint.
  const passwordSchema = isEditMode
    ? z.string()
    : z
        .string()
        .min(
          FIELD_CONSTRAINTS.PASSWORD_MIN_LENGTH,
          t("formFields.errors.passwordTooShort"),
        );

  return z
    .object({
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
      password: passwordSchema,
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
      coachesInRoleIds: z.array(z.string()),
      staffEstablishmentBillingGroup: z.string(),
    })
    .superRefine((data, context) => {
      if (
        Number(data.role) === RoleType.USER_ROLE_QUICKSALE &&
        data.staffEstablishmentBillingGroup === ""
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: requiredErrorMessage,
          path: ["staffEstablishmentBillingGroup"],
        });
      }
    });
};
