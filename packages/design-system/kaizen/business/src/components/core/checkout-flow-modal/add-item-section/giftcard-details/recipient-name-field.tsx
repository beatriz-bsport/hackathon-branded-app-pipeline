import React, { useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Button,
  TextField,
  type TextFieldProps,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

const NAME_MAX_LENGTH = 150;

export const RecipientNameField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const nameId = useId();
  const { clearErrors } = useFormContext<CheckoutFlowFormState>();

  return (
    <div className="flex gap-2xs items-center">
      <FormField<
        CheckoutFlowFormState,
        "addItemGiftcardRecipientName",
        TextFieldProps
      >
        name="addItemGiftcardRecipientName"
        mapProps={({ field, fieldState, form: { setValue } }) => ({
          value: field.value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue("addItemGiftcardRecipientName", e.target.value, {
              shouldDirty: true,
            });
            clearErrors("addItemGiftcardRecipientName");
          },
          onClear: () => {
            setValue("addItemGiftcardRecipientName", "", { shouldDirty: true });
            clearErrors("addItemGiftcardRecipientName");
          },
          helperText: `${field.value.length}/${NAME_MAX_LENGTH}`,
          status: fieldState.error ? "error" : "default",
          statusText: fieldState.error?.message,
        })}
      >
        <TextField
          id={`giftcard-name-${nameId}`}
          label={t("checkoutFlowModal.giftCardDetails.name")}
          maxLength={NAME_MAX_LENGTH}
          required
          fullWidth
          containerProps={{ className: "w-full" }}
        />
      </FormField>
      <Tooltip
        label={t("checkoutFlowModal.giftCardDetails.nameTooltip")}
        placement="bottom"
      >
        <Button
          kind="icon-button"
          icon="info-circle"
          label={t("checkoutFlowModal.giftCardDetails.nameTooltip")}
          size="sm"
          intent="flat"
          color="default"
          className="shrink-0 text-onsurface-weak"
        />
      </Tooltip>
    </div>
  );
};
