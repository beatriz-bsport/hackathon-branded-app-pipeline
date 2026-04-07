import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { DEFAULT_DATA, FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData } from "../types";

type ContractFormNameProps = {
  formId: string;
  readonly?: boolean;
};

export const ContractFormName: FC<ContractFormNameProps> = ({
  formId,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");

  return (
    <FormField<ContractFormData, "name", TextFieldProps>
      name="name"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        helperText: `${field.value.length}/${FIELD_CONSTRAINTS.NAME_LENGTH_MAX}`,
        onClear: () => {
          form.setValue("name", DEFAULT_DATA.name, {
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
        disabled={!!readonly}
      />
    </FormField>
  );
};
