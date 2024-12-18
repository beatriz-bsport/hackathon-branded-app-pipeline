// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listTaskByMemberActions,
  createOrUpdateActions,
  updateStatusAction,
} from './actions';

import type { ReminderState } from './types';

const initialState: ReminderState = Immutable({
  task: {
    byId: {},
    byMember: {
      allIds: [],
      loading: false,
      error: null,
    },
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
});

export default handleActions(
  {
    [listTaskByMemberActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            task: {
              byId: payload.results.reduce(
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['task', 'byMember', 'allIds'],
          payload.results.map((t) => t.id),
        );
    },
    [listTaskByMemberActions.isLoading]: (state, { payload }) => {
      return state.setIn(['task', 'byMember', 'loading'], payload);
    },
    [listTaskByMemberActions.error]: (state, { payload }) => {
      return state.setIn(['task', 'byMember', 'error'], payload);
    },
    [createOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['task', 'createOrUpdate', 'loading'], payload);
    },
    [createOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['task', 'createOrUpdate', 'error'], payload);
    },
    [createOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['task', 'byId', payload.id], payload);
    },
    [updateStatusAction.success]: (state, { payload }) => {
      return state.setIn(['task', 'byId', payload.id], payload);
    },
    [updateStatusAction.isLoading]: (state, { payload }) => {
      return state.setIn(['task', 'createOrUpdate', 'loading'], payload);
    },
    [updateStatusAction.error]: (state, { payload }) => {
      return state.setIn(['task', 'createOrUpdate', 'error'], payload);
    },
  },
  initialState,
);
