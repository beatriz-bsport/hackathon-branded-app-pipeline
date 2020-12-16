// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types.ts';

const _getTaskData = (state: State) => {
  return state.reminder.task.byId;
};
const _getTaskMemberList = (state: State) => {
  return state.reminder.task.byMember.allIds;
};

export const memberTaskListSelector = createSelector(
  [_getTaskMemberList, _getTaskData],
  (ids, data) => ids.map((id) => data[id]),
);
