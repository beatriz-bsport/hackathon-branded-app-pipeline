import { z } from "zod";

import type {
  CompanyRolePermissions,
  ObjectLevelPermissions,
} from "@bsport/api-staff-management";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { RoleFormSchema } from "./types";

export const useRoleFormSchema = (): RoleFormSchema => {
  const { t } = useTranslation("role-form");

  const requiredErrorMessage = t("formFields.errors.required");

  return z.object({
    name: z
      .string()
      .trim()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
      .max(
        FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        t("formFields.name.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        }),
      ),
    description: z
      .string()
      .trim()
      .max(
        FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH,
        t("formFields.description.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH,
        }),
      ),
    starterRoleId: z.string().optional(),
    permissions: z.custom<CompanyRolePermissions>(
      (v) => typeof v === "object" && v !== null,
    ),
    objectLevelPermissions: z.custom<ObjectLevelPermissions>(
      (v) => typeof v === "object" && v !== null,
    ),
    hasBookingOverrideControl: z.boolean(),
  });
};
