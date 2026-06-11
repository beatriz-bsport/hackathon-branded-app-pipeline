import type {
  CreateReferredMemberFilterPayload,
  ReferredMemberFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type {
  DirtyPatchPayload,
  ReferredMembersFilterFormValue,
} from "../types";
import type { ReferredMembersSubFilterId } from "./referred-members-sub-filter-id";
import type { ReferredMembersSubFilterSectionProps } from "./referred-members-sub-filter-section-props";

/**
 * Contract every referred-members sub-filter module must implement.
 */
export type ReferredMembersSubFilterModule = SubFilterModule<
  ReferredMembersSubFilterId,
  ReferredMembersFilterFormValue,
  ReferredMemberFilter,
  CreateReferredMemberFilterPayload,
  DirtyPatchPayload,
  ReferredMembersSubFilterSectionProps
>;
