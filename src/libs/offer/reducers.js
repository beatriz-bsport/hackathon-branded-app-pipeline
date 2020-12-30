// @flow

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  offers,
  compatiblePacks,
  similarOffers,
  offerByDay,
  offersByMetaActivity,
  offersByEstablishment,
  offersFilterActions,
  offerMarketplaceListActions,
  offerBulkActions,
  retrieveActions,
  retrieveByIdActions,
  bookedGenderActions,
} from './actions';

const initialState = Immutable({
  // event stuff (simplified offer objects)
  calendar: [],
  calendarByObject: {
    metaActivity: [],
    establishment: [],
    loading: false,
    error: null,
  },
  loading: true,
  error: false,

  // final version theorically
  byId: {},
  byDay: { loading: false, error: null, allIds: [] },
  retrieve: { loading: false, error: null, data: null },
  bulk: { loading: false, error: null },

  // for forms
  similarOffers: {
    items: [],
    loading: false,
    error: null,
  },

  // Compatible Packs
  compatiblePacks: {
    items: [],
    loading: false,
    error: null,
  },

  managerFilter: {
    open: false,
    filters: {},
  },

  marketplace: {
    loading: false,
    error: null,
    allIds: [],
  },

  genderCount: {
    loading: false,
    error: null,
    byId: {},
    allIds: [],
  },
});

export default handleActions(
  {
    [offersByMetaActivity.isLoading]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'loading'], payload);
    },
    [offersFilterActions.setOpen]: (state, { payload }) => {
      return state.setIn(['managerFilter', 'open'], payload);
    },
    [offersFilterActions.toogleOpen]: (state) => {
      return state.setIn(['managerFilter', 'open'], !state.managerFilter.open);
    },
    [offersFilterActions.setFilters]: (state, { payload }) => {
      return state.setIn(['managerFilter', 'filters'], payload);
    },
    [offersByMetaActivity.error]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'error'], payload);
    },
    [offersByMetaActivity.success]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'metaActivity'], payload);
    },
    [offersByEstablishment.success]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'establishment'], payload);
    },
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
    [similarOffers.isLoading]: (state, { payload }) => {
      return state.setIn(['similarOffers', 'loading'], payload);
    },
    [similarOffers.error]: (state, { payload }) => {
      return state.setIn(['similarOffers', 'error'], payload);
    },
    [similarOffers.success]: (state, { payload }) => {
      return state
        .setIn(['similarOffers', 'items'], payload)
        .setIn(['similarOffers', 'lastFetched'], new Date());
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
    [offers.delete]: (state, { payload }) => {
      const items = state.calendar.filter((o) => o.id !== payload);
      return state.set('calendar', items);
    },
    [offerByDay.isLoading]: (state, { payload }) => {
      return state.setIn(['byDay', 'loading'], payload);
    },
    [offerByDay.error]: (state, { payload }) => {
      return state.setIn(['byDay', 'error'], payload);
    },
    [retrieveActions.success]: (state, { payload }) => {
      return state.setIn(['retrieve', 'data'], payload);
    },
    [retrieveActions.error]: (state, { payload }) => {
      return state.setIn(['retrieve', 'error'], payload);
    },
    [retrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['retrieve', 'loading'], payload);
    },
    [offerByDay.bulk]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [offerByDay.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(['byDay', 'allIds'], payload.map((o) => o.id));
    },
    [offerMarketplaceListActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(['marketplace', 'allIds'], payload.map((o) => o.id));
    },
    [offerMarketplaceListActions.error]: (state, { payload }) => {
      return state.setIn(['marketplace', 'error'], payload);
    },
    [offerMarketplaceListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['marketplace', 'loading'], payload);
    },
    [offerBulkActions.error]: (state, { payload }) => {
      return state.setIn(['bulk', 'error'], payload);
    },
    [offerBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bulk', 'loading'], payload);
    },
    [offerBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [retrieveByIdActions.error]: (state, { payload }) => {
      return state.setIn(['retrieve', 'error'], payload);
    },
    [retrieveByIdActions.isLoading]: (state, { payload }) => {
      return state.setIn(['retrieve', 'loading'], payload);
    },
    [retrieveByIdActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [bookedGenderActions.isLoading]: (state, { payload }) => {
      return state.setIn(['genderCount', 'loading'], payload);
    },
    [bookedGenderActions.error]: (state, { payload }) => {
      return state.setIn(['genderCount', 'error'], payload);
    },
    [bookedGenderActions.success]: (state, { payload }) => {
      return state
        .setIn(['genderCount', 'allIds'], payload.map((ps) => ps.id))
        .merge({
          genderCount: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true });
    },
  },
  initialState,
);
