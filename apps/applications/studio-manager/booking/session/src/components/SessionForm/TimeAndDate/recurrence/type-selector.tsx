import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { isRecurrenceTypeValidType } from "#src/components/SessionForm/TimeAndDate/recurrence/utils";
import { RecurrenceType } from "#src/helpers/recurrence/types";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceTypeSelector: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionCreation");

  const { setValue, watch } = useFormContext<SessionCreationFormData>();

  const selectedValue = watch("recurrenceType");

  const weeklyLabel = t(
    "addSessionModal.steps.configureSession.timeAndDate.recurrence.typeSelector.weekly",
  );
  const customLabel = t(
    "addSessionModal.steps.configureSession.timeAndDate.recurrence.typeSelector.custom",
  );

  const options = [
    {
      label: weeklyLabel,
      id: RecurrenceType.WEEKLY,
    },
    {
      label: customLabel,
      id: RecurrenceType.CUSTOM,
    },
  ];

  const displayValue =
    selectedValue === RecurrenceType.WEEKLY ? weeklyLabel : customLabel;

  return (
    <FormField<SessionCreationFormData, "recurrenceType", SelectProps>
      name="recurrenceType"
      mapProps={() => ({
        onChange: (selectedOptionId) => {
          if (isRecurrenceTypeValidType(selectedOptionId)) {
            setValue("recurrenceType", selectedOptionId, {
              shouldValidate: true,
              shouldDirty: true,
            });
          } else {
            console.warn(`Invalid recurrence type: ${selectedOptionId}`);
          }
        },
        value: displayValue,
      })}
    >
      <Select
        items={options}
        id={`${fieldIdPrefix}-session-recurrence-type`}
        required
        label={t(
          "addSessionModal.steps.configureSession.timeAndDate.recurrence.typeSelector.label",
        )}
      />
    </FormField>
  );
};
