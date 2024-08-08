import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import pickBy from 'lodash/pickBy';

import {
  updateRollCallOfferRetrieveActions,
  updateRollCallOfferByIdActions,
} from '#src/libs/booking/actions';
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
  postRollCallActions,
  postRollCallBulkActions,
  offerStatusWaitingListPositionActions,
  updateInternalNoteActions,
  similarOffersReworked,
} from './actions';
import type { OfferREST, OfferState } from './types';

export const marketplaceByMetaActivityEmptyState = Immutable({
  allIds: [],
  nextPage: 1,
  count: 0,
  byId: {},
  loading: false,
});

const initialState: Immutable.Immutable<OfferState> = Immutable<OfferState>({
  // event stuff (simplified offer objects)
  // @ts-expect-error
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

  // Only used on the old booking flow, looking to be deprecated
  similarOffers: {
    count: 0,
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
    next_page: 1,
  },

  similarOffersReworked: {
    page: 1,
    next_page: null,
    previous_page: null,
    count: 0,
    loading: false,
    error: null,
    offers: {
      allIds: [],
      byId: {},
    },
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
  offerStatusWaitinglistPosition: {
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
  // @ts-expect-error
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
  rollCall: {
    loading: false,
    error: null,
  },
  rollCallBulk: {
    loading: false,
    error: null,
  },
  updateInternalNote: {
    loading: false,
    error: null,
  },
});

type PayloadReduceType<T> = { [id: number]: T };
export default handleActions<Immutable.Immutable<OfferState>>(
  {
    [similarOffersReworked.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['similarOffersReworked', 'loading'], payload);
    },
    [similarOffersReworked.error.toString()]: (state, { payload }) => {
      return state.setIn(['similarOffersReworked', 'error'], payload);
    },
    [similarOffersReworked.reset.toString()]: (state) => {
      return state
        .setIn(['similarOffersReworked', 'offers', 'allIds'], [])
        .setIn(['similarOffersReworked', 'offers', 'byId'], {})
        .setIn(['similarOffersReworked', 'count'], 0)
        .setIn(['similarOffersReworked', 'page'], 1)
        .setIn(['similarOffersReworked', 'next_page'], null)
        .setIn(['similarOffersReworked', 'previous_page'], null)
        .setIn(['similarOffersReworked', 'loading'], false)
        .setIn(['similarOffersReworked', 'error'], null);
    },
    [similarOffersReworked.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      const { next_page, results, count, page } = payload;

      // @ts-expect-error
      const newIds = results?.map((offer) => offer.id) || [];
      const allIds = Array.from(
        new Set([...state.similarOffersReworked.offers.allIds, ...newIds]),
      );
      return state
        .setIn(['similarOffersReworked', 'page'], page)
        .setIn(['similarOffersReworked', 'next_page'], next_page)
        .setIn(['similarOffersReworked', 'count'], count)
        .setIn(['similarOffersReworked', 'offers', 'allIds'], allIds)
        .merge(
          {
            similarOffersReworked: {
              offers: {
                // @ts-expect-error
                byId: (results || []).reduce<PayloadReduceType<OfferREST>>(
                  // @ts-expect-error
                  (acc, offer) => {
                    acc[offer.id] = offer;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
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
      return (
        state
          .setIn(
            ['similarOffers', 'items'],
            // @ts-expect-error
            [...state.similarOffers.items, ...payload.results],
          )
          // @ts-expect-error
          .setIn(['similarOffers', 'next_page'], payload.next_page)
          .setIn(['similarOffers', 'lastFetched'], new Date())
          // @ts-expect-error
          .setIn(['similarOffers', 'count'], payload.count)
          // @ts-expect-error
          .setIn(['similarOffers', 'page'], payload.page)
      );
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
      // @ts-expect-error
      const items = state.calendar.filter((o) => o.id !== payload);
      return state.set('calendar', items);
    },
    [disableOfferActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      const items = state.calendar.filter((o) => o.id !== payload.id);
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
      // @ts-expect-error
      return state.setIn(['byId', payload.id], payload);
    },
    [offerByDay.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            // @ts-expect-error
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['byDay', 'allIds'],
          // @ts-expect-error
          payload.map((o) => o.id),
        );
    },
    [offerMarketplaceListActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            // @ts-expect-error
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['marketplace', 'allIds'],
          // @ts-expect-error
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
      // @ts-expect-error
      if (!state.marketplace.byMetaActivity[payload]?.allIds) {
        return state.setIn(
          // @ts-expect-error
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
          // @ts-expect-error
          ['marketplace', 'byMetaActivity', payload.metaActivityId, 'allIds'],
          uniq([
            // @ts-expect-error
            ...(state.marketplace.byMetaActivity?.[payload.metaActivityId]
              ?.allIds ?? []),
            // @ts-expect-error
            ...(payload?.value?.results?.map((o) => o.id) ?? []),
          ]),
        )
        .setIn(
          // @ts-expect-error
          ['marketplace', 'byMetaActivity', payload.metaActivityId, 'nextPage'],
          // @ts-expect-error
          payload?.value?.next_page,
        )
        .setIn(
          // @ts-expect-error
          ['marketplace', 'byMetaActivity', payload.metaActivityId, 'count'],
          // @ts-expect-error
          payload?.value?.count,
        )
        .merge(
          {
            byId:
              // @ts-expect-error
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
        // @ts-expect-error
        ['marketplace', 'byMetaActivity', payload.metaActivityId, 'error'],
        // @ts-expect-error
        payload.value,
      );
    },
    [offerMarketplaceByMetaActivityListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['marketplace', 'byMetaActivity', payload.metaActivityId, 'loading'],
        // @ts-expect-error
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
          // @ts-expect-error
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
      // @ts-expect-error
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
          // @ts-expect-error
          payload.map((ps) => ps.id),
        )
        .merge(
          {
            genderCount: {
              // @ts-expect-error
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
      // @ts-expect-error
      return state.setIn(['offerStatus', 'byId', payload.id], payload);
    },
    [offerStatusActions.list.toString()]: (state, { payload }) => {
      return state.merge(
        {
          offerStatus: {
            // @ts-expect-error
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },

    [offerStatusWaitingListPositionActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['offerStatusWaitinglistPosition', 'loading'],
        payload,
      );
    },
    [offerStatusWaitingListPositionActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['offerStatusWaitinglistPosition', 'error'], payload);
    },
    [offerStatusWaitingListPositionActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['offerStatusWaitinglistPosition', 'byId', payload.id],
        payload,
      );
    },
    [offerStatusWaitingListPositionActions.list.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          offerStatusWaitinglistPosition: {
            // @ts-expect-error
            byId: payload.reduce((acc, offerPositionDetails) => {
              acc[offerPositionDetails.id] = offerPositionDetails;
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
            // @ts-expect-error
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['numberOfMassDisabledOfferInGroup', 'allIds'],
          // @ts-expect-error
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
            // @ts-expect-error
            byId: payload?.results?.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          // @ts-expect-error
          ['groups', payload?.results?.[0]?.group, 'allIds'],
          // @ts-expect-error
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
        // @ts-expect-error
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
        // @ts-expect-error
        payload.reduce((acc, offerId) => {
          acc[offerId] = true;
          return acc;
        }, {}),
      ),
    [setStoredOffersInGroupsDataActions.execute.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      const { groupId, offersIds } = payload;
      return state.setIn(
        ['groups', groupId, 'allIds'],
        Object.keys(
          pickBy(state.byId, (offer) => offersIds.includes(offer.id)),
        ),
      );
    },
    [postRollCallActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['rollCall', 'loading'], payload);
    },
    [postRollCallActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['rollCall', 'error'], payload);
    },
    [postRollCallBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['rollCallBulk', 'loading'], payload);
    },
    [postRollCallBulkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['rollCallBulk', 'error'], payload);
    },
    [updateRollCallOfferRetrieveActions.successNeedsValidation.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['retrieve', 'data', 'roll_call_needs_validation'],
        payload,
      );
    },
    [updateRollCallOfferRetrieveActions.successDate.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['retrieve', 'data', 'date_roll_call_last_modified'],
        payload,
      );
    },
    [updateRollCallOfferByIdActions.successNeedsValidation.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['byId', payload.id, 'roll_call_needs_validation'],
        // @ts-expect-error
        payload.roll_call_needs_validation,
      );
    },
    [updateRollCallOfferByIdActions.successDate.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['byId', payload.id, 'date_roll_call_last_modified'],
        // @ts-expect-error
        payload.date_roll_call_last_modified,
      );
    },
    [updateInternalNoteActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['updateInternalNote', 'loading'], payload);
    },
    [updateInternalNoteActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['updateInternalNote', 'error'], payload);
    },
  },
  initialState,
);
