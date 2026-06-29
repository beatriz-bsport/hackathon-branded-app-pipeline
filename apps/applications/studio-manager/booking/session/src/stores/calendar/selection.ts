import {
  type DateTime,
  getLocalNow,
  getMonthBounds,
  getWeekBounds,
  isSameDay,
  modifyTime,
} from "@bsport/datetime-manipulation";

import { CalendarView, DateSelection } from "#src/types";
import { isInRange } from "#src/utils/dates";

/**
 * Derives the store's DateSelection for a given view from a single anchor day.
 * Day -> single; Week -> locale-aware week range; Month -> whole-month range.
 */
export const deriveSelection = (
  view: CalendarView,
  anchorDate: DateTime,
  locale: string,
): DateSelection => {
  if (view === CalendarView.WEEKLY) {
    const { start, end } = getWeekBounds(anchorDate, locale);
    return { type: "range", minDate: start, maxDate: end, anchor: anchorDate };
  }
  if (view === CalendarView.MONTHLY) {
    const { start, end } = getMonthBounds(anchorDate);
    return { type: "range", minDate: start, maxDate: end, anchor: anchorDate };
  }
  return { type: "single", date: anchorDate };
};

/**
 * The representative day of the current selection: the day itself for single,
 * the preserved anchor for week/month. Falls back to the range start (minDate)
 * for anchor-less ranges (legacy persisted state), then today defensively.
 */
export const getAnchorDate = (selection: DateSelection): DateTime => {
  if (selection.type === "single") {
    return selection.date;
  }
  return (
    selection.anchor ??
    selection.minDate ??
    selection.maxDate ??
    getLocalNow({})
  );
};

/** Steps the current anchor by one unit of the active view (re-snapping is done by deriveSelection). */
export const getSteppedAnchor = (
  view: CalendarView,
  selection: DateSelection,
  operator: "plus" | "minus",
): DateTime => {
  const duration =
    view === CalendarView.WEEKLY
      ? { week: 1 }
      : view === CalendarView.MONTHLY
        ? { month: 1 }
        : { day: 1 };
  return modifyTime({ datetime: getAnchorDate(selection), duration, operator });
};

/**
 * Re-snaps the selection when the locale changes. Only WEEKLY is locale-dependent
 * (Day is a single day; Month bounds are locale-independent), so other views are
 * returned unchanged. Re-deriving from the preserved anchor keeps the user's
 * chosen day, now expressed in the new locale's week start. For legacy anchor-less
 * ranges we fall back to the middle of the range (its 4th day): the range was
 * computed under the OLD locale's start-of-week, so its first day can fall into a
 * neighbouring week under the new locale, but its middle stays in the same week.
 */
export const reSnapSelectionToLocale = (
  view: CalendarView,
  selection: DateSelection,
  locale: string,
): DateSelection => {
  if (
    view !== CalendarView.WEEKLY ||
    selection.type !== "range" ||
    !selection.minDate
  ) {
    return selection;
  }
  const anchor =
    selection.anchor ??
    modifyTime({
      datetime: selection.minDate,
      duration: { day: 3 },
      operator: "plus",
    });
  return deriveSelection(view, anchor, locale);
};

/** Whether today falls inside the current selection (same day for single, within bounds for a range). */
export const isTodayInSelection = (
  selection: DateSelection,
  today: DateTime,
): boolean =>
  selection.type === "single"
    ? isSameDay(selection.date, today)
    : isInRange(today, selection.minDate, selection.maxDate);

/**
 * Persist migration: legacy users have calendarView "range" (no longer a valid view).
 * Map it to WEEKLY, re-deriving the selection to that week's bounds from the old range start.
 * Other fields (columns, show-cancelled) are preserved by returning the same object reference.
 */
export const migrateLegacyRangeView = <
  T extends {
    calendarView: CalendarView;
    selectedDate: DateSelection;
    locale: string;
  },
>(
  state: T,
): T => {
  if ((state.calendarView as string) === "range") {
    const anchor = getAnchorDate(state.selectedDate);
    return {
      ...state,
      calendarView: CalendarView.WEEKLY,
      selectedDate: deriveSelection(CalendarView.WEEKLY, anchor, state.locale),
    };
  }
  return state;
};
