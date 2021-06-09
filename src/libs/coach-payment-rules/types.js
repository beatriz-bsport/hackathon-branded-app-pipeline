import type { Immutable } from 'seamless-immutable';

export type BonusCoachPaymentRule = {
  id: number,
  coach_payment_rule: number,
  applicability: number,
  kind: number,
  bonus: number,
  lower_interval: number,
  upper_interval: number | null,
};

export type CoachPaymentRule = {
  id?: number,
  name: String,
  kind: number,
  base_remuneration: number,
  min_remuneration: number,
  max_remuneration: number,
  tax_rate: number,
  exclude_cancelled_from_confirmed_bookings: boolean,
  excluded_payment_packs: Array<number>,
  bonuses: Array<BonusCoachPaymentRule>,
  associated_coach: Array<number>,
  private_associated_coach: Array<number>,
};

export type CoachPerformance = {
  session_id: number,
  session_name: String,
  date_start: String,
  duration_minute: number,
  confirmed_bookings: number,
  cancelled_bookings: number,
  coach_total_payment: number,
  base_remuneration: String,
  coach_bonus: string,
  coach_total_payment: String,
  tax_rate: String,
};
export type CoachPaymentRuleState = Immutable<{
  items: { [number]: CoachPaymentRule },
  loading: boolean,
  error: ?Error,
  upsert: {
    loading: Boolean,
    error: ?Error,
  },
  dialog: boolean,
  simulationDialog: boolean,
  simulation: {
    error: ?Error,
    result: Object,
    loading: boolean,
  },
  performance: {
    error: ?Error,
    loading: boolean,
    byAssociatedCoachId: { [id: number]: CoachPerformance },
  },
}>;
