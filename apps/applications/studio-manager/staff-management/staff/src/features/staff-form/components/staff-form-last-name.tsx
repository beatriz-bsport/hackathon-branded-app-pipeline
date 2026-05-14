import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../types";

type StaffFormLastNameProps = {
  formId: string;
  disabled?: boolean;
};

export const StaffFormLastName: FC<StaffFormLastNameProps> = ({
  formId,
  disabled,
}) => {
  const { t } = useTranslation("staff-form");

  return (
    <FormField<StaffFormData, "lastName", TextFieldProps> name="lastName">
      <TextField
        id={`${formId}-last-name`}
        label={t("formFields.lastName.label")}
        required
        fullWidth
        disabled={disabled}
      />
    </FormField>
  );
};
