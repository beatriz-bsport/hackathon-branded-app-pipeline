import { DateTime } from "@bsport/datetime-manipulation";

export enum RecurrenceType {
  WEEKLY = "weekly",
  CUSTOM = "custom",
}

export enum CustomRecurrenceUnit {
  DAYS = "days",
  WEEKS = "weeks",
  MONTHS = "months",
}

export enum MonthlyRecurrencePattern {
  DAY_OF_MONTH = "day_of_month",
  // e.g., second Monday of the month
  NTH_WEEKDAY = "nth_weekday",
}

export type ISOWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type WeekdaySelection = Record<ISOWeekday, boolean>;

export type WeekdayPosition = {
  position: 1 | 2 | 3 | 4 | -1;
  weekday: ISOWeekday;
};

type BaseConfig = {
  startDate: DateTime;
  endDate: DateTime;
  timezone: string;
};

export type WeeklyRecurrenceConfig = {
  type: RecurrenceType.WEEKLY;
  weekdays: WeekdaySelection;
} & BaseConfig;

export type CustomDaysConfig = {
  type: RecurrenceType.CUSTOM;
  unit: CustomRecurrenceUnit.DAYS;
  interval: number;
} & BaseConfig;

export type CustomWeeksConfig = {
  type: RecurrenceType.CUSTOM;
  unit: CustomRecurrenceUnit.WEEKS;
  interval: number;
  weekdays: WeekdaySelection;
} & BaseConfig;

export type CustomMonthsConfig = {
  type: RecurrenceType.CUSTOM;
  unit: CustomRecurrenceUnit.MONTHS;
  interval: number;
  pattern: MonthlyRecurrencePattern;
  dayOfMonth?: number;
  weekdayPosition?: WeekdayPosition;
} & BaseConfig;

export type RecurrenceConfig =
  | WeeklyRecurrenceConfig
  | CustomDaysConfig
  | CustomWeeksConfig
  | CustomMonthsConfig;

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
};

export type ValidationError = {
  field: string;
  message: string;
  code: string;
};

export type ValidationWarning = {
  message: string;
  code: string;
  severity: "low" | "medium" | "high";
};
