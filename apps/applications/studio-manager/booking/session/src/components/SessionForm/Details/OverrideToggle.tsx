import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const OverrideToggle: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isChecked = watch("allowCustomNameAndDescription");

  return (
    <FormField name="allowCustomNameAndDescription">
      <Toggle
        checked={isChecked}
        id={`${fieldIdPrefix}-session-name-override-toggle`}
        label={t(
          "addSessionModal.steps.configureSession.details.overrideToggle.label",
        )}
        helperText={t(
          "addSessionModal.steps.configureSession.details.overrideToggle.helperText",
        )}
      />
    </FormField>
  );
};
