import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../types";

type StaffFormFirstNameProps = {
  formId: string;
  disabled?: boolean;
};

export const StaffFormFirstName: FC<StaffFormFirstNameProps> = ({
  formId,
  disabled,
}) => {
  const { t } = useTranslation("staff-form");

  return (
    <FormField<StaffFormData, "firstName", TextFieldProps> name="firstName">
      <TextField
        id={`${formId}-first-name`}
        label={t("formFields.firstName.label")}
        required
        fullWidth
        disabled={disabled}
      />
    </FormField>
  );
};
