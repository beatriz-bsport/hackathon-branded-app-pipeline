import { z } from "zod";

import type { DiscountState } from "#src/stores/booking-flow/types";
import { useTranslation } from "#src/utils/i18n";

export type DiscountErrors = {
  reason?: string;
  value?: string;
};
const ERROR_MESSAGES = {
  EMPTY_REASON: "emptyReason",
  PERCENTAGE_TOO_HIGH: "percentageTooHigh",
  AMOUNT_EXCEEDS_PRICE: "amountExceedsPrice",
} as const;

export const discountSchema = (passPrice: number | null) =>
  z
    .object({
      reason: z.string().min(1, ERROR_MESSAGES.EMPTY_REASON),
      type: z.enum(["percentage", "amount"]),
      value: z.number(),
    })
    .refine(
      (data) => {
        if (data.type === "percentage") return data.value <= 100;
        if (data.type === "amount" && passPrice !== null)
          return data.value <= passPrice;
        return true;
      },
      (data) => ({
        message:
          data.type === "percentage"
            ? ERROR_MESSAGES.PERCENTAGE_TOO_HIGH
            : ERROR_MESSAGES.AMOUNT_EXCEEDS_PRICE,
        path: ["value"],
      }),
    );

export const hasDiscountErrors = (
  discount: DiscountState | null,
  passPrice: number | null,
): boolean => {
  if (!discount?.enabled) return false;
  return !discountSchema(passPrice).safeParse(discount).success;
};

export const useDiscountErrors = (
  discount: DiscountState | null,
  passPrice: number | null,
): DiscountErrors => {
  const { t } = useTranslation("sessionManagement");
  if (!discount?.enabled) return {};

  const result = discountSchema(passPrice).safeParse(discount);
  if (result.success) return {};

  const errors: DiscountErrors = {};
  const errorMap: Record<string, () => void> = {
    [ERROR_MESSAGES.EMPTY_REASON]: () => {
      errors.reason = t("bookingFlow.newPass.errors.reasonRequired");
    },
    [ERROR_MESSAGES.PERCENTAGE_TOO_HIGH]: () => {
      errors.value = t("bookingFlow.newPass.errors.exceedsPercentage");
    },
    [ERROR_MESSAGES.AMOUNT_EXCEEDS_PRICE]: () => {
      errors.value = t("bookingFlow.newPass.errors.exceedsPrice");
    },
  };

  for (const issue of result.error.issues) {
    errorMap[issue.message]?.();
  }
  return errors;
};
