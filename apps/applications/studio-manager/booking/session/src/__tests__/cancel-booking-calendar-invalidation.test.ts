import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { sessionKeys } from "@bsport/api-book";

/**
 * Regression test for BOO-2949.
 *
 * The /calendar list caches its sessions (with the `nb_bookings`/`effectif`
 * enrolled count, e.g. "1/2") under `sessionKeys.managerList(params)`.
 * Cancelling a booking on the session-management page must refresh that count.
 *
 * TanStack Query invalidation is PREFIX based, so the cancel mutation has to
 * invalidate a key that is a prefix of `managerList`. `useCancelBooking` used
 * to invalidate only `sessionKeys.detail(sessionId)`, which is NOT a prefix of
 * the list key (its 3rd element is a numeric id, never the literal "list"), so
 * the calendar count stayed stale. The fix invalidates `sessionKeys.all`,
 * mirroring `useRegisterBooking` (the book path, which always worked).
 */
describe("cancel booking → calendar session-list invalidation (BOO-2949)", () => {
  const calendarListKey = sessionKeys.managerList({
    min_date: "2026-06-18",
    max_date: "2026-06-19",
  });

  const seedCalendarList = () => {
    const queryClient = new QueryClient();
    // The /calendar cache holding a session that shows "1/2".
    queryClient.setQueryData(calendarListKey, [
      { id: 1, nb_bookings: 1, effectif: 2 },
    ]);
    return queryClient;
  };

  it("documents the bug: invalidating sessionKeys.detail leaves the calendar list stale", async () => {
    const queryClient = seedCalendarList();

    await queryClient.invalidateQueries({ queryKey: sessionKeys.detail(1) });

    expect(queryClient.getQueryState(calendarListKey)?.isInvalidated).toBe(
      false,
    );
  });

  it("verifies the fix: invalidating sessionKeys.all refreshes the calendar list", async () => {
    const queryClient = seedCalendarList();

    await queryClient.invalidateQueries({ queryKey: sessionKeys.all });

    expect(queryClient.getQueryState(calendarListKey)?.isInvalidated).toBe(
      true,
    );
  });
});
