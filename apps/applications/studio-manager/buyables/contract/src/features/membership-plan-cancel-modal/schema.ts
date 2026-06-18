import { z } from "zod";

import type { UseFormControllerOutput } from "@bsport/form";

import { useTranslation } from "#src/utils/i18n";

export const FIELD_CONSTRAINTS = {
  REASON_MIN_LENGTH: 1,
  REASON_MAX_LENGTH: 100,
};

export type MembershipPlanCancelFormData = {
  fromInvoiceId: number | null;
  reason: string;
};

export type MembershipPlanCancelFormSchema =
  z.ZodType<MembershipPlanCancelFormData>;

export type MembershipPlanCancelFormMethods =
  UseFormControllerOutput<MembershipPlanCancelFormSchema>;

export const useDefaultData = (): MembershipPlanCancelFormData => ({
  fromInvoiceId: null,
  reason: "",
});

export const useMembershipPlanCancelFormSchema = () => {
  const { t } = useTranslation("membership-plan");
  const requiredFieldErrorMessage = t("cancelModal.requiredField");

  return z.object({
    reason: z
      .string()
      .trim()
      .min(FIELD_CONSTRAINTS.REASON_MIN_LENGTH, requiredFieldErrorMessage)
      .max(
        FIELD_CONSTRAINTS.REASON_MAX_LENGTH,
        t("cancelModal.reasonField.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.REASON_MAX_LENGTH,
        }),
      ),
    // Optional: when left unset, the cancellation takes effect at the end of
    // the current period rather than from a chosen upcoming invoice.
    fromInvoiceId: z.number().nullable(),
  }) satisfies MembershipPlanCancelFormSchema;
};
