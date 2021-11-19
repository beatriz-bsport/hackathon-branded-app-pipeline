// @flow

import compact from 'lodash/compact';
import values from 'lodash/values';

import type { State } from '../../state/types';

import { getCoach } from '../associated-coach/selectors';

import type { PaymentRule } from './types';

export const paymentRuleSelector = (state: State, id: number) =>
  state.paymentRules.items[id];

export const paymentRulesSelector = (state: State) =>
  values(state.paymentRules.items).map((rule: PaymentRule) => ({
    ...rule,
    coaches: compact(
      rule.coaches.map((coachId: number) => getCoach(state, coachId)),
    ),
  }));
