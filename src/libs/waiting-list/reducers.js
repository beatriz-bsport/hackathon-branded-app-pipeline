// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  byOfferActions,
  discardOptionActions,
  registerOptionActions,
  configurationDetail,
  configurationUpdate,
} from './actions';

import type { WaitingListState } from './types';

const initialState: WaitingListState = Immutable({
  option: {
    items: [],
    loading: false,
    error: null,
    register: {
      loading: false,
      error: null,
    },
    discard: {
      loading: false,
      error: null,
    },
  },
  configuration: {
    data: null,
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
    [configurationDetail.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [configurationDetail.error]: (state, { payload }) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    [configurationDetail.success]: (state, { payload }) => {
      return state.setIn(['configuration', 'data'], payload);
    },
    [configurationUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'update', 'loading'], payload);
    },
    [configurationUpdate.error]: (state, { payload }) => {
      return state.setIn(['configuration', 'update', 'error'], payload);
    },

    [byOfferActions.isLoading]: (state, { payload }) => {
      return state.setIn(['option', 'loading'], payload);
    },
    [byOfferActions.error]: (state, { payload }) => {
      return state.setIn(['option', 'error'], payload);
    },
    [byOfferActions.success]: (state, { payload }) => {
      return state.setIn(['option', 'items'], payload);
    },

    [byOfferActions.isLoading]: (state, { payload }) => {
      return state.setIn(['option', 'loading'], payload);
    },
    [byOfferActions.error]: (state, { payload }) => {
      return state.setIn(['option', 'error'], payload);
    },
    [byOfferActions.success]: (state, { payload }) => {
      return state.setIn(['option', 'items'], payload);
    },

    [discardOptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['option', 'discard', 'loading'], payload);
    },
    [discardOptionActions.error]: (state, { payload }) => {
      return state.setIn(['option', 'discard', 'error'], payload);
    },
    [discardOptionActions.success]: (state, { payload }) => {
      return state.setIn(
        ['option', 'items'],
        state.option.items.filter((bo) => bo.id !== payload),
      );
    },
    [registerOptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['option', 'register', 'loading'], payload);
    },
    [registerOptionActions.error]: (state, { payload }) => {
      return state.setIn(['option', 'register', 'error'], payload);
    },
    [registerOptionActions.success]: (state, { payload }) => {
      return state.setIn(['option', 'items'], [...state.option.items, payload]);
    },
  },
  initialState,
);
