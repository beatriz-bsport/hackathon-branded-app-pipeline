import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_NAME_MAX_LENGTH } from "../schema";

type PackFormNameProps = {
  fieldIdPrefix: string;
};

export const PackFormName: FC<PackFormNameProps> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("details");

  return (
    <FormField<PackFormData, "name">
      name="name"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        helperText: t("formFields.name.helperText", {
          length: field.value.length,
          maxLength: FIELD_NAME_MAX_LENGTH,
        }),
        onClear: () => {
          form.setValue("name", "", { shouldDirty: true });
          field.onBlur();
        },
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-pack-name`}
        label={t("formFields.name.label")}
        required
        fullWidth
      />
    </FormField>
  );
};
