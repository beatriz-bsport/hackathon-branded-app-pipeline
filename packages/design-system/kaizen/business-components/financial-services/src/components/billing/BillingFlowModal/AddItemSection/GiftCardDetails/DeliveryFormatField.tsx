import React, { useId } from "react";

import { FormField } from "@bsport/form";
import {
  FormRadioGroup,
  type FormRadioGroupProps,
} from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import type { GiftcardDeliveryFormat } from "#src/components/billing/BillingFlowModal/types";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const DeliveryFormatField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const deliveryFormatId = useId();

  return (
    <FormField<
      BillingFlowFormState,
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
        label={t("billingFlowModal.giftCardDetails.deliveryFormat")}
        options={[
          {
            label: t("billingFlowModal.giftCardDetails.deliveryFormatPdf"),
            value: "pdf",
          },
          {
            label: t("billingFlowModal.giftCardDetails.deliveryFormatEmail"),
            value: "email",
          },
        ]}
      />
    </FormField>
  );
};
