import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, ToggleProps } from "@bsport/kaizen-primitive-core";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceToggle: FC<{
  fieldIdPrefix: string;
  trackRecurrenceToggle?: (isRecurring: boolean) => void;
}> = ({ fieldIdPrefix, trackRecurrenceToggle }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const isChecked = watch("isRecurring");

  return (
    <FormField<SessionCreationFormData, "isRecurring", ToggleProps>
      name="isRecurring"
      mapProps={({ form }) => ({
        onToggleChange: (checked) => {
          form.setValue("isRecurring", checked, {
            shouldValidate: true,
            shouldDirty: true,
          });
          trackRecurrenceToggle?.(checked);
          if (!checked) {
            form.clearErrors("recurrenceWeekdays");
          }
        },
      })}
    >
      <Toggle
        checked={isChecked}
        id={`${fieldIdPrefix}-session-recurrence-toggle`}
        label={t(
          "addSessionModal.steps.configureSession.timeAndDate.recurrence.toggle",
        )}
      />
    </FormField>
  );
};
