import type {
  CreateMemberDateJoinedFilterPayload,
  UpdateMemberDateJoinedFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

export type MemberSignUpDateFilterFormValue = {
  id?: number;
  smartlist: number;
  signUpDate: DateFilterValue;
};

export type MemberSignUpDateFilterCreatePayload =
  CreateMemberDateJoinedFilterPayload;

export type MemberSignUpDateDirtyPatchPayload =
  UpdateMemberDateJoinedFilterPayload;

export type MemberSignUpDateFilterCardProps = {
  smartlistId: string;
  filterValue: MemberSignUpDateFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
