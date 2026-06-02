import type {
  SmartlistDateFilterType,
  SmartlistFilterPayload,
} from "../../shared/types";

/*
 * Smartlist member sign-up date filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/member_date_joined/
 */
export type MemberDateJoinedFilter = SmartlistFilterPayload & {
  company_id: number;
  date_filter_type: SmartlistDateFilterType;
  date: string | null;
  date_second: string | null;
  duration: number;
  duration_second: number;
};

export type CreateMemberDateJoinedFilterPayload = {
  smartlist: number;
  date_filter_type: SmartlistDateFilterType;
  date?: string | null;
  date_second?: string | null;
  duration?: number;
  duration_second?: number;
};

export type UpdateMemberDateJoinedFilterPayload = Partial<
  Omit<
    MemberDateJoinedFilter,
    "id" | "company_id" | "smartlist" | "filter_identifier"
  >
>;
