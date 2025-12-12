import { generateCustomDaysDates } from "./custom/custom-days-generator";
import { generateCustomMonthsDates } from "./custom/custom-months-generator";
import { generateCustomWeeksDates } from "./custom/custom-weeks-generator";
import {
  CustomRecurrenceUnit,
  type RecurrenceConfig,
  RecurrenceType,
} from "./types";
import { generateWeeklyDates } from "./weekly/generator";

/**
 * Generate recurrence dates based on configuration
 * Uses discriminated unions for type-safe handling
 */
export function generateRecurrenceDates(config: RecurrenceConfig): Date[] {
  if (config.type === RecurrenceType.WEEKLY) {
    return generateWeeklyDates(config);
  }

  if (config.type === RecurrenceType.CUSTOM) {
    switch (config.unit) {
      case CustomRecurrenceUnit.DAYS:
        return generateCustomDaysDates(config);
      case CustomRecurrenceUnit.WEEKS:
        return generateCustomWeeksDates(config);
      case CustomRecurrenceUnit.MONTHS:
        return generateCustomMonthsDates(config);
    }
  }

  throw new Error(`Unknown recurrence config: ${JSON.stringify(config)}`);
}
