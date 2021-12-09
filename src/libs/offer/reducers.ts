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
  offerStatusActions,
  listRegisteredIds,
} from './actions';
import { OfferState } from './types';

const initialState: Immutable.Immutable<OfferState> = Immutable<OfferState>({
  // event stuff (simplified offer objects)
  calendar: [],
  calendarByObject: {
    metaActivity: [],
    establishment: [],
    loading: false,
    error: null,
  },
  loading: true,
  error: null,

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
    lastFetched: null,
    next_page: 1,
  },

  // Compatible Packs
  compatiblePacks: {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
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
  lastFetched: null,
  offerStatus: {
    byId: {},
    error: null,
    loading: false,
  },
  registered: {
    loading: false,
    error: null,
    allIds: [],
  },
});

export default handleActions<Immutable.Immutable<OfferState>>(
  {
    [offersByMetaActivity.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'loading'], payload);
    },
    [offersFilterActions.setOpen.toString()]: (state, { payload }) => {
      return state.setIn(['managerFilter', 'open'], payload);
    },
    [offersFilterActions.toogleOpen.toString()]: (state) => {
      return state.setIn(['managerFilter', 'open'], !state.managerFilter.open);
    },
    [offersFilterActions.setFilters.toString()]: (state, { payload }) => {
      return state.setIn(['managerFilter', 'filters'], payload);
    },
    [offersByMetaActivity.error.toString()]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'error'], payload);
    },
    [offersByMetaActivity.success.toString()]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'metaActivity'], payload);
    },
    [offersByEstablishment.success.toString()]: (state, { payload }) => {
      return state.setIn(['calendarByObject', 'establishment'], payload);
    },
    [offers.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [offers.error.toString()]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [offers.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['calendar'], payload)
        .setIn(['lastFetched'], new Date());
    },
    [similarOffers.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['similarOffers', 'loading'], payload);
    },
    [similarOffers.error.toString()]: (state, { payload }) => {
      return state.setIn(['similarOffers', 'error'], payload);
    },
    [similarOffers.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['similarOffers', 'items'], payload)
        .setIn(['similarOffers', 'lastFetched'], new Date());
    },
    [similarOffers.reset.toString()]: (state) => {
      return state
        .setIn(['similarOffers', 'items'], [])
        .setIn(['similarOffers', 'next_page'], 1);
    },
    [similarOffers.successPaginated.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['similarOffers', 'items'],
          [...state.similarOffers.items, ...payload.results],
        )
        .setIn(['similarOffers', 'next_page'], payload.next_page)
        .setIn(['similarOffers', 'lastFetched'], new Date());
    },
    [compatiblePacks.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['compatiblePacks', 'loading'], payload);
    },
    [compatiblePacks.error.toString()]: (state, { payload }) => {
      return state.setIn(['compatiblePacks', 'error'], payload);
    },
    [compatiblePacks.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['compatiblePacks', 'items'], payload)
        .setIn(['compatiblePacks', 'lastFetched'], new Date());
    },
    [offers.delete.toString()]: (state, { payload }) => {
      const items = state.calendar.filter((o) => o.id !== payload);
      return state.set('calendar', items);
    },
    [offerByDay.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['byDay', 'loading'], payload);
    },
    [offerByDay.error.toString()]: (state, { payload }) => {
      return state.setIn(['byDay', 'error'], payload);
    },
    [retrieveActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'data'], payload);
    },
    [retrieveActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'error'], payload);
    },
    [retrieveActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'loading'], payload);
    },
    [offerByDay.bulk.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [offerByDay.success.toString()]: (state, { payload }) => {
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
        .setIn(
          ['byDay', 'allIds'],
          payload.map((o) => o.id),
        );
    },
    [offerMarketplaceListActions.success.toString()]: (state, { payload }) => {
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
        .setIn(
          ['marketplace', 'allIds'],
          payload.map((o) => o.id),
        );
    },
    [offerMarketplaceListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['marketplace', 'error'], payload);
    },
    [offerMarketplaceListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['marketplace', 'loading'], payload);
    },
    [offerBulkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['bulk', 'error'], payload);
    },
    [offerBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['bulk', 'loading'], payload);
    },
    [offerBulkActions.success.toString()]: (state, { payload }) => {
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
    [retrieveByIdActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'error'], payload);
    },
    [retrieveByIdActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'loading'], payload);
    },
    [retrieveByIdActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [bookedGenderActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['genderCount', 'loading'], payload);
    },
    [bookedGenderActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['genderCount', 'error'], payload);
    },
    [bookedGenderActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['genderCount', 'allIds'],
          payload.map((ps) => ps.id),
        )
        .merge(
          {
            genderCount: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [offerStatusActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['offerStatus', 'loading'], payload);
    },
    [offerStatusActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['offerStatus', 'error'], payload);
    },
    [offerStatusActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['offerStatus', 'byId', payload.id], payload);
    },
    [offerStatusActions.list.toString()]: (state, { payload }) => {
      return state.merge(
        {
          offerStatus: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [listRegisteredIds.error.toString()]: (state, { payload }) => {
      return state.setIn(['loggedMemberBookedOffers', 'error'], payload);
    },
    [listRegisteredIds.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['loggedMemberBookedOffers', 'loading'], payload);
    },
    [listRegisteredIds.success.toString()]: (state, { payload }) => {
      return state.setIn(['registered', 'allIds'], payload);
    },
  },
  initialState,
);
