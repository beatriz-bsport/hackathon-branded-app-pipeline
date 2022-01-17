import type { Immutable } from 'seamless-immutable';
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
  session_id: number;
  session_name: String;
  date_start: String;
  duration_minute: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  coach_total_payment: number;
  base_remuneration: String;
  coach_bonus: string;
  tax_rate: String;
  performanceLoading?: boolean;
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

export type CoachPaymentRuleState = Immutable<{
  items: { [key: number]: CoachPaymentRule };
  loading: boolean;
  error?: Error;
  upsert: {
    loading: Boolean;
    error?: Error;
  };
  dialog: boolean;
  simulationDialog: boolean;
  groupDialog: boolean;
  simulation: {
    error?: Error;
    result: Object;
    loading: boolean;
  };
  performance: {
    error?: Error;
    loading: boolean;
    session: {
      byAssociatedCoachId: {
        [id: number]: {
          data: Array<CoachPerformance>;
          loading: boolean;
        };
      };
    };
    private_service: {
      byAssociatedCoachId: {
        [id: number]: Array<CoachPerformance>;
      };
    };
  };
  groups: {
    allIds: Array<number>;
    byId: { [key: number]: CoachPaymentRuleGroup };
    loading: boolean;
    error: any;
  };
}>;
