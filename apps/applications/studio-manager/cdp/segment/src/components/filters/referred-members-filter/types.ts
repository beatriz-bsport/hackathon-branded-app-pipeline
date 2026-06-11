import type {
  CreateReferredMemberFilterPayload,
  ReferredMemberFilter,
  UpdateReferredMemberFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { NumericComparatorFilterValue } from "#src/components/primitive-filters/numeric-comparator-filter/types";

import type { ReferredMemberStatusOption } from "./constants";
import type { ReferredMembersSubFilterId } from "./sub-filters/referred-members-sub-filter-id";

export type ReferredMembersFilterFormValue = {
  id?: number;
  smartlist: number;
  referredStatus: ReferredMemberStatusOption;
  subFilters: ReferredMembersSubFilterId[];
  moneyObtained: NumericComparatorFilterValue;
};

export type ReferredMembersFilterCardProps = {
  smartlistId: string;
  filterValue: ReferredMembersFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type ReferredMembersFilterCreatePayload =
  CreateReferredMemberFilterPayload;
export type DirtyPatchPayload = UpdateReferredMemberFilterPayload;

export type { ReferredMemberFilter };
