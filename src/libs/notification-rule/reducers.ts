import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  notificationRuleListActions,
  notificatonRuleCreateOrUpdateActions,
  eventTypeListActions,
  tagAvailableListActions,
  notificationRuleSettingsListActions,
  notificationRuleSettingUpdateActions,
} from './actions';

import type { NotificationRuleState, NotificationRule } from './types';

const initialState: Immutable.Immutable<NotificationRuleState> =
  Immutable<NotificationRuleState>({
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

export default handleActions<Immutable.Immutable<NotificationRuleState>, any>(
  {
    [tagAvailableListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'loading'], payload);
    },
    [tagAvailableListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'error'], payload);
    },
    [tagAvailableListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['tag', 'data'], payload);
    },
    [notificationRuleListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['rule', 'byId'],
          payload.reduce(
            (acc: { [id: number]: NotificationRule }, ps: NotificationRule) => {
              acc[ps.id] = ps;
              return acc;
            },
            {},
          ),
        )
        .setIn(
          ['rule', 'allIds'],
          payload.map((pc: NotificationRule) => pc.id),
        );
    },

    [notificationRuleListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['rule', 'loading'], payload);
    },

    [notificationRuleListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['rule', 'error'], payload);
    },
    [notificatonRuleCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['rule', 'createOrUpdate', 'error'], payload);
    },
    [notificatonRuleCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['rule', 'createOrUpdate', 'loading'], payload);
    },
    [eventTypeListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['eventType', 'loading'], payload);
    },
    [eventTypeListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['eventType', 'data'], payload);
    },
    [eventTypeListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['eventType', 'error'], payload);
    },
    [notificationRuleSettingsListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['settings', 'loading'], payload);
    },
    [notificationRuleSettingsListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['settings', 'error'], payload);
    },
    [notificationRuleSettingsListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['settings', 'data'], payload);
    },
    [notificationRuleSettingUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['settings', 'update', 'loading'], payload);
    },
    [notificationRuleSettingUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['settings', 'update', 'error'], payload);
    },
    [notificationRuleSettingUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['settings', 'data'], [payload]);
    },
  },
  initialState,
);
