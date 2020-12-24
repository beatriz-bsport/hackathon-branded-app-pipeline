// @flow

import lodash from 'lodash';

import type { State } from '../../state/types.ts';

import { getCoach } from '../associated-coach/selectors.ts';

import type { PaymentRule } from './types';

export const paymentRuleSelector = (state: State, id: number) =>
  state.paymentRules.items[id];

export const paymentRulesSelector = (state: State) =>
  lodash.values(state.paymentRules.items).map((rule: PaymentRule) => ({
    ...rule,
    coaches: lodash.compact(
      rule.coaches.map((coachId: number) => getCoach(state, coachId)),
    ),
  }));
