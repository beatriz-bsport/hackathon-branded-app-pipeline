import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SessionEditFormData } from "../types";

export const OverridePayrollRuleToggle: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionEdit");

  const { watch } = useFormContext<SessionEditFormData>();

  const isChecked = watch("overrideTeacherPayrollRule");

  return (
    <FormField<
      SessionEditFormData,
      "overrideTeacherPayrollRule"
    > name="overrideTeacherPayrollRule">
      <Toggle
        checked={isChecked}
        id={`${fieldIdPrefix}-session-partnership-toggle`}
        label={t("editSessionForm.content.teacherPayrollRuleOverrideLabel")}
        helperText={t(
          "editSessionForm.content.teacherPayrollRuleOverrideDescription",
        )}
      />
    </FormField>
  );
};
