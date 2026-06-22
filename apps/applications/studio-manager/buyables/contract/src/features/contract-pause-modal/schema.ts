import { z } from "zod";

import type { DateTime } from "@bsport/datetime-manipulation";
import { UseFormControllerOutput } from "@bsport/form";

import { useToday } from "#src/utils/date";
import { useTranslation } from "#src/utils/i18n";

export const FIELD_CONSTRAINTS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
};

export type ContractPauseFormData = {
  dateRange: [DateTime | null, DateTime | null];
  name: string;
};

export type ContractPauseFormSchema = z.ZodType<ContractPauseFormData>;

export type ContractPauseFormMethods =
  UseFormControllerOutput<ContractPauseFormSchema>;

export const useDefaultData = (): ContractPauseFormData => {
  const today = useToday();
  return {
    name: "",
    dateRange: [today, today],
  };
};

export const useContractPauseFormSchema = () => {
  const { t } = useTranslation("contract-features");
  const requiredFieldErrorMessage = t("pauseModal.requiredField");

  const dateTime = z.custom<DateTime | null>();

  return z.object({
    name: z
      .string()
      .min(FIELD_CONSTRAINTS.NAME_MIN_LENGTH, requiredFieldErrorMessage)
      .max(
        FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        t("pauseModal.reasonField.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        }),
      ),
    dateRange: z
      .tuple([dateTime, dateTime])
      .refine(
        ([fromDate, untilDate]) => fromDate != null && untilDate != null,
        {
          message: requiredFieldErrorMessage,
        },
      )
      .refine(
        ([fromDate, untilDate]) =>
          !(fromDate && untilDate && fromDate > untilDate),
        {
          message: t("pauseModal.periodField.errorInterval"),
        },
      ),
  }) satisfies ContractPauseFormSchema;
};
