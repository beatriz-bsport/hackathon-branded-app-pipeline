import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";

function isMonthlyRecurrencePatternValidType(
  pattern: string,
): pattern is MonthlyRecurrencePattern {
  return (
    pattern === MonthlyRecurrencePattern.DAY_OF_MONTH ||
    pattern === MonthlyRecurrencePattern.NTH_WEEKDAY
  );
}

function isCustomRecurrenceUnitValidType(
  recurrenceUnit: string,
): recurrenceUnit is CustomRecurrenceUnit {
  return (
    recurrenceUnit === CustomRecurrenceUnit.DAYS ||
    recurrenceUnit === CustomRecurrenceUnit.WEEKS ||
    recurrenceUnit === CustomRecurrenceUnit.MONTHS
  );
}

function isRecurrenceTypeValidType(
  recurrenceType: string,
): recurrenceType is RecurrenceType {
  return (
    recurrenceType === RecurrenceType.WEEKLY ||
    recurrenceType === RecurrenceType.CUSTOM
  );
}

export {
  isCustomRecurrenceUnitValidType,
  isMonthlyRecurrencePatternValidType,
  isRecurrenceTypeValidType,
};
