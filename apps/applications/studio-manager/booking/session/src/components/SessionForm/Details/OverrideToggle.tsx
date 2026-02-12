import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, ToggleProps } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const OverrideToggle: FC<{
  fieldIdPrefix: string;
  trackOverrideToggleChange?: (checked: boolean) => void;
}> = ({ fieldIdPrefix, trackOverrideToggleChange }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isChecked = watch("allowCustomNameAndDescription");

  return (
    <FormField<
      SessionCreationFormData,
      "allowCustomNameAndDescription",
      ToggleProps
    >
      name="allowCustomNameAndDescription"
      mapProps={({ form }) => ({
        onToggleChange: (checked) => {
          form.setValue("allowCustomNameAndDescription", checked, {
            shouldValidate: true,
            shouldDirty: true,
          });
          trackOverrideToggleChange?.(checked);
        },
      })}
    >
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
