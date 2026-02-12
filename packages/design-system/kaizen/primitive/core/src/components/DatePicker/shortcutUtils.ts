import { type DateTime, getLocalNow } from "@bsport/datetime-manipulation";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import type { ShortcutItem } from "./Shortcuts";

/**
 * Date picker shortcut utilities: i18n-aligned keys and date calculations for single and range modes.
 *
 * **Usage**
 * - Use the **useDatePickerShortcuts** hook to get a record of shortcuts with translated labels
 *   (uses useTranslation + useKaizenI18nInstance). Build an array from the keys you need and pass
 *   it to DatePicker's `shortcuts` prop.
 * - Translation keys live in `default.json` under `datePicker.shortcuts` (today, last4weeks,
 *   lastWeek, lastQuarter, monthToDate, yearToDate, nextWeek, nextMonth, nextQuarter, nextYear).
 * - Raw date getters (e.g. `getToday`, `getLastWeekRange`) and shortcut constants are available
 *   for use inside this module and when extending the hook.
 */

/**
 * i18n key prefix for date picker shortcuts. Keys match `default.json` under `datePicker.shortcuts`.
 * @example "datePicker.shortcuts.today"
 */
export const DATE_PICKER_SHORTCUT_KEY_PREFIX = "datePicker.shortcuts" as const;

/**
 * Shortcut translation keys aligned with `default.json`:
 * today, last4weeks, lastWeek, lastQuarter, monthToDate, yearToDate,
 * nextWeek, nextMonth, nextQuarter, nextYear
 */
export const SHORTCUT_KEYS = {
  TODAY: "today",
  LAST_4_WEEKS: "last4weeks",
  LAST_WEEK: "lastWeek",
  LAST_QUARTER: "lastQuarter",
  MONTH_TO_DATE: "monthToDate",
  YEAR_TO_DATE: "yearToDate",
  NEXT_WEEK: "nextWeek",
  NEXT_MONTH: "nextMonth",
  NEXT_QUARTER: "nextQuarter",
  NEXT_YEAR: "nextYear",
} as const;

export type ShortcutKey = (typeof SHORTCUT_KEYS)[keyof typeof SHORTCUT_KEYS];

function fullKey(key: string): string {
  return `${DATE_PICKER_SHORTCUT_KEY_PREFIX}.${key}`;
}

/** Single date: today at start of day */
export function getToday(): DateTime {
  return getLocalNow({}).startOf("day");
}

/** Range: from 4 weeks ago to today */
export function getLast4WeeksRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today.minus({ weeks: 4 }), today];
}

/** Range: last 7 days (today - 7 days → today) */
export function getLastWeekRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today.minus({ days: 7 }), today];
}

/** Range: last 3 months (today - 3 months → today) */
export function getLastQuarterRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today.minus({ months: 3 }), today];
}

/** Range: start of current month → today */
export function getMonthToDateRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today.startOf("month"), today];
}

/** Range: start of current year → today */
export function getYearToDateRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today.startOf("year"), today];
}

/** Range: today → today + 7 days */
export function getNextWeekRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today, today.plus({ days: 7 })];
}

/** Single date: one month from today. Range: today → today + 1 month */
export function getNextMonthSingle(): DateTime {
  return getLocalNow({}).startOf("day").plus({ months: 1 });
}

export function getNextMonthRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today, today.plus({ months: 1 })];
}

/** Single date: 3 months from today. Range: today → today + 3 months */
export function getNextQuarterSingle(): DateTime {
  return getLocalNow({}).startOf("day").plus({ months: 3 });
}

export function getNextQuarterRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today, today.plus({ months: 3 })];
}

/** Single date: one year from today. Range: today → today + 1 year */
export function getNextYearSingle(): DateTime {
  return getLocalNow({}).startOf("day").plus({ years: 1 });
}

export function getNextYearRange(): [DateTime, DateTime] {
  const today = getLocalNow({}).startOf("day");
  return [today, today.plus({ years: 1 })];
}

/** Single date: 7 days from today */
export function getNextWeekSingle(): DateTime {
  return getLocalNow({}).startOf("day").plus({ days: 7 });
}

// --- Single shortcut constants (import and use as-is or compose into arrays) ---

export const TODAY_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.TODAY,
  label: fullKey(SHORTCUT_KEYS.TODAY),
  getDate: () => getToday(),
};

export const NEXT_WEEK_SINGLE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_WEEK,
  label: fullKey(SHORTCUT_KEYS.NEXT_WEEK),
  getDate: () => getNextWeekSingle(),
};

export const NEXT_MONTH_SINGLE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_MONTH,
  label: fullKey(SHORTCUT_KEYS.NEXT_MONTH),
  getDate: () => getNextMonthSingle(),
};

export const NEXT_QUARTER_SINGLE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_QUARTER,
  label: fullKey(SHORTCUT_KEYS.NEXT_QUARTER),
  getDate: () => getNextQuarterSingle(),
};

export const NEXT_YEAR_SINGLE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_YEAR,
  label: fullKey(SHORTCUT_KEYS.NEXT_YEAR),
  getDate: () => getNextYearSingle(),
};

export const LAST_4_WEEKS_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.LAST_4_WEEKS,
  label: fullKey(SHORTCUT_KEYS.LAST_4_WEEKS),
  getDate: () => getLast4WeeksRange(),
};

export const LAST_WEEK_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.LAST_WEEK,
  label: fullKey(SHORTCUT_KEYS.LAST_WEEK),
  getDate: () => getLastWeekRange(),
};

export const LAST_QUARTER_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.LAST_QUARTER,
  label: fullKey(SHORTCUT_KEYS.LAST_QUARTER),
  getDate: () => getLastQuarterRange(),
};

export const MONTH_TO_DATE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.MONTH_TO_DATE,
  label: fullKey(SHORTCUT_KEYS.MONTH_TO_DATE),
  getDate: () => getMonthToDateRange(),
};

export const YEAR_TO_DATE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.YEAR_TO_DATE,
  label: fullKey(SHORTCUT_KEYS.YEAR_TO_DATE),
  getDate: () => getYearToDateRange(),
};

export const NEXT_WEEK_RANGE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_WEEK,
  label: fullKey(SHORTCUT_KEYS.NEXT_WEEK),
  getDate: () => getNextWeekRange(),
};

export const NEXT_MONTH_RANGE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_MONTH,
  label: fullKey(SHORTCUT_KEYS.NEXT_MONTH),
  getDate: () => getNextMonthRange(),
};

export const NEXT_QUARTER_RANGE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_QUARTER,
  label: fullKey(SHORTCUT_KEYS.NEXT_QUARTER),
  getDate: () => getNextQuarterRange(),
};

export const NEXT_YEAR_RANGE_SHORTCUT: ShortcutItem = {
  id: SHORTCUT_KEYS.NEXT_YEAR,
  label: fullKey(SHORTCUT_KEYS.NEXT_YEAR),
  getDate: () => getNextYearRange(),
};

/**
 * React hook that provides date picker shortcuts with translated labels.
 * Uses the Kaizen i18n context (useTranslation + useKaizenI18nInstance).
 *
 * @returns A record of ShortcutItem keyed by ShortcutKey. DatePicker expects
 *          `shortcuts` to be an array, so build one from the keys you need, e.g.:
 *          single-date: [shortcuts.today, shortcuts.nextWeek, ...]
 *          range: [shortcuts.last4weeks, shortcuts.lastWeek, ...]
 *
 * @example
 * const shortcuts = useDatePickerShortcuts();
 * <DatePicker mode="single" shortcuts={[shortcuts.today, shortcuts.nextWeek, shortcuts.nextMonth, shortcuts.nextQuarter, shortcuts.nextYear]} ... />
 * <DatePicker mode="range" shortcuts={[shortcuts.last4weeks, shortcuts.lastWeek, shortcuts.lastQuarter, shortcuts.monthToDate, shortcuts.yearToDate]} ... />
 */
export function useDatePickerShortcuts(): Record<ShortcutKey, ShortcutItem> {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const createShortcutItem = (
    shortcutDefinition: ShortcutItem,
  ): ShortcutItem => {
    return {
      ...shortcutDefinition,
      label: String(
        // @ts-expect-error - t is not typed correctly
        t(`${DATE_PICKER_SHORTCUT_KEY_PREFIX}.${shortcutDefinition.id}`),
      ),
    };
  };

  return {
    [SHORTCUT_KEYS.TODAY]: createShortcutItem(TODAY_SHORTCUT),
    [SHORTCUT_KEYS.NEXT_WEEK]: createShortcutItem(NEXT_WEEK_SINGLE_SHORTCUT),
    [SHORTCUT_KEYS.NEXT_MONTH]: createShortcutItem(NEXT_MONTH_SINGLE_SHORTCUT),
    [SHORTCUT_KEYS.NEXT_QUARTER]: createShortcutItem(
      NEXT_QUARTER_SINGLE_SHORTCUT,
    ),
    [SHORTCUT_KEYS.NEXT_YEAR]: createShortcutItem(NEXT_YEAR_SINGLE_SHORTCUT),
    [SHORTCUT_KEYS.LAST_4_WEEKS]: createShortcutItem(LAST_4_WEEKS_SHORTCUT),
    [SHORTCUT_KEYS.LAST_WEEK]: createShortcutItem(LAST_WEEK_SHORTCUT),
    [SHORTCUT_KEYS.LAST_QUARTER]: createShortcutItem(LAST_QUARTER_SHORTCUT),
    [SHORTCUT_KEYS.MONTH_TO_DATE]: createShortcutItem(MONTH_TO_DATE_SHORTCUT),
    [SHORTCUT_KEYS.YEAR_TO_DATE]: createShortcutItem(YEAR_TO_DATE_SHORTCUT),
  };
}
