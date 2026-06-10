import { moneyObtainedReferredMembersSubFilterModule } from "./money-obtained/module";
import type { ReferredMembersSubFilterId } from "./referred-members-sub-filter-id";
import type { ReferredMembersSubFilterModule } from "./referred-members-sub-filter-module-contract";

export const REGISTERED_REFERRED_MEMBERS_SUB_FILTERS: ReferredMembersSubFilterModule[] =
  [moneyObtainedReferredMembersSubFilterModule];

export const REGISTERED_REFERRED_MEMBERS_SUB_FILTERS_BY_ID =
  REGISTERED_REFERRED_MEMBERS_SUB_FILTERS.reduce(
    (accumulator, subFilterModule) => {
      accumulator[subFilterModule.id] = subFilterModule;
      return accumulator;
    },
    {} as Record<ReferredMembersSubFilterId, ReferredMembersSubFilterModule>,
  );
