import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../types";

type StaffFormPasswordProps = {
  formId: string;
};

export const StaffFormPassword: FC<StaffFormPasswordProps> = ({ formId }) => {
  const { t } = useTranslation("staff-form");

  return (
    <FormField<StaffFormData, "password", TextFieldProps> name="password">
      <TextField
        id={`${formId}-password`}
        label={t("formFields.password.label")}
        type="password"
        required
        fullWidth
      />
    </FormField>
  );
};
