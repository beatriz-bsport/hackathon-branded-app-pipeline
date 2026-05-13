import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../types";

type StaffFormEmailProps = {
  formId: string;
  disabled?: boolean;
};

export const StaffFormEmail: FC<StaffFormEmailProps> = ({
  formId,
  disabled,
}) => {
  const { t } = useTranslation("staff-form");

  return (
    <FormField<StaffFormData, "email", TextFieldProps> name="email">
      <TextField
        id={`${formId}-email`}
        label={t("formFields.email.label")}
        type="email"
        fullWidth
        disabled={disabled}
      />
    </FormField>
  );
};
