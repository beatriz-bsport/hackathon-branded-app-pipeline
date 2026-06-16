import { useMemo } from "react";

import { useFetchMembersByIds } from "#src/hooks/appointment/fetch/useFetchMembersByIds";
import { useFetchRecurrenceRuleBookings } from "#src/hooks/booking/fetch/use-fetch-recurrence-rule-bookings";

import {
  type RecurringBookingRow,
  buildRecurringBookingRows,
} from "./build-recurring-booking-rows";

/** A class realistically never has more than this many recurring members. */
const RECURRING_BOOKINGS_PAGE_SIZE = 50;

export const useRecurringBookings = (
  sessionId: number,
): { count: number; rows: RecurringBookingRow[] } => {
  // Suspense query — the SessionPanel parent provides the boundary.
  const { data } = useFetchRecurrenceRuleBookings({
    offer: sessionId,
    page_size: RECURRING_BOOKINGS_PAGE_SIZE,
  });

  const rules = data.results;
  const memberIds = rules.map((rule) => rule.member);

  // Non-suspense batch fetch. This runs at card mount (not modal-open), so the
  // member batch is typically resolved before the user opens the modal; rows
  // tolerate the transient not-yet-resolved case (empty name/initials).
  const { data: membersById } = useFetchMembersByIds(memberIds);

  // 50 is a generous per-session bound (a class realistically never has that many
  // recurring members). If count ever exceeded it, the card still shows the true
  // count and the modal lists the first 50 — an accepted edge, not silent truncation.
  return useMemo(
    () => ({
      count: data.count,
      rows: buildRecurringBookingRows(rules, membersById ?? {}),
    }),
    [data.count, rules, membersById],
  );
};
