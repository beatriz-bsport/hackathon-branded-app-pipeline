import { ErrorAndLoading } from '#libs/types';
import type { Coach } from '../associated-coach/types';

export type BonusCoachPaymentRule = {
  id: number;
  coach_payment_rule: number;
  applicability: number;
  kind: number;
  bonus: number;
  lower_interval: number;
  upper_interval: number | null;
};

export type CoachPaymentRule = {
  id?: number;
  name: String;
  kind: number;
  base_remuneration: number;
  min_remuneration: number;
  max_remuneration: number;
  tax_rate: number;
  exclude_cancelled_from_confirmed_bookings: boolean;
  excluded_payment_packs: Array<number>;
  bonuses: Array<BonusCoachPaymentRule>;
  associated_coach: Array<number>;
  private_associated_coach: Array<number>;
};

export type CoachPerformance = {
  session_id?: number;
  private_booking_id?: number;
  session_name?: string;
  private_service_name?: string;
  date_start: string;
  duration_minute: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  coach_total_payment: number;
  base_remuneration: string;
  coach_bonus: string;
  tax_rate: string;
  performanceLoading?: boolean;
  error: boolean;
  coach_payment_rule: number;
  is_unpaid?: boolean;
  last_update?: number;
  total_margin_value: number;
};

export type CoachPaymentRulesByKind = {
  [kind: number]: Array<CoachPaymentRule>;
};
export type CoachPaymentRuleGroupAPI = {
  id: number;
  name: string;
  company: number;
  session_coach_payment_rule?: number;
  workshop_coach_payment_rule?: number;
  private_service_coach_payment_rule?: number;
  private_slots_coach_payment_rules: Array<{
    private_slot: Number;
    coach_payment_rule: number;
  }>;
  associated_coach: Array<number>;
};
export type CoachPaymentRuleGroup = {
  id: number;
  name: string;
  company: number;
  session_coach_payment_rule?: CoachPaymentRule;
  workshop_coach_payment_rule?: CoachPaymentRule;
  private_service_coach_payment_rule?: CoachPaymentRule;
  private_slots_coach_payment_rules: Array<number>;
  associated_coach: Array<Coach>;
};

export type CoachPerformanceCachedData = {
  timestamp: number;
  bookings: { [coach_id: number]: Array<CoachPerformance> };
  private_bookings: { [coach_id: number]: Array<CoachPerformance> };
  metadata: {
    date_start: string;
    date_end: string;
  };
};

export type CoachPaymentRuleState = {
  items: { [key: number]: CoachPaymentRule } | {};
  upsert: ErrorAndLoading;
  dialog: boolean;
  simulationDialog: boolean;
  groupDialog: boolean;
  simulation: {
    result: Object | {};
  } & ErrorAndLoading;
  performance: {
    session: {
      byAssociatedCoachId:
        | {
            [id: number]: {
              data: Array<CoachPerformance>;
              loading: boolean;
            };
          }
        | {};
    };
    private_service: {
      byAssociatedCoachId:
        | {
            [id: number]: Array<CoachPerformance>;
          }
        | {};
    };
    cached_data: {
      allTimestamps: Array<number>;
      byTimestamp: { [timestamp: number]: CoachPerformanceCachedData };
    } & ErrorAndLoading;
  } & ErrorAndLoading;
  groups: {
    allIds: Array<number>;
    byId: { [key: number]: CoachPaymentRuleGroup };
  } & ErrorAndLoading;
} & ErrorAndLoading;
