import lodash from 'lodash';
import memoize from 'memoize-one';
import { createSelector } from 'reselect';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import type { State } from '../../state/types';
import { getCoach } from '../associated-coach/selectors';
import type { CoachPaymentRule } from './types';

export const CoachPaymentSelector = (state: State, id: number) =>
  state.coachPaymentRules.items[id];
export const CoachPaymentRulesSelector = (state: State) =>
  lodash
    .values(state.coachPaymentRules.items)
    .map((rule: CoachPaymentRule) => ({
      ...rule,
      coaches: lodash.compact(
        rule.associated_coach.map((coachId: number) =>
          getCoach(state, coachId),
        ),
      ),
    }));

export const CoachPaymentRuleByKindSelector = (state: State) => {
  return {
    [COACH_PAYMENT_RULE_FOR_SESSION]: lodash
      .values(state.coachPaymentRules.items)
      .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_SESSION)
      .map((rule: CoachPaymentRule) => ({
        ...rule,
        coaches: lodash.compact(
          rule.associated_coach.map((coachId: number) =>
            getCoach(state, coachId),
          ),
        ),
      })),
    [COACH_PAYMENT_RULE_FOR_APPOINTMENT]: lodash
      .values(state.coachPaymentRules.items)
      .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_APPOINTMENT)
      .map((rule: CoachPaymentRule) => ({
        ...rule,
        coaches: lodash.compact(
          rule.associated_coach.map((coachId: number) =>
            getCoach(state, coachId),
          ),
        ),
      })),
  };
};

export const getAssociatedCoachSessionPerformance = (
  state: State,
  associatedCoachId: number,
) =>
  state.coachPaymentRules.performance.session.byAssociatedCoachId[
    associatedCoachId
  ];
export const getAssociatedCoachPrivateServicePerformance = (
  state: State,
  associatedCoachId: number,
) =>
  state.coachPaymentRules.performance.private_service.byAssociatedCoachId[
    associatedCoachId
  ];

export const getAssociatedCoachPerformances = (
  state: State,
  associatedCoachId: number,
) => {
  return {
    [COACH_PERFORMANCE_FOR_SESSION]:
      state.coachPaymentRules.performance.session.byAssociatedCoachId[
        associatedCoachId
      ],
    [COACH_PERFORMANCE_FOR_APPOINTMENT]:
      state.coachPaymentRules.performance.private_service.byAssociatedCoachId[
        associatedCoachId
      ],
  };
};

export const getAllAssociatecCoachPerformance = (state: State) => {
  return {
    [COACH_PERFORMANCE_FOR_SESSION]:
      state.coachPaymentRules.performance.session.byAssociatedCoachId,
    [COACH_PERFORMANCE_FOR_APPOINTMENT]:
      state.coachPaymentRules.performance.private_service.byAssociatedCoachId,
  };
};

export const withCoachPerformance = memoize((selector: any) =>
  createSelector(
    [selector, getAllAssociatecCoachPerformance],
    (
      associatedCoachList: AssociatedCoach | Array<AssociatedCoach>,
      coachPerformance,
    ) => {
      if (Array.isArray(associatedCoachList)) {
        return associatedCoachList.map((ass) => ({
          ...ass,
          performance: {
            [COACH_PERFORMANCE_FOR_SESSION]:
              coachPerformance[COACH_PERFORMANCE_FOR_SESSION][
                ass.associated_coach_id
              ],
            [COACH_PERFORMANCE_FOR_APPOINTMENT]:
              coachPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT][
                ass.associated_coach_id
              ],
          },
        }));
      }
      return associatedCoachList;
    },
  ),
);
