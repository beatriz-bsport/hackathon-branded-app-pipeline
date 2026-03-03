import React, { useId, useState } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import {
  type CheckoutFlowFormState,
  NAME_AND_PERSONAL_MESSAGE_PDF_MAX_LENGTH,
  PERSONAL_MESSAGE_EMAIL_MAX_LENGTH,
} from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const PersonalMessageField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const personalMessageId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const { watch } = useFormContext<CheckoutFlowFormState>();

  const giftcardDeliveryFormat = watch("addItemGiftcardDeliveryFormat");
  const personalMessageMaxLength =
    giftcardDeliveryFormat === "email"
      ? PERSONAL_MESSAGE_EMAIL_MAX_LENGTH
      : NAME_AND_PERSONAL_MESSAGE_PDF_MAX_LENGTH;

  return (
    <FormField<
      CheckoutFlowFormState,
      "addItemGiftcardPersonalMessage",
      TextAreaProps
    >
      name="addItemGiftcardPersonalMessage"
      mapProps={({ field, form: { setValue } }) => ({
        value: field.value,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setValue(
            "addItemGiftcardPersonalMessage",
            e.target.value.slice(0, personalMessageMaxLength),
            { shouldDirty: true },
          ),
        helperText: isFocused
          ? `${field.value.length}/${personalMessageMaxLength}`
          : undefined,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      })}
    >
      <TextArea
        id={`giftcard-personal-message-${personalMessageId}`}
        label={t("checkoutFlowModal.giftCardDetails.personalMessage")}
        placeholder={t(
          "checkoutFlowModal.giftCardDetails.personalMessagePlaceholder",
        )}
        maxLength={personalMessageMaxLength}
      />
    </FormField>
  );
};
