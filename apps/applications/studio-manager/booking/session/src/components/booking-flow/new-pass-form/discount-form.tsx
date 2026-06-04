import { type ChangeEvent, type FC } from "react";

import { Pass } from "@bsport/api-buyables";
import { getCurrencyDisplay } from "@bsport/currency";
import {
  FormRadioGroup,
  TextArea,
  TextField,
} from "@bsport/kaizen-primitive-core";

import { setDiscount } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { getPassPrice } from "#src/utils/get-pass-price";
import { useTranslation } from "#src/utils/i18n";

import { useDiscountErrors } from "./get-discount-errors";

const DISCOUNT_REASON_MAX_LENGTH = 100;
const MIN_DISCOUNT = 0;

export const DiscountForm: FC<{ selectedPass?: Pass }> = ({ selectedPass }) => {
  const { t } = useTranslation("sessionManagement");

  const discount = useBookingFlowStore((state) => state.discount);

  const passPrice = selectedPass ? getPassPrice(selectedPass) : null;

  const discountErrors = useDiscountErrors(discount, passPrice);

  const handleDiscountTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value || !discount) return;
    setDiscount({
      ...discount,
      type: event.target.value as "percentage" | "amount",
      value: 0,
    });
  };

  const handleDiscountValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!discount) return;
    const numValue = Number.parseFloat(event.target.value) || 0;
    setDiscount({ ...discount, value: numValue });
  };

  const handleDiscountReasonChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (!discount) return;
    setDiscount({ ...discount, reason: event.target.value });
  };

  if (!discount?.enabled) return null;

  return (
    <div className="flex flex-col gap-sm">
      <FormRadioGroup
        id="discount-radio-group"
        onChange={handleDiscountTypeChange}
        value={discount.type}
        options={[
          {
            value: "percentage",
            label: t("bookingFlow.newPass.discountPercentage"),
            element: (
              <TextField
                id="discount-value-input-percentage"
                type="number"
                value={
                  discount.type === "percentage" ? String(discount.value) : "0"
                }
                min={MIN_DISCOUNT}
                onChange={handleDiscountValueChange}
                suffix={{
                  type: "text",
                  value: "%",
                }}
                disabled={discount.type !== "percentage"}
                status={
                  discount.type === "percentage" && discountErrors.value
                    ? "error"
                    : undefined
                }
                statusText={
                  discount.type === "percentage"
                    ? discountErrors.value
                    : undefined
                }
              />
            ),
          },
          {
            value: "amount",
            label: t("bookingFlow.newPass.discountAmount"),
            element: (
              <TextField
                id="discount-value-input-amount"
                type="number"
                min={MIN_DISCOUNT}
                value={
                  discount.type === "amount" ? String(discount.value) : "0"
                }
                onChange={handleDiscountValueChange}
                suffix={{
                  type: "text",
                  value: getCurrencyDisplay(),
                }}
                disabled={discount.type !== "amount"}
                status={
                  discount.type === "amount" && discountErrors.value
                    ? "error"
                    : undefined
                }
                statusText={
                  discount.type === "amount" ? discountErrors.value : undefined
                }
              />
            ),
          },
        ]}
      />

      <TextArea
        id="discount-reason-input"
        label={t("bookingFlow.newPass.discountReasonLabel")}
        value={discount.reason}
        required
        onChange={handleDiscountReasonChange}
        maxLength={DISCOUNT_REASON_MAX_LENGTH}
        helperText={t("bookingFlow.newPass.discountReasonHelperText", {
          charactersCount: discount.reason.length,
          maxLength: DISCOUNT_REASON_MAX_LENGTH,
        })}
        status={discountErrors.reason ? "error" : undefined}
        statusText={discountErrors.reason}
      />
    </div>
  );
};
