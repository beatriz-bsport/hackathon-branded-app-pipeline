import type {
  CreateReferrerFilterPayload,
  ReferrerFilter,
  SmartlistReferrerComparator,
} from "@bsport/api-cdp/smartlist";

export type ReferrerFilterFormValue = {
  id?: number;
  smartlist: number;
  comparator_referred: SmartlistReferrerComparator;
  value_referred: number;
  value_second_referred: number;
  value_obtained_reward_active: boolean;
  value_obtained_reward: number;
  value_second_reward: number;
  comparator_reward: SmartlistReferrerComparator;
  value_obtained_money_active: boolean;
  value_obtained_money: number;
  value_second_obtained_money: number;
  comparator_obtained_money: SmartlistReferrerComparator;
};

export type ReferrerFilterDirtyPatchPayload = Partial<
  Omit<ReferrerFilter, "id" | "company_id" | "smartlist" | "filter_identifier">
>;

export type ReferrerFilterCreatePayload = CreateReferrerFilterPayload;

export type ReferrerFilterCardProps = {
  smartlistId: string;
  filterValue: ReferrerFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};
