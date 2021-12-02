import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { NotificationRule, NotificationRuleEventType } from './types';

export const getEventList = (state: RootState) =>
  state.notificationRule.eventType.data;

const getRuleData = (state: RootState) => state.notificationRule.rule.byId;
const getRuleListIds = (state: RootState) => state.notificationRule.rule.allIds;

export const getTagCategories = (state: RootState) =>
  state.notificationRule.tag.data;

const getRuleList = createSelector([getRuleData, getRuleListIds], (data, ids) =>
  ids.map((id) => data[id]),
);

const _groupEvents = (acc, v) => {
  if (acc[v.notification_group]) {
    acc[v.notification_group] = [...acc[v.notification_group], v];
    return acc;
  }
  return { ...acc, [v.notification_group]: [v] };
};

const _getEventListWithRule = createSelector(
  [getEventList, getRuleList],
  (eventList, ruleList) => {
    return eventList
      .map(
        ({
          notification_group,
          notification_event,
          is_editable,
          is_instance_specific,
        }) => ({
          notification_event,
          is_instance_specific,
          is_editable,
          notification_group,
          rule:
            ruleList.find(
              (r) =>
                r.notification_event === notification_event &&
                !!r.companies &&
                r.companies.length,
            ) ||
            ruleList.find(
              (r) => r.notification_event === notification_event && !!r.company,
            ),
        }),
      )
      .map((e) => {
        if (e.rule) return e;
        return {
          ...e,
          rule: ruleList.find(
            (r) => r.notification_event === e.notification_event,
          ),
        };
      });
  },
);

const onlyGeneric = createSelector(_getEventListWithRule, (eventWithRuleList) =>
  eventWithRuleList
    .filter(
      (eventWithRule) =>
        eventWithRule.is_editable && !eventWithRule.is_instance_specific,
    )
    .reduce(_groupEvents, {}),
);

const all = createSelector(_getEventListWithRule, (eventWithRuleList) =>
  eventWithRuleList.reduce(_groupEvents, {}),
);

export const getFranchiseNotificationRules = createSelector(
  [
    getRuleList,
    (state: RootState, notificationEventId: number) => notificationEventId,
  ],
  (ruleList, notificationEventId) =>
    ruleList.filter(
      (r) => r.notification_event === notificationEventId && !!r.franchisor,
    ),
);

export const getEventByGroup = {
  all,
  onlyGeneric,
} as unknown as {
  all: (
    state: RootState,
  ) => Record<
    string,
    (NotificationRuleEventType & { rule: NotificationRule })[]
  >;
  onlyGeneric: (
    state: RootState,
  ) => Record<
    string,
    (NotificationRuleEventType & { rule: NotificationRule })[]
  >;
};
