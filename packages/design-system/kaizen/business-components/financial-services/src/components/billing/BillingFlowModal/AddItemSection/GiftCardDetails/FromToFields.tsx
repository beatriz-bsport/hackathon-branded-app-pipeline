import React, { useEffect, useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import {
  type BillingFlowFormState,
  FROM_TO_MAX_LENGTH,
} from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const FromToFields: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const fromId = useId();
  const toId = useId();

  const { watch, setValue } = useFormContext<BillingFlowFormState>();
  const member = watch("member");
  const currentFrom = watch("addItemGiftcardFrom");

  useEffect(() => {
    if (!currentFrom && member?.firstname) {
      setValue("addItemGiftcardFrom", member.firstname, { shouldDirty: true });
    }
  }, [member]);

  return (
    <div className="grid grid-cols-2 gap-md">
      <FormField<BillingFlowFormState, "addItemGiftcardFrom", TextFieldProps>
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
          label={t("billingFlowModal.giftCardDetails.from")}
          maxLength={FROM_TO_MAX_LENGTH}
          required
          placeholder={t("billingFlowModal.giftCardDetails.fromPlaceholder")}
        />
      </FormField>

      <FormField<BillingFlowFormState, "addItemGiftcardTo", TextFieldProps>
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
          placeholder={t("billingFlowModal.giftCardDetails.toPlaceholder")}
          label={t("billingFlowModal.giftCardDetails.to")}
          maxLength={FROM_TO_MAX_LENGTH}
          required
        />
      </FormField>
    </div>
  );
};
