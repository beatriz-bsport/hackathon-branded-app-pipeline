// @flow

import type { Immutable } from 'seamless-immutable';

export type PaymentRuleBonus = {
  threshold: number,
  variable_bonus: number,
};

export type PaymentRule = {
  id: ?number,
  name: string,
  base_price: number,
  bonuses: PaymentRuleBonus[],
};

export type PaymentRulesState = Immutable<{
  items: { [number]: PaymentRule },
  loading: boolean,
  error: ?Error,
  upsert: {
    loading: boolean,
    error: ?Error,
  },
}>;

export type PaymentRulesAction = {};
