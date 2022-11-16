import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import pickBy from 'lodash/pickBy';

import {
  offers,
  offersPaginated,
  compatiblePacks,
  similarOffers,
  offerByDay,
  offersByMetaActivity,
  offersByEstablishment,
  offersFilterActions,
  offerMarketplaceListActions,
  offerMarketplaceByMetaActivityListActions,
  offerBulkActions,
  retrieveActions,
  retrieveByIdActions,
  bookedGenderActions,
  offerStatusActions,
  listRegisteredIds,
  numberOfMassDisabledOfferRetrieveActions,
  numberOfMassDisabledOfferInGroupActions,
  offerNextActions,
  massUnTagAllOffers,
  unTagOfferActions,
  createOffersActions,
  editOffersActions,
  disableOfferActions,
  hardDeleteOfferActions,
  fetchOffersInGroupAction,
  bookingGuestNumberActions,
  listOffersWithPendingReplacementRequestActions,
  listOffersWithRefusedReplacementRequestActions,
  setStoredOffersInGroupsDataActions,
} from './actions';
import { OfferState } from './types';

export const marketplaceByMetaActivityEmptyState = Immutable({
  allIds: [],
  nextPage: 1,
  count: 0,
  byId: {},
  loading: false,
});

const initialState: Immutable.Immutable<OfferState> = Immutable<OfferState>({
  // event stuff (simplified offer objects)
  calendar: [],
  paginatedCalendar: {
    next_page: null,
    page: null,
    count: 0,
    links: {
      next: null,
      previous: null,
    },
    results: [],
  },
  calendarByObject: {
    metaActivity: [],
    establishment: [],
    loading: false,
    error: null,
  },
  loading: true,
  error: null,

  create: {
    error: null,
    loading: false,
  },
  edit: {
    error: null,
    loading: false,
  },
  // final version theorically
  byId: {},
  byDay: { loading: false, error: null, allIds: [] },
  retrieve: { loading: false, error: null, data: null },
  bulk: { loading: false, error: null },

  // for forms
  similarOffers: {
    count: 0,
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
  next: {
    item: null,
    loading: false,
    error: null,
  },

  marketplace: {
    loading: false,
    error: null,
    allIds: [],
    byMetaActivity: {},
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
  numberOfMassDisabledOffer: {
    loading: false,
    error: null,
    number: null,
  },
  numberOfMassDisabledOfferInGroup: {
    loading: false,
    error: null,
    allIds: null,
  },
  tagManagement: {
    loading: false,
    error: null,
  },
  disable: {
    loading: false,
    error: null,
  },
  delete: {
    loading: false,
    error: null,
  },
  groups: {},
  bookingGuest: {
    bookingGuestNumberLeft: 0,
  },
  hasPendingReplacementRequest: {
    loading: false,
    error: null,
    byOfferId: {},
  },
  hasRefusedReplacementRequest: {
    loading: false,
    error: null,
    byOfferId: {},
  },
});

export default handleActions<Immutable.Immutable<OfferState>>(
  {
    [createOffersActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['create', 'loading'], payload);
    },
    [createOffersActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['create', 'error'], payload);
    },
    [editOffersActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['edit', 'loading'], payload);
    },
    [editOffersActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['edit', 'error'], payload);
    },
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
    [offersPaginated.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [offersPaginated.error.toString()]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [offersPaginated.success.toString()]: (state, { payload }) => {
      return state.setIn(['paginatedCalendar'], payload);
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
        .setIn(['similarOffers', 'count'], 0)
        .setIn(['similarOffers', 'next_page'], 1);
    },
    [similarOffers.successPaginated.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['similarOffers', 'items'],
          [...state.similarOffers.items, ...payload.results],
        )
        .setIn(['similarOffers', 'next_page'], payload.next_page)
        .setIn(['similarOffers', 'lastFetched'], new Date())
        .setIn(['similarOffers', 'count'], payload.count)
        .setIn(['similarOffers', 'page'], payload.page);
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
    [offerMarketplaceByMetaActivityListActions.init.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.marketplace.byMetaActivity[payload]?.allIds) {
        return state.setIn(
          ['marketplace', 'byMetaActivity', payload],
          marketplaceByMetaActivityEmptyState,
        );
      }
      return state;
    },
    [offerMarketplaceListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['marketplace', 'loading'], payload);
    },
    [offerMarketplaceByMetaActivityListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['marketplace', 'byMetaActivity', payload.metaActivityId, 'allIds'],
          uniq([
            ...(state.marketplace.byMetaActivity?.[payload.metaActivityId]
              ?.allIds ?? []),
            ...(payload?.value?.results?.map((o) => o.id) ?? []),
          ]),
        )
        .setIn(
          ['marketplace', 'byMetaActivity', payload.metaActivityId, 'nextPage'],
          payload?.value?.next_page,
        )
        .setIn(
          ['marketplace', 'byMetaActivity', payload.metaActivityId, 'count'],
          payload?.value?.count,
        )
        .merge(
          {
            byId:
              payload?.value?.results?.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}) ?? {},
          },
          { deep: true },
        );
    },
    [offerMarketplaceByMetaActivityListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['marketplace', 'byMetaActivity', payload.metaActivityId, 'error'],
        payload.value,
      );
    },
    [offerMarketplaceByMetaActivityListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['marketplace', 'byMetaActivity', payload.metaActivityId, 'loading'],
        payload.value,
      );
    },
    [offerMarketplaceByMetaActivityListActions.reset.toString()]: (state) => {
      return state.setIn(['marketplace', 'byMetaActivity'], {});
    },
    [offerNextActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['next', 'error'], payload);
    },
    [offerNextActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['next', 'loading'], payload);
    },
    [offerNextActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['next', 'item'], payload);
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
      return state.setIn(['registered', 'error'], payload);
    },
    [listRegisteredIds.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['registered', 'loading'], payload);
    },
    [listRegisteredIds.success.toString()]: (state, { payload }) => {
      return state.setIn(['registered', 'allIds'], payload);
    },
    [numberOfMassDisabledOfferRetrieveActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['numberOfMassDisabledOffer', 'error'], payload);
    },
    [numberOfMassDisabledOfferRetrieveActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['numberOfMassDisabledOffer', 'loading'], payload);
    },
    [numberOfMassDisabledOfferRetrieveActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['numberOfMassDisabledOffer', 'number'], payload);
    },
    [numberOfMassDisabledOfferInGroupActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['numberOfMassDisabledOfferInGroup', 'error'],
        payload,
      );
    },
    [numberOfMassDisabledOfferInGroupActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['numberOfMassDisabledOfferInGroup', 'loading'],
        payload,
      );
    },
    [numberOfMassDisabledOfferInGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
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
          ['numberOfMassDisabledOfferInGroup', 'allIds'],
          payload.map((o) => o.id),
        );
    },
    [massUnTagAllOffers.error.toString()]: (state, { payload }) => {
      return state.setIn(['tagManagement', 'error'], payload);
    },
    [massUnTagAllOffers.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tagManagement', 'loading'], payload);
    },
    [unTagOfferActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['tagManagement', 'error'], payload);
    },
    [unTagOfferActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['tagManagement', 'loading'], payload);
    },
    [disableOfferActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['disable', 'error'], payload);
    },
    [disableOfferActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['disable', 'loading'], payload);
    },
    [hardDeleteOfferActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'error'], payload);
    },
    [hardDeleteOfferActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'loading'], payload);
    },
    [fetchOffersInGroupAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['groups', 'loading'], payload);
    },
    [fetchOffersInGroupAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['groups', 'error'], payload);
    },
    [fetchOffersInGroupAction.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload?.results?.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['groups', payload?.results?.[0]?.group, 'allIds'],
          payload?.results?.map((o) => o.id),
        );
    },
    [bookingGuestNumberActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['bookingGuest', 'bookingGuestNumberLeft'], payload);
    },
    [listOffersWithPendingReplacementRequestActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['hasPendingReplacementRequest', 'loading'], payload),
    [listOffersWithPendingReplacementRequestActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['hasPendingReplacementRequest', 'error'], payload),
    [listOffersWithPendingReplacementRequestActions.success.toString()]: (
      state,
      { payload },
    ) =>
      // Override this key on each fetch
      state.setIn(
        ['hasPendingReplacementRequest', 'byOfferId'],
        payload.reduce((acc, offerId) => {
          acc[offerId] = true;
          return acc;
        }, {}),
      ),
    [listOffersWithRefusedReplacementRequestActions.loading.toString()]: (
      state,
      { payload },
    ) => state.setIn(['hasRefusedReplacementRequest', 'loading'], payload),
    [listOffersWithRefusedReplacementRequestActions.error.toString()]: (
      state,
      { payload },
    ) => state.setIn(['hasRefusedReplacementRequest', 'error'], payload),
    [listOffersWithRefusedReplacementRequestActions.success.toString()]: (
      state,
      { payload },
    ) =>
      // Override this key on each fetch
      state.setIn(
        ['hasRefusedReplacementRequest', 'byOfferId'],
        payload.reduce((acc, offerId) => {
          acc[offerId] = true;
          return acc;
        }, {}),
      ),
    [setStoredOffersInGroupsDataActions.execute.toString()]: (
      state,
      { payload },
    ) => {
      const { groupId, offersIds } = payload;
      return state.setIn(
        ['groups', groupId, 'allIds'],
        Object.keys(
          pickBy(state.byId, (offer) => offersIds.includes(offer.id)),
        ),
      );
    },
  },
  initialState,
);
