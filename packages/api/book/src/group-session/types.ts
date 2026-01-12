export type GroupSessionParams = {
  min_date?: string;
  max_date?: string;
  meta_activity__in?: number[];
  id__in?: number[];
};

export type PaginatedGroupSessionParams = GroupSessionParams & {
  /** Number of items per page*/
  page_size?: number;

  /** Page number of the results*/
  page: number;
};

export enum GroupSessionRecurrenceType {
  WEEKLY = 0,
  MONTHLY = 1,
  YEARLY = 2,
}

export type RecurrenceRuleGroupSession = {
  count: number;
  frequence: GroupSessionRecurrenceType;
  interval: number | null;
  until: number | null;
};

export type GroupSession = {
  id: number;
  company: number;
  meta_activity: number;
  offers: number[];
  level: number;
  full_booking_only: boolean;
  allow_booking_after_start: boolean;
  available: boolean;
  recurrence_id: string;
  name: string;
  recurrence_rule: RecurrenceRuleGroupSession;
  manager_only: boolean;
  recurrence_index: number;
  first_offer_date: string;
};
