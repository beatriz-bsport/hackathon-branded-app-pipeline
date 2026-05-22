import type { MemberDateJoinedFilter } from "@bsport/api-cdp/smartlist";

import { toFormDateSection } from "#src/components/filters/passes-filter/sub-filters/purchase-date/utils";

import type { MemberSignUpDateFilterFormValue } from "../types";

/**
 * Maps a `MemberDateJoinedFilter` row from `get_filters` into form state.
 */
export const mapMemberDateJoinedFilterToFormValue = (
  filter: MemberDateJoinedFilter,
): MemberSignUpDateFilterFormValue => ({
  id: filter.id,
  smartlist: filter.smartlist,
  signUpDate: toFormDateSection(
    filter.date_filter_type,
    filter.date ?? "",
    filter.date_second ?? "",
    filter.duration,
    filter.duration_second,
  ),
});
