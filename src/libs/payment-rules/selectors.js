// @flow

import lodash from 'lodash';

import type { State } from '../../state/types';

import { coachSelector } from '../../state/coaches/selectors';

import type { PaymentRule } from './types';

export const paymentRuleSelector = (state: State, id: number) =>
  state.paymentRules.items[id];

export const paymentRulesSelector = (state: State) =>
  lodash.values(state.paymentRules.items).map((rule: PaymentRule) => ({
    ...rule,
    coaches: lodash.compact(
      rule.coaches.map((coachId: number) => coachSelector(state, coachId)),
    ),
  }));
