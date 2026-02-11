import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle } from "@bsport/kaizen-primitive-core";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceToggle: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const isChecked = watch("isRecurring");

  return (
    <FormField<SessionCreationFormData, "isRecurring"> name="isRecurring">
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
