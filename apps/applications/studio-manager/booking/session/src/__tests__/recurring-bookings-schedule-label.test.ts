import { describe, expect, it } from "vitest";

import { getWeekdayTranslationKey } from "#src/components/session-panel/recurring-bookings-section/schedule-label";

describe("getWeekdayTranslationKey", () => {
  it("maps Monday (rule 0) to ISO key 1", () => {
    expect(getWeekdayTranslationKey(0)).toBe("session.weekdays.1");
  });

  it("maps Sunday (rule 6) to ISO key 7", () => {
    expect(getWeekdayTranslationKey(6)).toBe("session.weekdays.7");
  });
});
