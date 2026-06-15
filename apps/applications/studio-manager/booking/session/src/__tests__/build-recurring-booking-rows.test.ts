import { describe, expect, it } from "vitest";

import type { RecurrenceRuleBooking } from "@bsport/api-book";
import type { Member } from "@bsport/api-cdp/member";

import { buildRecurringBookingRows } from "#src/components/session-panel/recurring-bookings-section/build-recurring-booking-rows";

const rule = (
  over: Partial<RecurrenceRuleBooking> = {},
): RecurrenceRuleBooking => ({
  id: 1,
  member: 100,
  delay_week: 2,
  day_of_week: 0,
  hour: 16,
  minute: 0,
  meta_activity: 5,
  establishment: 7,
  notify_if_booked: true,
  ...over,
});

const member = (over: Partial<Member> = {}): Member =>
  ({
    id: 100,
    name: "Alex Martin",
    first_name: "Alex",
    last_name: "Martin",
    photo: "https://example.com/a.jpg",
    ...over,
  }) as Member;

describe("buildRecurringBookingRows", () => {
  it("joins a rule with its member", () => {
    const rows = buildRecurringBookingRows([rule()], { "100": member() });
    expect(rows).toEqual([
      {
        id: 1,
        memberId: 100,
        memberName: "Alex Martin",
        memberPhoto: "https://example.com/a.jpg",
        memberInitials: "AM",
        dayOfWeek: 0,
        hour: 16,
        minute: 0,
        week: 2,
      },
    ]);
  });

  it("degrades gracefully when the member is not yet resolved", () => {
    const rows = buildRecurringBookingRows([rule({ member: 999 })], {});
    expect(rows[0]).toMatchObject({
      memberId: 999,
      memberName: "",
      memberPhoto: undefined,
      memberInitials: "",
    });
  });
});
