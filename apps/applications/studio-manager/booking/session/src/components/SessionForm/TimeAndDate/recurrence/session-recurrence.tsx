import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";

import { RecurrenceIntervalType } from "#src/events/constants";
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
  trackRecurrenceToggle?: (isRecurring: boolean) => void;
  trackRecurrenceType?: (recurrenceType: RecurrenceIntervalType) => void;
}> = ({ fieldIdPrefix, trackRecurrenceToggle, trackRecurrenceType }) => {
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
      <RecurrenceToggle
        fieldIdPrefix={fieldIdPrefix}
        trackRecurrenceToggle={trackRecurrenceToggle}
      />
      {isRecurring && (
        <div className="flex flex-col gap-md ml-xl">
          <RecurrenceTypeSelector
            fieldIdPrefix={fieldIdPrefix}
            trackRecurrenceType={trackRecurrenceType}
          />
          <RecurrenceFrequencySelector
            fieldIdPrefix={fieldIdPrefix}
            trackRecurrenceType={trackRecurrenceType}
          />
          <RecurrenceWeekdaysSelector fieldIdPrefix={fieldIdPrefix} />
          <RecurrencePatternSelector fieldIdPrefix={fieldIdPrefix} />
          <RecurrenceEndDate fieldIdPrefix={fieldIdPrefix} />
          {recurrence?.length === 0 && (
            <Alert status="warning" className="w-fit" layout="inline">
              {t(
                "addSessionModal.steps.configureSession.timeAndDate.recurrence.warning",
              )}
            </Alert>
          )}
          {!!recurrence?.length && (
            <Alert status="info" className="w-fit" layout="inline">
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
