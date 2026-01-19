import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS, GIFTCARD_FORM_DATA_DEFAULT } from "../constants";
import type { GiftcardFormData } from "../types";

type GiftcardFormNameProps = {
  formId: string;
};

export const GiftcardFormName: FC<GiftcardFormNameProps> = ({ formId }) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <FormField<GiftcardFormData, "name", TextFieldProps>
      name="name"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,

        helperText: `${field.value.length}/${FIELD_CONSTRAINTS.NAME_MAX_LENGTH}`,

        onClear: () => {
          form.setValue("name", GIFTCARD_FORM_DATA_DEFAULT.name, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
      })}
    >
      <TextField
        id={`${formId}-name`}
        label={t("formFields.name.label")}
        required
        fullWidth
      />
    </FormField>
  );
};
