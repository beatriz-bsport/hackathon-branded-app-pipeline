// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  notificationRuleListActions,
  notificatonRuleCreateOrUpdateActions,
  eventTypeListActions,
  deleteNotificationRuleActions,
  tagAvailableListActions,
  notificationRuleSettingsListActions,
  notificationRuleSettingUpdateActions,
} from './actions';

import type { NotificationRuleState } from './types';

const initialState: NotificationRuleState = Immutable({
  rule: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  tag: {
    loading: false,
    error: null,
    data: {},
  },
  eventType: {
    data: [],
    loading: false,
    error: null,
  },
  settings: {
    data: [],
    loading: false,
    error: null,
    update: {
      loading: false,
      error: null,
    },
  },
});

export default handleActions(
  {
    [tagAvailableListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['tag', 'loading'], payload);
    },
    [tagAvailableListActions.error]: (state, { payload }) => {
      return state.setIn(['tag', 'error'], payload);
    },
    [tagAvailableListActions.success]: (state, { payload }) => {
      return state.setIn(['tag', 'data'], payload);
    },
    [notificationRuleListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['rule', 'byId'],
          payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        )
        .setIn(
          ['rule', 'allIds'],
          payload.map((pc) => pc.id),
        );
    },

    [notificationRuleListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['rule', 'loading'], payload);
    },

    [notificationRuleListActions.error]: (state, { payload }) => {
      return state.setIn(['rule', 'error'], payload);
    },
    [notificatonRuleCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['rule', 'createOrUpdate', 'error'], payload);
    },
    [notificatonRuleCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['rule', 'createOrUpdate', 'loading'], payload);
    },
    [deleteNotificationRuleActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['rule', 'allIds'],
          state.rule.allIds.filter((i) => i !== payload),
        )
        .updateIn(['rule', 'byId'], (x) => x.without(`${payload}`));
    },
    [eventTypeListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['eventType', 'loading'], payload);
    },
    [eventTypeListActions.success]: (state, { payload }) => {
      return state.setIn(['eventType', 'data'], payload);
    },
    [eventTypeListActions.error]: (state, { payload }) => {
      return state.setIn(['eventType', 'error'], payload);
    },
    [notificationRuleSettingsListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['settings', 'loading'], payload);
    },
    [notificationRuleSettingsListActions.error]: (state, { payload }) => {
      return state.setIn(['settings', 'error'], payload);
    },
    [notificationRuleSettingsListActions.success]: (state, { payload }) => {
      return state.setIn(['settings', 'data'], payload);
    },
    [notificationRuleSettingUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['settings', 'update', 'loading'], payload);
    },
    [notificationRuleSettingUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['settings', 'update', 'error'], payload);
    },
    [notificationRuleSettingUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['settings', 'data'], [payload]);
    },
  },
  initialState,
);
