import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { StaffFormData } from "../types";

type StaffFormCommissionProps = {
  formId: string;
};

export const StaffFormCommission: FC<StaffFormCommissionProps> = ({
  formId,
}) => {
  const { t } = useTranslation("staff-form");

  return (
    <FormField<StaffFormData, "commissionPercentage", TextFieldProps>
      name="commissionPercentage"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        value: String(field.value ?? ""),
        onChange: (event) => {
          form.setValue("commissionPercentage", Number(event.target.value), {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
      })}
    >
      <TextField
        id={`${formId}-commission-percentage`}
        label={t("formFields.commission.label")}
        type="number"
        min={FIELD_CONSTRAINTS.COMMISSION_MIN}
        max={FIELD_CONSTRAINTS.COMMISSION_MAX}
        step={FIELD_CONSTRAINTS.COMMISSION_STEP}
        suffix={{ type: "text", value: "%" }}
        required
      />
    </FormField>
  );
};
