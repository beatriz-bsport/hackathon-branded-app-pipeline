// @ts-nocheck

import faker from 'faker';
import type { CoachPaymentRule, CoachPaymentRuleGroup } from './types';
import { coachesFactory } from '../associated-coach/factories';
import { Coach } from '#libs/associated-coach/types';

type CoachPaymentRulesByKind = {
  [kind: number]: Array<CoachPaymentRule>;
};

function random_int(max: number, min: number = 0) {
  // Return a random value between min (0 if undefined) and max (max excluded)
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomBoolean() {
  const table = [true, false];
  return table[random_int(2)];
}

function randomArray(length: number) {
  const res = new Array(length).fill(0);
  return res.map(() => random_int(1000));
}

function randomBonusCoachPaymentRules(length: number) {
  const res = new Array(length).fill(0);
  const lower_upper_limit = random_int(999999, 2);
  return res.map(() => ({
    id: random_int(1000),
    coach_payment_rule: random_int(3),
    applicability: random_int(100),
    kind: random_int(100),
    bonus: random_int(1000000, 1),
    lower_interval: random_int(lower_upper_limit, 1),
    upper_interval: random_int(1000000, lower_upper_limit),
  }));
}

export function coachPaymentRuleFactory(coachId?: number): CoachPaymentRule {
  const min_remuneration = random_int(999999, 1);
  const max_remuneration = random_int(999999, min_remuneration);
  return {
    id: random_int(1000),
    name: faker.random.words(2),
    kind: random_int(100),
    base_remuneration: random_int(1000000, 0),
    min_remuneration,
    max_remuneration,
    tax_rate: random_int(20),
    exclude_cancelled_from_confirmed_bookings: randomBoolean(),
    excluded_payment_packs: randomArray(3),
    bonuses: randomBonusCoachPaymentRules(2),
    associated_coach: [coachId] ?? randomArray(3),
    private_associated_coach: randomArray(3),
  };
}

export function coachPaymentRulesFactory(
  length: number,
): Array<CoachPaymentRule> {
  const res = new Array(length).fill(0);
  return res.map(() => coachPaymentRuleFactory());
}

export function coachPaymentRulesByKindFactory(
  length: number,
): CoachPaymentRulesByKind {
  const coach_payment_rules_by_kind: CoachPaymentRulesByKind = {};
  for (let i = 0; i < length; i += 1) {
    coach_payment_rules_by_kind[i] = coachPaymentRulesFactory(3);
  }
  return coach_payment_rules_by_kind;
}

export function coachPaymentRuleGroupFactory(): CoachPaymentRuleGroup {
  return {
    id: random_int(1000),
    name: faker.random.words(2),
    company: random_int(1000),
    session_coach_payment_rule: coachPaymentRuleFactory(),
    workshop_coach_payment_rule: coachPaymentRuleFactory(),
    private_service_coach_payment_rule: coachPaymentRuleFactory(),
    private_slots_coach_payment_rules: randomArray(5),
    associated_coach: coachesFactory(5) as Coach[],
  };
}

export function coachPaymentRuleGroupsFactory(
  length: number,
): Array<CoachPaymentRuleGroup> {
  const res = new Array(length).fill(0);
  return res.map(() => coachPaymentRuleGroupFactory());
}
