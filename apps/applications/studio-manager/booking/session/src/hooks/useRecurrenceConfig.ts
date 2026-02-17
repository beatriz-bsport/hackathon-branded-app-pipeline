import { useCallback } from "react";

import { DateTime } from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { getWeekdayPositionInMonth } from "#src/helpers/recurrence/custom/month.utils";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceConfig,
  RecurrenceType,
  WeekdaySelection,
} from "#src/helpers/recurrence/types";

export type RecurrenceInputs = {
  startDateTime: DateTime;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceWeekdays: WeekdaySelection;
  recurrenceUnit: CustomRecurrenceUnit;
  recurrenceInterval: number;
  recurrencePattern: MonthlyRecurrencePattern;
  recurrenceEndDate: DateTime | null;
};

/**
 * Hook that returns a function to generate recurrence configuration based on form inputs.
 * Call getRecurrenceConfig with the form inputs when needed (e.g., in submit handlers).
 */
export const useRecurrenceConfig = () => {
  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "Europe/Paris";

  const getRecurrenceConfig = useCallback(
    ({
      startDateTime,
      isRecurring,
      recurrenceEndDate,
      recurrenceInterval,
      recurrencePattern,
      recurrenceType,
      recurrenceUnit,
      recurrenceWeekdays,
    }: RecurrenceInputs): RecurrenceConfig | null => {
      if (!isRecurring || !recurrenceEndDate) {
        return null;
      }

      const baseConfig = {
        startDate: startDateTime,
        endDate: recurrenceEndDate,
        timezone: companyTimeZone,
      };

      if (recurrenceType === RecurrenceType.WEEKLY) {
        return {
          ...baseConfig,
          type: RecurrenceType.WEEKLY,
          weekdays: recurrenceWeekdays,
        };
      }

      if (
        recurrenceType === RecurrenceType.CUSTOM &&
        recurrenceUnit === CustomRecurrenceUnit.DAYS
      ) {
        return {
          ...baseConfig,
          type: RecurrenceType.CUSTOM,
          unit: CustomRecurrenceUnit.DAYS,
          interval: recurrenceInterval,
        };
      }

      if (
        recurrenceType === RecurrenceType.CUSTOM &&
        recurrenceUnit === CustomRecurrenceUnit.WEEKS
      ) {
        return {
          ...baseConfig,
          type: RecurrenceType.CUSTOM,
          unit: CustomRecurrenceUnit.WEEKS,
          interval: recurrenceInterval,
          weekdays: recurrenceWeekdays,
        };
      }

      if (
        recurrenceType === RecurrenceType.CUSTOM &&
        recurrenceUnit === CustomRecurrenceUnit.MONTHS
      ) {
        const weekdayPosition = getWeekdayPositionInMonth(
          startDateTime,
          companyTimeZone,
        );
        return {
          ...baseConfig,
          type: RecurrenceType.CUSTOM,
          unit: CustomRecurrenceUnit.MONTHS,
          interval: recurrenceInterval,
          pattern: recurrencePattern,
          dayOfMonth: startDateTime.day,
          weekdayPosition,
        };
      }

      return null; // Invalid/incomplete config
    },
    [companyTimeZone],
  );

  return { getRecurrenceConfig };
};
