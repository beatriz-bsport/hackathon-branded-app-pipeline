import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, ToggleProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionEditFormData } from "../types";

export const OverridePayrollRuleToggle: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionEdit");

  const { watch } = useFormContext<SessionEditFormData>();

  const isChecked = watch("overrideTeacherPayrollRule");

  return (
    <FormField<SessionEditFormData, "overrideTeacherPayrollRule", ToggleProps>
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
        label={t("editSessionForm.content.teacherPayrollRuleOverrideLabel")}
        helperText={t(
          "editSessionForm.content.teacherPayrollRuleOverrideDescription",
        )}
      />
    </FormField>
  );
};
