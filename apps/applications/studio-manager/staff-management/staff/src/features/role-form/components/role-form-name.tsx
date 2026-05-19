import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { RoleFormData } from "../types";

type RoleFormNameProps = {
  formId: string;
  disabled?: boolean;
};

export const RoleFormName: FC<RoleFormNameProps> = ({
  formId,
  disabled = false,
}) => {
  const { t } = useTranslation("role-form");

  return (
    <FormField<RoleFormData, "name", TextFieldProps>
      name="name"
      mapProps={({ defaultProps, field }) => ({
        ...defaultProps,
        helperText: `${field.value?.length ?? 0}/${FIELD_CONSTRAINTS.NAME_MAX_LENGTH}`,
      })}
    >
      <TextField
        id={`${formId}-name`}
        label={t("formFields.name.label")}
        fullWidth
        disabled={disabled}
        required
      />
    </FormField>
  );
};
