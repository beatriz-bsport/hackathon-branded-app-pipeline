// @flow
import { createSelector } from 'reselect';

import type { State } from '../../state/types';

export const getEventList = (state: State) =>
  state.notificationRule.eventType.data;

const getRuleData = (state: State) => state.notificationRule.rule.byId;
const getRuleListIds = (state: State) => state.notificationRule.rule.allIds;

export const getTagCategories = (state: State) =>
  state.notificationRule.tag.data;

const getRuleList = createSelector(
  [getRuleData, getRuleListIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getEventListWithRule = createSelector(
  [getEventList, getRuleList],
  (eventList, ruleList) => {
    return eventList
      .map(([eventId]) => ({
        notification_event: eventId,
        rule: ruleList.find(
          (r) => !!r.company && r.notification_event === eventId,
        ),
      }))
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
