import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";

export const SessionType = [
  "group-activity",
  "workshop",
  "appointment",
] as const;

export const SessionCreationStep = [
  "step-1-choose-group-activity",
  "step-2-configure-session",
  "step-3-advanced-options",
] as const;

export const SessionVisibility = ["listed", "unlisted"] as const;

export type SessionVisibilityType = (typeof SessionVisibility)[number];

export const RecurrenceInterval = [
  "weekly",
  "custom-days",
  "custom-weeks",
  "custom-months",
] as const;

export const RecurrenceRule = [
  MonthlyRecurrencePattern.DAY_OF_MONTH,
  MonthlyRecurrencePattern.NTH_WEEKDAY,
] as const;

export type RecurrenceRuleType = (typeof RecurrenceRule)[number];

export type RecurrenceIntervalType = (typeof RecurrenceInterval)[number];

export const RecurrenceIntervalMapping = {
  [RecurrenceType.WEEKLY]: RecurrenceInterval[0],
  [CustomRecurrenceUnit.DAYS]: RecurrenceInterval[1],
  [CustomRecurrenceUnit.WEEKS]: RecurrenceInterval[2],
  [CustomRecurrenceUnit.MONTHS]: RecurrenceInterval[3],
};
