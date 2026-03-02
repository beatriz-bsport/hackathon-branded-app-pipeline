import React, { useId } from "react";

import { FormField } from "@bsport/form";
import {
  FormRadioGroup,
  type FormRadioGroupProps,
} from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import type { GiftcardDeliveryFormat } from "#src/components/core/checkout-flow-modal/types";
import { i18nInstance, useTranslation } from "#src/i18n";

export const DeliveryFormatField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const deliveryFormatId = useId();

  return (
    <FormField<
      CheckoutFlowFormState,
      "addItemGiftcardDeliveryFormat",
      FormRadioGroupProps
    >
      name="addItemGiftcardDeliveryFormat"
      mapProps={({ field, form: { setValue } }) => ({
        value: field.value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(
            "addItemGiftcardDeliveryFormat",
            e.target.value as GiftcardDeliveryFormat,
            { shouldDirty: true },
          ),
      })}
    >
      <FormRadioGroup
        id={`giftcard-delivery-format-${deliveryFormatId}`}
        label={t("checkoutFlowModal.giftCardDetails.deliveryFormat")}
        options={[
          {
            label: t("checkoutFlowModal.giftCardDetails.deliveryFormatPdf"),
            value: "pdf",
          },
          {
            label: t("checkoutFlowModal.giftCardDetails.deliveryFormatEmail"),
            value: "email",
          },
        ]}
      />
    </FormField>
  );
};
