// @ts-nocheck

import { faker } from '@faker-js/faker';
import { generateRandomInt } from '../../utils/factories';
import type { CoachPaymentRule, CoachPaymentRuleGroup } from './types';
import { coachesFactory } from '../associated-coach/factories';
import { Coach } from '#libs/associated-coach/types';

type CoachPaymentRulesByKind = {
  [kind: number]: Array<CoachPaymentRule>;
};

function randomBoolean() {
  const table = [true, false];
  return table[generateRandomInt(2)];
}

function randomArray(length: number) {
  const res = new Array(length).fill(0);
  return res.map(() => generateRandomInt(1000));
}

function randomBonusCoachPaymentRules(length: number) {
  const res = new Array(length).fill(0);
  const lower_upper_limit = generateRandomInt(999999, 2);
  return res.map(() => ({
    id: generateRandomInt(1000),
    coach_payment_rule: generateRandomInt(3),
    applicability: generateRandomInt(100),
    kind: generateRandomInt(100),
    bonus: generateRandomInt(1000000, 1),
    lower_interval: generateRandomInt(lower_upper_limit, 1),
    upper_interval: generateRandomInt(1000000, lower_upper_limit),
  }));
}

export function coachPaymentRuleFactory(coachId?: number): CoachPaymentRule {
  const min_remuneration = generateRandomInt(999999, 1);
  const max_remuneration = generateRandomInt(999999, min_remuneration);
  return {
    id: generateRandomInt(1000),
    name: faker.random.words(2),
    kind: generateRandomInt(100),
    base_remuneration: generateRandomInt(1000000, 0),
    min_remuneration,
    max_remuneration,
    tax_rate: generateRandomInt(20),
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
    id: generateRandomInt(1000),
    name: faker.random.words(2),
    company: generateRandomInt(1000),
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
