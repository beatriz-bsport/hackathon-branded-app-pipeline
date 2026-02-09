import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Select, SelectProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { isMonthlyRecurrencePatternValidType } from "#src/components/SessionForm/TimeAndDate/recurrence/utils";
import { RecurrenceRuleType } from "#src/events/constants";
import { getWeekdayPositionInMonth } from "#src/helpers/recurrence/custom/month.utils";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrencePatternSelector: FC<{
  fieldIdPrefix: string;
  trackRecurrenceRule?: (recurrenceRule: RecurrenceRuleType) => void;
}> = ({ fieldIdPrefix, trackRecurrenceRule }) => {
  const { t } = useTranslation(["common", "sessionCreation"]);

  const { watch, setValue } = useFormContext<SessionCreationFormData>();

  const selectedValue = watch("recurrencePattern");

  const recurrenceUnit = watch("recurrenceUnit");

  const recurrenceType = watch("recurrenceType");

  const startDate = watch("startDateTime");

  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  if (
    recurrenceType !== RecurrenceType.CUSTOM ||
    recurrenceUnit !== CustomRecurrenceUnit.MONTHS
  ) {
    return null;
  }

  const weekdayPosition =
    startDate && companyTimezone
      ? getWeekdayPositionInMonth(startDate, companyTimezone)
      : null;

  const dayOfTheMonth = startDate ? startDate.getDate() : 1;

  // "Monthly on the second Friday"
  const nthWeekdayLabel: string = t(
    "addSessionModal.steps.configureSession.timeAndDate.recurrence.pattern.position.nthWeekdayLabel",
    {
      position: t(
        `addSessionModal.steps.configureSession.timeAndDate.recurrence.pattern.position.${weekdayPosition?.position ?? 1}`,
        {
          ns: "sessionCreation",
        },
      ),
      weekday: t(`session.weekdays.${weekdayPosition?.weekday ?? 1}`, {
        ns: "common",
      }),
      ns: "sessionCreation",
    },
  );

  // "Monthly on day 15"
  const dayOfMonthLabel = t(
    "addSessionModal.steps.configureSession.timeAndDate.recurrence.pattern.position.dayOfMonthLabel",
    {
      day: dayOfTheMonth,
      ns: "sessionCreation",
    },
  );

  const options = [
    {
      label: dayOfMonthLabel,
      id: MonthlyRecurrencePattern.DAY_OF_MONTH,
    },
    {
      label: nthWeekdayLabel,
      id: MonthlyRecurrencePattern.NTH_WEEKDAY,
    },
  ];

  return (
    <FormField<SessionCreationFormData, "recurrencePattern", SelectProps>
      name="recurrencePattern"
      mapProps={() => ({
        onChange: (selectedOptionId) => {
          if (!isMonthlyRecurrencePatternValidType(selectedOptionId)) {
            console.warn(
              `Invalid monthly recurrence pattern: ${selectedOptionId}`,
            );
            return;
          }
          setValue("recurrencePattern", selectedOptionId, {
            shouldValidate: true,
            shouldDirty: true,
          });
          trackRecurrenceRule?.(selectedOptionId);
        },
        value: selectedValue,
      })}
    >
      <Select
        items={options}
        id={`${fieldIdPrefix}-session-recurrence-pattern`}
        required
        label={t(
          "addSessionModal.steps.configureSession.timeAndDate.recurrence.pattern.label",
          {
            ns: "sessionCreation",
          },
        )}
      />
    </FormField>
  );
};
