// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import {
  webhookListAction,
  webhookEventListAction,
  updateWebhookAction,
  createWebhookAction,
  deleteWebhookAction,
} from './actions';

const initialState: webhook_state = Immutable({
  loading: false,
  error: null,
  byId: {},
  allIds: [],
  // Create or Update
  upsert: {
    loading: false,
    error: null,
  },
  events: [],
});

export default handleActions(
  {
    [webhookEventListAction.success]: (state, { payload }) => {
      return state.set('events', payload);
    },
    [webhookListAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.webhookDict,
          },
          { deep: true },
        )
        .set('allIds', payload.webhookIdList);
    },
    [webhookListAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [webhookListAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [createWebhookAction.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [createWebhookAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: { [payload.id]: payload },
          },
          { deep: true },
        )
        .update(
          'allIds',
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        );
    },
    [createWebhookAction.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [updateWebhookAction.success]: (state, { payload }) => {
      return state.merge({ byId: { [payload.id]: payload } }, { deep: true });
    },

    [updateWebhookAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [updateWebhookAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteWebhookAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [deleteWebhookAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteWebhookAction.success]: (state, { payload }) => {
      return state
        .updateIn(['byId'], (x) => x.without(`${payload}`))
        .update(
          'allIds',
          (myList, removeId) => {
            const newList = myList.filter((id) => id !== removeId);
            return newList;
          },
          payload,
        );
    },
  },
  initialState,
);
