import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";

import { generateRecurrenceDates } from "#src/helpers/recurrence";
import { useRecurrenceConfig } from "#src/hooks/useRecurrenceConfig";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { RecurrenceEndDate } from "./end-date";
import { RecurrenceFrequencySelector } from "./frequency-selector";
import { RecurrencePatternSelector } from "./pattern-selector";
import { RecurrenceToggle } from "./toggle";
import { RecurrenceTypeSelector } from "./type-selector";
import { RecurrenceWeekdaysSelector } from "./weekdays-selector";

export const SessionRecurrence: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const {
    isRecurring,
    startDateTime,
    recurrenceType,
    recurrenceEndDate,
    recurrenceInterval,
    recurrencePattern,
    recurrenceUnit,
    recurrenceWeekdays,
  } = watch();

  const { getRecurrenceConfig } = useRecurrenceConfig();

  const recurrenceConfig = getRecurrenceConfig({
    startDateTime,
    isRecurring,
    recurrenceEndDate,
    recurrenceInterval,
    recurrencePattern,
    recurrenceType,
    recurrenceUnit,
    recurrenceWeekdays,
  });

  const recurrence = recurrenceConfig
    ? generateRecurrenceDates(recurrenceConfig)
    : null;

  return (
    <>
      <RecurrenceToggle fieldIdPrefix={fieldIdPrefix} />
      {isRecurring && (
        <div className="flex flex-col gap-md ml-xl">
          <RecurrenceTypeSelector fieldIdPrefix={fieldIdPrefix} />
          <RecurrenceFrequencySelector fieldIdPrefix={fieldIdPrefix} />
          <RecurrenceWeekdaysSelector fieldIdPrefix={fieldIdPrefix} />
          <RecurrencePatternSelector fieldIdPrefix={fieldIdPrefix} />
          <RecurrenceEndDate fieldIdPrefix={fieldIdPrefix} />
          {!!recurrence?.length && (
            <Alert status="info" className="w-fit">
              {t(
                "addSessionModal.steps.configureSession.timeAndDate.recurrence.info",
                { count: recurrence.length },
              )}
            </Alert>
          )}
        </div>
      )}
    </>
  );
};
