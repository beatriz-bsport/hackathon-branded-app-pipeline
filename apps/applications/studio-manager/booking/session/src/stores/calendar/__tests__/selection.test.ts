import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import {
  deriveSelection,
  getAnchorDate,
  getSteppedAnchor,
  isTodayInSelection,
  migrateLegacyRangeView,
  reSnapSelectionToLocale,
} from "#src/stores/calendar/selection";
import { CalendarView, DateSelection } from "#src/types";

const WED = fromIsoString("2025-01-15T10:00:00"); // Wednesday 15 Jan 2025

describe("deriveSelection", () => {
  it("DAILY returns a single selection at the anchor", () => {
    const result = deriveSelection(CalendarView.DAILY, WED, "en-GB");
    expect(result.type).toBe("single");
    if (result.type === "single") {
      expect(result.date.toISODate()).toBe("2025-01-15");
    }
  });

  it("WEEKLY (en-GB) returns Mon-Sun range around the anchor", () => {
    const result = deriveSelection(CalendarView.WEEKLY, WED, "en-GB");
    expect(result.type).toBe("range");
    if (result.type === "range") {
      expect(result.minDate?.toISODate()).toBe("2025-01-13"); // Monday
      expect(result.maxDate?.toISODate()).toBe("2025-01-19"); // Sunday
    }
  });

  it("WEEKLY (en-US) returns Sun-Sat range around the anchor", () => {
    const result = deriveSelection(CalendarView.WEEKLY, WED, "en-US");
    expect(result.type).toBe("range");
    if (result.type === "range") {
      expect(result.minDate?.toISODate()).toBe("2025-01-12"); // Sunday
      expect(result.maxDate?.toISODate()).toBe("2025-01-18"); // Saturday
    }
  });

  it("MONTHLY returns the whole month range (locale-independent)", () => {
    const result = deriveSelection(CalendarView.MONTHLY, WED, "en-US");
    expect(result.type).toBe("range");
    if (result.type === "range") {
      expect(result.minDate?.toISODate()).toBe("2025-01-01");
      expect(result.maxDate?.toISODate()).toBe("2025-01-31");
    }
  });

  it("WEEKLY stores the chosen day as the range anchor", () => {
    const result = deriveSelection(CalendarView.WEEKLY, WED, "en-GB");
    expect(result.type).toBe("range");
    if (result.type === "range") {
      expect(result.anchor?.toISODate()).toBe("2025-01-15");
    }
  });

  it("MONTHLY stores the chosen day as the range anchor", () => {
    const result = deriveSelection(CalendarView.MONTHLY, WED, "en-US");
    expect(result.type).toBe("range");
    if (result.type === "range") {
      expect(result.anchor?.toISODate()).toBe("2025-01-15");
    }
  });
});

describe("getAnchorDate", () => {
  it("returns the date for a single selection", () => {
    const selection: DateSelection = { type: "single", date: WED };
    expect(getAnchorDate(selection).toISODate()).toBe("2025-01-15");
  });

  it("falls back to minDate for an anchor-less range selection", () => {
    const selection: DateSelection = {
      type: "range",
      minDate: fromIsoString("2025-01-13T00:00:00"),
      maxDate: fromIsoString("2025-01-19T23:59:59"),
    };
    expect(getAnchorDate(selection).toISODate()).toBe("2025-01-13");
  });

  it("returns the stored anchor for a derived range selection", () => {
    const selection = deriveSelection(CalendarView.WEEKLY, WED, "en-GB");
    expect(getAnchorDate(selection).toISODate()).toBe("2025-01-15");
  });
});

describe("view switching preserves the chosen day", () => {
  it("keeps the chosen day across day -> week -> month -> day", () => {
    // Mirrors setCalendarView: deriveSelection(newView, getAnchorDate(current), locale)
    const day = deriveSelection(CalendarView.DAILY, WED, "en-GB");
    const week = deriveSelection(
      CalendarView.WEEKLY,
      getAnchorDate(day),
      "en-GB",
    );
    const month = deriveSelection(
      CalendarView.MONTHLY,
      getAnchorDate(week),
      "en-GB",
    );
    const backToDay = deriveSelection(
      CalendarView.DAILY,
      getAnchorDate(month),
      "en-GB",
    );
    expect(backToDay.type).toBe("single");
    if (backToDay.type === "single") {
      expect(backToDay.date.toISODate()).toBe("2025-01-15");
    }
  });
});

describe("getSteppedAnchor", () => {
  it("DAILY steps by one day", () => {
    const selection: DateSelection = { type: "single", date: WED };
    expect(
      getSteppedAnchor(CalendarView.DAILY, selection, "plus").toISODate(),
    ).toBe("2025-01-16");
    expect(
      getSteppedAnchor(CalendarView.DAILY, selection, "minus").toISODate(),
    ).toBe("2025-01-14");
  });

  it("WEEKLY steps the anchor by one week (preserving weekday)", () => {
    const selection = deriveSelection(CalendarView.WEEKLY, WED, "en-GB"); // anchor Wed 15th
    expect(
      getSteppedAnchor(CalendarView.WEEKLY, selection, "plus").toISODate(),
    ).toBe("2025-01-22"); // following Wednesday
    expect(
      getSteppedAnchor(CalendarView.WEEKLY, selection, "minus").toISODate(),
    ).toBe("2025-01-08"); // previous Wednesday
  });

  it("MONTHLY steps the anchor by one month (preserving day-of-month)", () => {
    const selection = deriveSelection(CalendarView.MONTHLY, WED, "en-US"); // anchor 15 Jan
    expect(
      getSteppedAnchor(CalendarView.MONTHLY, selection, "plus").toISODate(),
    ).toBe("2025-02-15");
    expect(
      getSteppedAnchor(CalendarView.MONTHLY, selection, "minus").toISODate(),
    ).toBe("2024-12-15");
  });
});

describe("isTodayInSelection", () => {
  it("single: true only on the same day", () => {
    const selection: DateSelection = { type: "single", date: WED };
    expect(isTodayInSelection(selection, WED)).toBe(true);
    expect(
      isTodayInSelection(selection, fromIsoString("2025-01-16T10:00:00")),
    ).toBe(false);
  });

  it("range: true when today falls within the bounds", () => {
    const selection = deriveSelection(CalendarView.WEEKLY, WED, "en-GB");
    expect(
      isTodayInSelection(selection, fromIsoString("2025-01-17T10:00:00")),
    ).toBe(true);
    expect(
      isTodayInSelection(selection, fromIsoString("2025-01-25T10:00:00")),
    ).toBe(false);
    expect(
      isTodayInSelection(selection, fromIsoString("2025-01-13T10:00:00")),
    ).toBe(true); // Monday boundary (minDate, inclusive)
    expect(
      isTodayInSelection(selection, fromIsoString("2025-01-19T10:00:00")),
    ).toBe(true); // Sunday boundary (maxDate, inclusive)
  });
});

describe("migrateLegacyRangeView", () => {
  it("maps a legacy 'range' view to WEEKLY anchored at the old range start", () => {
    const legacy = {
      calendarView: "range" as unknown as CalendarView,
      selectedDate: {
        type: "range",
        minDate: fromIsoString("2025-01-13T00:00:00"),
        maxDate: fromIsoString("2025-01-19T23:59:59"),
      } as DateSelection,
      locale: "en-GB",
    };
    const migrated = migrateLegacyRangeView(legacy);
    expect(migrated.calendarView).toBe(CalendarView.WEEKLY);
    expect(migrated.selectedDate.type).toBe("range");
    if (migrated.selectedDate.type === "range") {
      expect(migrated.selectedDate.minDate?.toISODate()).toBe("2025-01-13");
      expect(migrated.selectedDate.maxDate?.toISODate()).toBe("2025-01-19");
    }
  });

  it("leaves a non-range view untouched", () => {
    const state = {
      calendarView: CalendarView.DAILY,
      selectedDate: { type: "single", date: WED } as DateSelection,
      locale: "en-GB",
    };
    expect(migrateLegacyRangeView(state)).toBe(state);
  });
});

describe("reSnapSelectionToLocale", () => {
  it("re-snaps a weekly range to the new locale's week start, keeping the same week", () => {
    // en-US week of Wed 15 Jan 2025 is Sun 12 - Sat 18.
    const usWeek = deriveSelection(CalendarView.WEEKLY, WED, "en-US");
    expect(usWeek.type === "range" && usWeek.minDate?.toISODate()).toBe(
      "2025-01-12",
    );

    // Switching to en-GB (Mon start) must land on the SAME week (Mon 13 - Sun 19),
    // NOT the en-GB week of the old Sunday start (which would be Jan 6 - Jan 12).
    const gbWeek = reSnapSelectionToLocale(
      CalendarView.WEEKLY,
      usWeek,
      "en-GB",
    );
    expect(gbWeek.type).toBe("range");
    if (gbWeek.type === "range") {
      expect(gbWeek.minDate?.toISODate()).toBe("2025-01-13"); // Monday
      expect(gbWeek.maxDate?.toISODate()).toBe("2025-01-19"); // Sunday
    }
  });

  it("returns DAILY and MONTHLY selections unchanged (same reference)", () => {
    const daily = deriveSelection(CalendarView.DAILY, WED, "en-US");
    expect(reSnapSelectionToLocale(CalendarView.DAILY, daily, "en-GB")).toBe(
      daily,
    );

    // Month bounds are locale-independent, so a re-snap is a no-op.
    const monthly = deriveSelection(CalendarView.MONTHLY, WED, "en-US");
    expect(
      reSnapSelectionToLocale(CalendarView.MONTHLY, monthly, "en-GB"),
    ).toBe(monthly);
  });

  it("preserves the chosen anchor day when re-snapping to a new locale", () => {
    const usWeek = deriveSelection(CalendarView.WEEKLY, WED, "en-US"); // anchor 15th
    const gbWeek = reSnapSelectionToLocale(
      CalendarView.WEEKLY,
      usWeek,
      "en-GB",
    );
    expect(gbWeek.type === "range" && gbWeek.anchor?.toISODate()).toBe(
      "2025-01-15",
    );
  });
});
