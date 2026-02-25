import React, { useId } from "react";

import { FormField } from "@bsport/form";
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

  return (
    <div className="flex gap-2xs items-center">
      <FormField<
        CheckoutFlowFormState,
        "addItemGiftcardRecipientName",
        TextFieldProps
      >
        name="addItemGiftcardRecipientName"
        mapProps={({ field, form: { setValue } }) => ({
          value: field.value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setValue("addItemGiftcardRecipientName", e.target.value, {
              shouldDirty: true,
            }),
          onClear: () =>
            setValue("addItemGiftcardRecipientName", "", { shouldDirty: true }),
          helperText: `${field.value.length}/${NAME_MAX_LENGTH}`,
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
