import type {
  CreateMemberDateJoinedFilterPayload,
  UpdateMemberDateJoinedFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type MemberSignUpDateFilterFormValue = {
  id?: number;
  smartlist: number;
  signUpDate: DateFilterValue;
};

export type MemberSignUpDateFilterCreatePayload =
  CreateMemberDateJoinedFilterPayload;

export type MemberSignUpDateDirtyPatchPayload =
  UpdateMemberDateJoinedFilterPayload;

export type MemberSignUpDateFilterCardProps =
  SegmentFilterCardProps<MemberSignUpDateFilterFormValue>;
