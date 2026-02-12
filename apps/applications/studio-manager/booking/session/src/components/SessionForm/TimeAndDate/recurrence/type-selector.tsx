import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { isRecurrenceTypeValidType } from "#src/components/SessionForm/TimeAndDate/recurrence/utils";
import {
  RecurrenceIntervalMapping,
  RecurrenceIntervalType,
} from "#src/events/constants";
import { RecurrenceType } from "#src/helpers/recurrence/types";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceTypeSelector: FC<{
  fieldIdPrefix: string;
  trackRecurrenceType?: (recurrenceType: RecurrenceIntervalType) => void;
}> = ({ fieldIdPrefix, trackRecurrenceType }) => {
  const { t } = useTranslation("sessionCreation");

  const { setValue, watch } = useFormContext<SessionCreationFormData>();

  const selectedValue = watch("recurrenceType");

  const recurrenceUnit = watch("recurrenceUnit");

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

  return (
    <FormField<SessionCreationFormData, "recurrenceType", SelectProps>
      name="recurrenceType"
      mapProps={() => ({
        onChange: (selectedOptionId) => {
          if (!isRecurrenceTypeValidType(selectedOptionId)) {
            console.warn(`Invalid recurrence type: ${selectedOptionId}`);
            return;
          }
          setValue("recurrenceType", selectedOptionId, {
            shouldValidate: true,
            shouldDirty: true,
          });
          if (selectedOptionId === RecurrenceType.WEEKLY) {
            trackRecurrenceType?.(
              RecurrenceIntervalMapping[RecurrenceType.WEEKLY],
            );
            return;
          }
          // When user select "custom", we use the recurrenceUnit in the event (custom-days, custom-weeks, custom-months)
          trackRecurrenceType?.(RecurrenceIntervalMapping[recurrenceUnit]);
        },
        value: selectedValue,
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
