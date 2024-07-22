import values from 'lodash/values';
import compact from 'lodash/compact';
import memoize from 'memoize-one';
import { createSelector } from 'reselect';
import {
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY,
  COACH_PAYMENT_RULE_FOR_WORKSHOP,
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import {
  associatedCoachSelector,
  getAllCoaches,
} from '#src/libs/associated-coach/selectors';

import type {
  // @ts-expect-error
  AssociatedCoachWithPerformance,
  Coach,
  // @ts-expect-error
  CoachPaymentRule,
  // @ts-expect-error
  CoachPaymentRuleGroup,
  // @ts-expect-error
  CoachPaymentRuleGroupAPI,
} from '#src/libs/associated-coach/types';
import { RootState } from '../../reducers';
import type { CoachPerformance } from '#src/libs/coach-payment-rules/types';

export const CoachPaymentSelector = (state: RootState, id: number) =>
  // @ts-expect-error
  state.coachPaymentRules.items[id];
const _CoachPaymentRulesDict = (state: RootState) =>
  state.coachPaymentRules.items;
export const CoachPaymentRulesSelector = (state: RootState) =>
  values(state.coachPaymentRules.items).map((rule: CoachPaymentRule) => ({
    ...rule,
    coaches: compact(
      (rule.associated_coach ?? []).map((coachId: number) =>
        associatedCoachSelector.get(state, coachId),
      ),
    ),
  }));

const selectCoachPaymentRulesItems = (state: RootState) =>
  state.coachPaymentRules.items;

export const CoachPaymentRuleByKindSelector = createSelector(
  [selectCoachPaymentRulesItems, getAllCoaches],
  (coachPaymentRulesItems, allCoaches: Array<Coach>) => {
    return {
      [COACH_PAYMENT_RULE_FOR_SESSION]: values(coachPaymentRulesItems)
        .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_SESSION)
        .map((rule: CoachPaymentRule) => ({
          ...rule,
          coaches: compact(
            (rule.associated_coach ?? []).map((coachId: number) =>
              allCoaches.find((coach) => coach.associated_coach_id === coachId),
            ),
          ),
        })),
      [COACH_PAYMENT_RULE_FOR_APPOINTMENT]: values(coachPaymentRulesItems)
        .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_APPOINTMENT)
        .map((rule: CoachPaymentRule) => ({
          ...rule,
          coaches: compact(
            rule.private_associated_coach.map((coachId: number) =>
              allCoaches.find((coach) => coach.associated_coach_id === coachId),
            ),
          ),
        })),
      [COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY]: values(coachPaymentRulesItems)
        .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY)
        .map((rule: CoachPaymentRule) => ({
          ...rule,
          coaches: compact(
            (rule.associated_coach ?? []).map((coachId: number) =>
              allCoaches.find((coach) => coach.associated_coach_id === coachId),
            ),
          ),
        })),
      [COACH_PAYMENT_RULE_FOR_WORKSHOP]: values(coachPaymentRulesItems)
        .filter((rule) => rule.kind === COACH_PAYMENT_RULE_FOR_WORKSHOP)
        .map((rule: CoachPaymentRule) => ({
          ...rule,
          coaches: compact(
            (rule.workshop_associated_coach ?? []).map((coachId: number) =>
              allCoaches.find((coach) => coach.associated_coach_id === coachId),
            ),
          ),
        })),
    };
  },
);

export const getCachedDataTimestampsList = (state: RootState) =>
  state.coachPaymentRules.performance.cached_data.allTimestamps;

export const getPerformanceCachedDataByTimestampDict = (state: RootState) =>
  state.coachPaymentRules.performance.cached_data.byTimestamp;

export const getPerformanceCachedData = (state: RootState, timestamp: number) =>
  state.coachPaymentRules.performance.cached_data.byTimestamp[timestamp];
export const getAllAssociatecCoachPerformance = (state: RootState) => {
  return {
    [COACH_PERFORMANCE_FOR_SESSION]:
      state.coachPaymentRules.performance.session.byAssociatedCoachId,
    [COACH_PERFORMANCE_FOR_APPOINTMENT]:
      state.coachPaymentRules.performance.private_service.byAssociatedCoachId,
  };
};

export const getCoachPerformanceCachedDataList = createSelector(
  [getCachedDataTimestampsList, getPerformanceCachedDataByTimestampDict],
  (cachedDataTimestampList, cachedDict) =>
    cachedDataTimestampList.map((timestamp) => cachedDict[timestamp]),
);

export const getAllAssociatecCoachPerformanceFromCachedData = (
  state: RootState,
  // @ts-expect-error
  _,
  timestamp: number | null,
) => {
  if (!timestamp) {
    return {
      [COACH_PERFORMANCE_FOR_SESSION]: [],
      [COACH_PERFORMANCE_FOR_APPOINTMENT]: [],
    };
  }
  const cached_data = getPerformanceCachedData(state, timestamp);

  return {
    [COACH_PERFORMANCE_FOR_SESSION]: cached_data?.bookings,
    [COACH_PERFORMANCE_FOR_APPOINTMENT]: cached_data?.private_bookings,
  };
};

export const withCachedCoachPerformance = memoize((selector: any) =>
  createSelector(
    [selector, getAllAssociatecCoachPerformanceFromCachedData],
    (associatedCoachList: Coach | Array<Coach>, coachPerformance) => {
      if (Array.isArray(associatedCoachList)) {
        return associatedCoachList
          .filter(
            (associatedCoach) =>
              coachPerformance[COACH_PERFORMANCE_FOR_SESSION][
                associatedCoach.associated_coach_id
              ] ||
              coachPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT][
                associatedCoach.associated_coach_id
              ],
          )
          .map((ass) => ({
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
              performanceLoading:
                coachPerformance[COACH_PERFORMANCE_FOR_SESSION][
                  ass.associated_coach_id
                  // @ts-expect-error
                ]?.loading ||
                coachPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT][
                  ass.associated_coach_id
                  // @ts-expect-error
                ]?.loading ||
                false,
            },
          }));
      }
      return associatedCoachList;
    },
  ),
);

export const withCoachPerformance = memoize((selector: any) =>
  createSelector(
    [selector, getAllAssociatecCoachPerformance],
    (
      associatedCoachList: Coach | Array<Coach>,
      coachPerformance,
    ): Coach | AssociatedCoachWithPerformance[] => {
      if (!associatedCoachList) {
        return associatedCoachList;
      }
      if (Array.isArray(associatedCoachList)) {
        return associatedCoachList.map((ass) => ({
          ...ass,
          performance: {
            [COACH_PERFORMANCE_FOR_SESSION]:
              // @ts-expect-error
              coachPerformance[COACH_PERFORMANCE_FOR_SESSION][
                ass.associated_coach_id
              ]?.data,
            [COACH_PERFORMANCE_FOR_APPOINTMENT]:
              // @ts-expect-error
              coachPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT][
                ass.associated_coach_id
              ]?.data,
            performanceLoading:
              // @ts-expect-error
              coachPerformance[COACH_PERFORMANCE_FOR_SESSION][
                ass.associated_coach_id
              ]?.loading ||
              // @ts-expect-error
              coachPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT][
                ass.associated_coach_id
              ]?.loading ||
              false,
          },
        }));
      }

      return {
        ...associatedCoachList,
        // @ts-expect-error
        performance: {
          [COACH_PERFORMANCE_FOR_SESSION]:
            // @ts-expect-error
            coachPerformance[COACH_PERFORMANCE_FOR_SESSION][
              associatedCoachList.associated_coach_id
            ]?.data,
          [COACH_PERFORMANCE_FOR_APPOINTMENT]:
            // @ts-expect-error
            coachPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT][
              associatedCoachList.associated_coach_id
            ]?.data,
          performanceLoading:
            // @ts-expect-error
            coachPerformance[COACH_PERFORMANCE_FOR_SESSION][
              associatedCoachList.associated_coach_id
            ]?.loading ||
            // @ts-expect-error
            coachPerformance[COACH_PERFORMANCE_FOR_APPOINTMENT][
              associatedCoachList.associated_coach_id
            ]?.loading ||
            false,
        },
      };
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

/**
 * Get the list of all coach IDs of all payment rule groups from redux
 */
export const getCoachPaymentRuleGroupListCoaches = createSelector(
  [getCoachPaymentRuleGroupsIds, getCoachPaymentRuleGroupsDict],
  (
    coachPaymentRuleGroupIds: number[],
    coachPaymentRuleGroupById: CoachPaymentRuleGroupAPI,
  ) => {
    const coachPaymentRuleGroupList: CoachPaymentRuleGroup[] =
      coachPaymentRuleGroupIds.map((id) => coachPaymentRuleGroupById[id]);

    return (coachPaymentRuleGroupList ?? [])
      .map((group) => group.associated_coach)
      .flat();
  },
);

const _getCoachPaymentRulesItemsById = (state: RootState) =>
  state.coachPaymentRules.items;

const _getCoachPaymentRulesItemsAllIds = (state: RootState) =>
  Object.keys(state.coachPaymentRules.items).map(Number);

/**
 * Get the list of all coach IDs of all payment rules from redux
 */
export const getCoachPaymentRuleListCoaches = createSelector(
  [_getCoachPaymentRulesItemsAllIds, _getCoachPaymentRulesItemsById],
  (
    coachPaymentRulesItemsAllIds: number[],
    coachPaymentRulesItemsById: {
      [key: number]: CoachPaymentRule;
    },
  ) => {
    const coachPaymentRuleList = coachPaymentRulesItemsAllIds.map(
      (id) => coachPaymentRulesItemsById[id],
    );

    return (coachPaymentRuleList ?? [])
      .map((rule) =>
        rule.private_associated_coach.length
          ? rule.private_associated_coach
          : rule.associated_coach,
      )
      .flat();
  },
);

const _getFetchedCoachPrivateServiceIds = (state: RootState) =>
  state.coachPaymentRules.performance.private_service.byAssociatedCoachId;

/**
 * Get the list of all coach IDs whose data on private services performance was already fetched and is on Redux
 */
export const getFetchedCoachPrivateServicePerformanceIds = createSelector(
  [_getFetchedCoachPrivateServiceIds],
  (fetchedCoachPrivateServiceIds: {
    [coach_id: number]: Array<CoachPerformance>;
  }) => {
    return Object.keys(fetchedCoachPrivateServiceIds).map((id) => Number(id));
  },
);

const _getFetchedCoachSessionIds = (state: RootState) =>
  state.coachPaymentRules.performance.session.byAssociatedCoachId;

/**
 * Get the list of all coach IDs whose data on session performance was already fetched and is on Redux
 */
export const getFetchedCoachSessionPerformanceIds = createSelector(
  [_getFetchedCoachSessionIds],
  (fetchedCoachSessionIds: { [coach_id: number]: Array<CoachPerformance> }) => {
    return Object.keys(fetchedCoachSessionIds).map((id) => Number(id));
  },
);
