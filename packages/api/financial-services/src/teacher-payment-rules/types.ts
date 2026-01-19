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
  id: number;
  name: string;
  kind: number;
  base_remuneration: number;
  min_remuneration: number;
  max_remuneration: number;
  tax_rate: number;
  exclude_cancelled_from_confirmed_bookings: boolean;
  excluded_payment_packs: number[];
  bonuses: BonusCoachPaymentRule[];
  associated_coach: number[];
  private_associated_coach: number[];
  workshop_associated_coach: number[];
};
