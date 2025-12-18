import { useMemo } from "react";

import { toDateTime } from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { getWeekdayPositionInMonth } from "#src/helpers/recurrence/custom/month.utils";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceConfig,
  RecurrenceType,
  WeekdaySelection,
} from "#src/helpers/recurrence/types";

type RecurrenceInputs = {
  startDateTime: Date;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceWeekdays: WeekdaySelection;
  recurrenceUnit: CustomRecurrenceUnit;
  recurrenceInterval: number;
  recurrencePattern: MonthlyRecurrencePattern;
  recurrenceEndDate: Date | null;
};

/**
 * Hook to generate recurrence configuration based on form inputs
 */
export const useRecurrenceConfig = ({
  startDateTime,
  isRecurring,
  recurrenceEndDate,
  recurrenceInterval,
  recurrencePattern,
  recurrenceType,
  recurrenceUnit,
  recurrenceWeekdays,
}: RecurrenceInputs): RecurrenceConfig | null => {
  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "Europe/Paris";

  return useMemo(() => {
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
      const startDT = toDateTime(startDateTime, companyTimeZone);
      return {
        ...baseConfig,
        type: RecurrenceType.CUSTOM,
        unit: CustomRecurrenceUnit.MONTHS,
        interval: recurrenceInterval,
        pattern: recurrencePattern,
        dayOfMonth: startDT.day,
        weekdayPosition,
      };
    }

    return null; // Invalid/incomplete config
  }, [
    isRecurring,
    recurrenceType,
    recurrenceUnit,
    recurrenceInterval,
    recurrencePattern,
    recurrenceWeekdays,
    startDateTime,
    recurrenceEndDate,
    companyTimeZone,
  ]);
};
