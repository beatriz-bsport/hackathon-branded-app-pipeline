import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Select, SelectProps } from "@bsport/kaizen-primitive-core";

import { isCustomRecurrenceUnitValidType } from "#src/components/SessionForm/TimeAndDate/recurrence/utils";
import { CustomRecurrenceUnit } from "#src/helpers/recurrence/types";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceUnitSelector: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
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

  const displayValue =
    options.find((option) => option.id === selectedValue)?.label || "";

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
          } else {
            console.warn(`Invalid recurrence unit: ${selectedOptionId}`);
          }
        },
        value: displayValue,
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
