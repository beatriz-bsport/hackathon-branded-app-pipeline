import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, ToggleProps } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";

export const OverridePayrollRuleToggle: FC<{
  fieldIdPrefix: string;
  label: string;
  helperText: string;
}> = ({ fieldIdPrefix, label, helperText }) => {
  const { watch } = useFormContext<SessionCreationFormData>();

  const isChecked = watch("overrideTeacherPayrollRule");

  return (
    <FormField<
      SessionCreationFormData,
      "overrideTeacherPayrollRule",
      ToggleProps
    >
      name="overrideTeacherPayrollRule"
      mapProps={({ form }) => ({
        onToggleChange: (checked: boolean) => {
          form.setValue("overrideTeacherPayrollRule", checked, {
            shouldValidate: false,
            shouldDirty: false,
          });
        },
      })}
    >
      <Toggle
        checked={isChecked}
        id={`${fieldIdPrefix}-override-payroll-rule-toggle`}
        label={label}
        helperText={helperText}
      />
    </FormField>
  );
};
