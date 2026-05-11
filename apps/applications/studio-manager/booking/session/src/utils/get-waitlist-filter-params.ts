import type { BookingOptionListParams } from "@bsport/api-book";

import { WaitlistFilter } from "#src/stores/session-management/types";

type WaitlistFilterParams = Pick<
  BookingOptionListParams,
  "cancelled" | "is_convertible"
>;

export const getWaitlistFilterParams = (
  waitlistFilter: WaitlistFilter,
): WaitlistFilterParams => ({
  cancelled: waitlistFilter === WaitlistFilter.CANCELLED,
  ...(waitlistFilter === WaitlistFilter.IS_CONVERTIBLE && {
    is_convertible: true,
  }),
});
