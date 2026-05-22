import type { PaginatedResponse } from "@bsport/store-base";

import { TagRuleKind } from "./constants";

export type Smartlist = {
  id: number;
  name: string;
  company: number;
  description: string;
  member_base: number;
  has_active_communication_group_configs: boolean;
};
export type PaginatedTagRules = PaginatedResponse<TagRule>;

/**
 * Query params for fetching tag rules
 */
export type FetchTagRulesParams = { smartlist_id: string };

export type TagRule = {
  id: number;
  company_id: number;
  smartlist: number;
  tag: number;
  kind: TagRuleKind;
  date_created: string;
};

export type CreateTagRuleParams = {
  smartlist: number;
  tag: number;
  kind: TagRuleKind;
};

export type UpdateTagRuleParams = CreateTagRuleParams & {
  id: number;
};

export type SmartlistFilterIdentifier = number;

export type SmartlistGetFiltersResponse = Record<
  string,
  Record<string, SmartlistFilterPayload>
>;

export type SmartlistFilterPayload = {
  id: number;
  smartlist: number;
  filter_identifier: SmartlistFilterIdentifier;
};

export enum SmartlistDateFilterType {
  DATE_AFTER = 0,
  DATE_BEFORE = 1,
  DATE_BETWEEN = 2,
  DATE_EXACT = 3,
  DURATION_AFTER = 4,
  DURATION_BEFORE = 5,
  DURATION_EXACT = 6,
  DURATION_BETWEEN = 7,
  DURATION_BEFORE_PAST = 9,
}

export const SMARTLIST_RELATIVE_DATE_FILTER_TYPE = [
  SmartlistDateFilterType.DURATION_AFTER,
  SmartlistDateFilterType.DURATION_BEFORE,
  SmartlistDateFilterType.DURATION_EXACT,
  SmartlistDateFilterType.DURATION_BETWEEN,
  SmartlistDateFilterType.DURATION_BEFORE_PAST,
];

export const SMARTLIST_ABSOLUTE_DATE_FILTER_TYPE = [
  SmartlistDateFilterType.DATE_AFTER,
  SmartlistDateFilterType.DATE_BEFORE,
  SmartlistDateFilterType.DATE_EXACT,
  SmartlistDateFilterType.DATE_BETWEEN,
];

export enum SmartlistCreditComparator {
  LTE = 1,
  GTE = 2,
  EQUAL = 5,
  BETWEEN = 6,
}

export enum SmartlistTotalBookingComparator {
  LTE = 1,
  GTE = 2,
  EQUAL = 5,
  BETWEEN = 6,
}

/**
 * Smartlist payment pack filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/payment_pack/
 */
export type PaymentPackFilter = SmartlistFilterPayload & {
  company_id: number;
  payment_packs: number[];
  select_all_payment_packs: boolean;
  has_pack: boolean;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date_bought: string; // ISO 8601 datetime string
  date_bought_second: string; // ISO 8601 datetime string
  duration_bought: number; // number of days, can be negative
  duration_bought_second: number; // number of days, can be negative
  credit_filter_active: boolean;
  credit_comparator: SmartlistCreditComparator;
  credit_value: string | number; // number of credits, only positive
  credit_value_second: string | number; // number of credits, only positive
  expiration_date_filter_active: boolean;
  expiration_date_filter_type: SmartlistDateFilterType;
  expiration_date: string; // ISO 8601 datetime string
  expiration_date_second: string; // ISO 8601 datetime string
  expiration_duration: number; // number of days, can be negative
  expiration_duration_second: number; // number of days, can be negative
};

export type CreatePaymentPackFilterPayload = Omit<
  PaymentPackFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdatePaymentPackFilterPayload = Partial<
  Omit<
    PaymentPackFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;

/**
 * Smartlist bookings filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/bookings/
 */
export type TotalBookingFilter = SmartlistFilterPayload & {
  company_id: number;
  comparator: SmartlistTotalBookingComparator;
  value: number;
  value_second: number;
  select_all_activities: boolean;
  activity_filter_active: boolean;
  meta_activities: number[];
  select_all_establishments: boolean;
  establishment_filter_active: boolean;
  establishments: number[];
  select_all_payment_packs: boolean;
  payment_pack_filter_active: boolean;
  payment_packs: number[];
  select_all_coaches: boolean;
  coach_filter_active: boolean;
  coaches: number[];
  level_filter_active: boolean;
  level: number[];
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string | null;
  date_second: string | null;
  duration: number | null;
  duration_second: number | null;
  hour_filter_active: boolean | null;
  hour: string | null;
  hour_second: string | null;
  attendance_filter_active: boolean | null;
  attendance: boolean | null;
};

export type CreateTotalBookingFilterPayload = Omit<
  TotalBookingFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateTotalBookingFilterPayload = Partial<
  Omit<
    TotalBookingFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;

/**
 * Smartlist tag filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/tag_filter/
 */
export type TagFilter = SmartlistFilterPayload & {
  company_id: number;
  tags_included: number[];
  tags_excluded: number[];
};

export type CreateTagFilterPayload = Omit<
  TagFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateTagFilterPayload = Partial<
  Pick<TagFilter, "tags_included" | "tags_excluded">
>;
