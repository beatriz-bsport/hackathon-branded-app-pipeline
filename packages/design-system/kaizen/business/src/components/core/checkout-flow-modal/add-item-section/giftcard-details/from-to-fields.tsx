import React, { useEffect, useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import {
  type CheckoutFlowFormState,
  FROM_TO_MAX_LENGTH,
} from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const FromToFields: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const fromId = useId();
  const toId = useId();

  const { watch, setValue } = useFormContext<CheckoutFlowFormState>();
  const member = watch("member");
  const currentFrom = watch("addItemGiftcardFrom");

  useEffect(() => {
    if (!currentFrom && member?.firstname) {
      setValue("addItemGiftcardFrom", member.firstname, { shouldDirty: true });
    }
  }, [member]);

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
      <FormField<CheckoutFlowFormState, "addItemGiftcardFrom", TextFieldProps>
        name="addItemGiftcardFrom"
        mapProps={({ field, form: { setValue } }) => ({
          value: field.value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setValue("addItemGiftcardFrom", e.target.value, {
              shouldDirty: true,
            }),
          onClear: () =>
            setValue("addItemGiftcardFrom", "", { shouldDirty: true }),
          helperText: `${field.value.length}/${FROM_TO_MAX_LENGTH}`,
        })}
      >
        <TextField
          id={`giftcard-from-${fromId}`}
          label={t("checkoutFlowModal.giftCardDetails.from")}
          maxLength={FROM_TO_MAX_LENGTH}
          required
          placeholder={t("checkoutFlowModal.giftCardDetails.fromPlaceholder")}
        />
      </FormField>

      <FormField<CheckoutFlowFormState, "addItemGiftcardTo", TextFieldProps>
        name="addItemGiftcardTo"
        mapProps={({ field, form: { setValue } }) => ({
          value: field.value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setValue("addItemGiftcardTo", e.target.value, {
              shouldDirty: true,
            }),
          onClear: () =>
            setValue("addItemGiftcardTo", "", { shouldDirty: true }),
          helperText: `${field.value.length}/${FROM_TO_MAX_LENGTH}`,
        })}
      >
        <TextField
          id={`giftcard-to-${toId}`}
          placeholder={t("checkoutFlowModal.giftCardDetails.toPlaceholder")}
          label={t("checkoutFlowModal.giftCardDetails.to")}
          maxLength={FROM_TO_MAX_LENGTH}
          required
        />
      </FormField>
    </div>
  );
};
