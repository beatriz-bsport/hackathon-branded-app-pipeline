import {
  SMARTLIST_ABSOLUTE_DATE_FILTER_TYPE,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import {
  mapDateFilterType,
  toApiDateSection,
} from "#src/components/filters/passes-filter/sub-filters/purchase-date/utils";
import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

import type { MemberSignUpDateDirtyPatchPayload } from "../types";

export type MemberSignUpDateApiDateFields =
  MemberSignUpDateDirtyPatchPayload & {
    date_filter_type: SmartlistDateFilterType;
  };

/**
 * Serializes the sign-up date primitive into API date/duration fields.
 */
export const mapSignUpDateToApiFields = (
  signUpDate: DateFilterValue,
): MemberSignUpDateApiDateFields => {
  const dateFilterType = mapDateFilterType(signUpDate);
  const section = toApiDateSection(signUpDate, dateFilterType);

  if (SMARTLIST_ABSOLUTE_DATE_FILTER_TYPE.includes(dateFilterType)) {
    const payload: MemberSignUpDateApiDateFields = {
      date_filter_type: dateFilterType,
      date: section.fromDate,
    };

    if (dateFilterType === SmartlistDateFilterType.DATE_BETWEEN) {
      payload.date_second = section.toDate;
    }

    return payload;
  }

  const payload: MemberSignUpDateApiDateFields = {
    date_filter_type: dateFilterType,
    duration: section.firstDurationValue,
  };

  if (dateFilterType === SmartlistDateFilterType.DURATION_BETWEEN) {
    payload.duration_second = section.secondDurationValue;
  }

  return payload;
};
