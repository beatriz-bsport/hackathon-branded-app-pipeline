// @flow

import lodash from 'lodash';

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { offers, compatiblePacks, offerByDay } from '../actions/offer.actions';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  calendar: [],
  loading: true,
  error: false,

  // By Day
  offers: [],

  // Compatible Packs
  compatiblePacks: {
    items: [],
    loading: false,
    error: null,
  },
});

const REFRESHED_INTERVAL = 60 * 60 * 24 * 5;

export default handleActions(
  {
    [authActionTypes.DISCONNECT]: () => initialState,
    [offers.isLoading]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [offers.error]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [offers.success]: (state, { payload }) => {
      return state
        .setIn(['calendar'], payload)
        .setIn(['lastFetched'], new Date());
    },
    [compatiblePacks.isLoading]: (state, { payload }) => {
      return state.setIn(['compatiblePacks', 'loading'], payload);
    },
    [compatiblePacks.error]: (state, { payload }) => {
      return state.setIn(['compatiblePacks', 'error'], payload);
    },
    [compatiblePacks.success]: (state, { payload }) => {
      return state
        .setIn(['compatiblePacks', 'items'], payload)
        .setIn(['compatiblePacks', 'lastFetched'], new Date());
    },
    [offerByDay.isLoading]: (state, { payload }) => {
      const items = state.offers.filter(
        (o) => o.lastRefresh - new Date() / 1000 < REFRESHED_INTERVAL,
      );
      return state.setIn(['byDay', 'loading'], payload).set('offers', items);
    },
    [offerByDay.error]: (state, { payload }) => {
      return state.setIn(['byDay', 'error'], payload);
    },
    [offerByDay.success]: (state, { payload }) => {
      const oldItems = state.offers;
      const newItems = payload.map((o) => ({
        ...o,
        lastRefresh: new Date() / 1000,
      }));
      const newIds = newItems.map((o) => o.id);
      const allItems = lodash.uniqBy(
        [].concat(
          newItems,
          oldItems.filter(
            (old) => newIds.findIndex((idx) => old.id === idx) < 0,
          ),
          'id',
        ),
      );
      return state.set('offers', allItems);
    },
  },
  initialState,
);
