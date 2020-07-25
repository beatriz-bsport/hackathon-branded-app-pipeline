// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  byOfferActions,
  discardOptionActions,
  registerOptionActions,
  configurationDetail,
  configurationUpdate,
  asConsumerActions,
  forBookingActions,
} from './actions';

import type { WaitingListState } from './types';

const initialState: WaitingListState = Immutable({
  option: {
    items: [],
    byId: {},
    loading: false,
    error: null,
    register: {
      loading: false,
      error: null,
    },
    forBooking: {
      loading: false,
      error: null,
      allIds: [],
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
    [asConsumerActions.isLoading]: (state, { payload }) => {
      return state.setIn(['option', 'loading'], payload);
    },
    [asConsumerActions.error]: (state, { payload }) => {
      return state.setIn(['option', 'error'], payload);
    },
    [asConsumerActions.success]: (state, { payload }) => {
      return state.setIn(['option', 'items'], payload);
    },
    [forBookingActions.isLoading]: (state, { payload }) => {
      return state.setIn(['option', 'forBooking', 'loading'], payload);
    },
    [forBookingActions.reset]: (state) => {
      return state.setIn(['option', 'forBooking', 'allIds'], []);
    },
    [forBookingActions.error]: (state, { payload }) => {
      return state.setIn(['option', 'forBooking', 'error'], payload);
    },
    [forBookingActions.success]: (state, { payload }) => {
      return state
        .setIn(['option', 'forBooking', 'allIds'], payload.map((bo) => bo.id))
        .merge(
          {
            option: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
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
        [
          'option',
          'items',
          state.option.items.findIndex((bo) => bo.id === payload.id),
        ],
        payload,
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
