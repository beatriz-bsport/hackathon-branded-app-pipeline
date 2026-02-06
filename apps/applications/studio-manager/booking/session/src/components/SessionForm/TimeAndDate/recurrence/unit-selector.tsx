import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Select, SelectProps } from "@bsport/kaizen-primitive-core";

import { isCustomRecurrenceUnitValidType } from "#src/components/SessionForm/TimeAndDate/recurrence/utils";
import {
  RecurrenceIntervalMapping,
  RecurrenceIntervalType,
} from "#src/events/constants";
import { CustomRecurrenceUnit } from "#src/helpers/recurrence/types";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceUnitSelector: FC<{
  fieldIdPrefix: string;
  trackRecurrenceType?: (recurrenceType: RecurrenceIntervalType) => void;
}> = ({ fieldIdPrefix, trackRecurrenceType }) => {
  const { t } = useTranslation("sessionCreation");
  const { watch, setValue } = useFormContext<SessionCreationFormData>();
  const selectedValue = watch("recurrenceUnit");

  const options = [
    {
      label: t(
        "addSessionModal.steps.configureSession.timeAndDate.recurrence.unit.days",
      ),
      id: CustomRecurrenceUnit.DAYS,
    },
    {
      label: t(
        "addSessionModal.steps.configureSession.timeAndDate.recurrence.unit.weeks",
      ),
      id: CustomRecurrenceUnit.WEEKS,
    },
    {
      label: t(
        "addSessionModal.steps.configureSession.timeAndDate.recurrence.unit.months",
      ),
      id: CustomRecurrenceUnit.MONTHS,
    },
  ];

  return (
    <FormField<SessionCreationFormData, "recurrenceUnit", SelectProps>
      name="recurrenceUnit"
      mapProps={() => ({
        onChange: (selectedOptionId) => {
          if (isCustomRecurrenceUnitValidType(selectedOptionId)) {
            setValue("recurrenceUnit", selectedOptionId, {
              shouldValidate: true,
              shouldDirty: true,
            });
            trackRecurrenceType?.(RecurrenceIntervalMapping[selectedOptionId]);
          } else {
            console.warn(`Invalid recurrence unit: ${selectedOptionId}`);
          }
        },
        value: selectedValue,
      })}
    >
      <Select
        items={options}
        id={`${fieldIdPrefix}-session-recurrence-unit`}
        required
      />
    </FormField>
  );
};
