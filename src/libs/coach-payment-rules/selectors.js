import values from 'lodash/values';
import compact from 'lodash/compact';
import memoize from 'memoize-one';
import { createSelector } from 'reselect';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import { RootState } from '../../reducers';
import {
  associatedCoachSelector,
  getAllCoaches,
} from '../associated-coach/selectors';
import type { CoachPaymentRule, CoachPaymentRuleGroupAPI } from './types';

export const CoachPaymentSelector = (state: RootState, id: number) =>
  state.coachPaymentRules.items[id];
const _CoachPaymentRulesDict = (state: RootState) =>
  state.coachPaymentRules.items;
export const CoachPaymentRulesSelector = (state: RootState) =>
  values(state.coachPaymentRules.items).map((rule: CoachPaymentRule) => ({
    ...rule,
    coaches: compact(
      rule.associated_coach.map((coachId: number) =>
        associatedCoachSelector.get(state, coachId),
      ),
    ),
  }));

export const CoachPaymentRuleByKindSelector = (state: RootState) => {
  return {
    [COACH_PAYMENT_RULE_FOR_SESSION]: values(state.coachPaymentRules.items)
      .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_SESSION)
      .map((rule: CoachPaymentRule) => ({
        ...rule,
        coaches: compact(
          rule.associated_coach.map((coachId: number) =>
            associatedCoachSelector.get(state, coachId),
          ),
        ),
      })),
    [COACH_PAYMENT_RULE_FOR_APPOINTMENT]: values(state.coachPaymentRules.items)
      .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_APPOINTMENT)
      .map((rule: CoachPaymentRule) => ({
        ...rule,
        coaches: compact(
          rule.private_associated_coach.map((coachId: number) =>
            associatedCoachSelector.get(state, coachId),
          ),
        ),
      })),
  };
};

export const getAssociatedCoachSessionPerformance = (
  state: RootState,
  associatedCoachId: number,
) =>
  state.coachPaymentRules.performance.session.byAssociatedCoachId[
    associatedCoachId
  ];
export const getAssociatedCoachPrivateServicePerformance = (
  state: RootState,
  associatedCoachId: number,
) =>
  state.coachPaymentRules.performance.private_service.byAssociatedCoachId[
    associatedCoachId
  ];

export const getAssociatedCoachPerformances = (
  state: RootState,
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

export const getAllAssociatecCoachPerformance = (state: RootState) => {
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

export const getCoachPaymentRuleGroupsIds = (state: RootState) =>
  state.coachPaymentRules.groups.allIds;
export const getCoachPaymentRuleGroupsDict = (state: RootState) =>
  state.coachPaymentRules.groups.byId;
export const getCoachPaymentRuleGroups = createSelector(
  [
    getCoachPaymentRuleGroupsIds,
    getCoachPaymentRuleGroupsDict,
    getAllCoaches,
    _CoachPaymentRulesDict,
  ],
  (
    ids: Array<number>,
    groups: CoachPaymentRuleGroupAPI,
    allCoaches: Array<Coach>,
    coach_payment_rule_items: CoachPaymentRuleGroupAPI,
  ) => {
    return ids.map((id) => {
      return {
        ...groups[id],
        session_coach_payment_rule:
          coach_payment_rule_items[groups[id].session_coach_payment_rule],
        workshop_coach_payment_rule:
          coach_payment_rule_items[groups[id].workshop_coach_payment_rule],
        private_service_coach_payment_rule:
          coach_payment_rule_items[
            groups[id].private_service_coach_payment_rule
          ],
        associated_coach: compact(
          groups[id].associated_coach.map((coachId: number) =>
            allCoaches.find((coach) => coach.associated_coach_id === coachId),
          ),
        ),
      };
    });
  },
);
