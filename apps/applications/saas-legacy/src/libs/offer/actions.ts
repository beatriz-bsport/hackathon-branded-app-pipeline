import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';

import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';

import { UPSELL_IDENTIFIER_SUBTEACHER_TOOL } from '#src/libs/platform-billing/upsell-identifiers';
import { isErrorWithCustomCode } from '#src/libs/utils';
import {
  Dispatch,
  OptionBackgroundCallback,
  OptionCallback,
  OptionPaginatedCallback,
  PaginatedResponse,
  ThunkAction,
} from '../../state/types';
import {
  retrieveOffer as retrieveOfferAPI,
  fetchSimilarOffers as fetchSimilarOffersAPI,
  fetchSimilarOffersUntyped as fetchSimilarOffersUntypedAPI,
  fetchAllEvents as fetchAllEventsAPI,
  fetchCompatiblePacks as fetchCompatiblePacksAPI,
  fetchOffersByDay as fetchOffersByDayAPI,
  fetchById as fetchByIdAPI,
  toggleWaitingListFreeze as toggleWaitingListFreezeAPI,
  fetchOffersList as fetchOffersListAPI,
  massDisableOffer as massDisableOfferAPI,
  restoreOffer as restoreOfferAPI,
  fetchBookedGender as fetchBookedGenderAPI,
  fetchOfferStatus as fetchOfferStatusAPI,
  fetchOfferStatusList as fetchOfferStatusListAPI,
  postUserRegistration as postUserRegistrationAPI,
  userRegistration as userRegistrationAPI,
  fetchNumberOfMassDisabledOfferAPI,
  checkOfferTagEligibility as checkOfferTagEligibilityAPI,
  unTagAllOffers as unTagAllOffersAPI,
  unTagOffer as unTagOfferAPI,
  createOffers as createOffersAPI,
  editOffers as editOffersAPI,
  disableOffer as disableOfferAPI,
  deleteOffer as deleteOfferAPI,
  fetchBookingGuestNumber as fetchBookingGuestNumberAPI,
  listOffersWithPendingReplacementRequestIds as listOffersWithPendingReplacementRequestIdsAPI,
  listOffersWithRefusedReplacementRequestIds as listOffersWithRefusedReplacementRequestIdsAPI,
  postRollCallOffer as postRollCallOfferAPI,
  postRollCallBulk as postRollCallBulkAPI,
  fetchOfferWaitingListPosition as fetchOfferWaitingListPositionAPI,
  fetchOfferWaitingListPositionList as fetchOfferWaitingListPositionListAPI,
  updateInternalNote as updateInternalNoteAPI,
} from './api';
import { monitorBackgroundTask } from '../background-task/actions';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import type { RootState } from '../../reducers';
import type {
  OfferListParams,
  OfferStatus,
  Offer,
  OfferCreate,
  OfferEdit,
  UserRegistrationParams,
  OfferStatusWaitingListPosition,
  OfferStatusParams,
  OfferREST,
  DeleteOfferPayload,
} from './types';

import chunk from 'lodash/chunk';
import { PaginationFilterParams } from '../types';

export const similarOffers = {
  isLoading: createAction('OFFERS/SIMILAR/IS_LOADING'),
  error: createAction('OFFERS/SIMILAR/ERROR'),
  success: createAction('OFFERS/SIMILAR/SUCCESS'),
  successPaginated: createAction('OFFERS/SIMILAR/SUCCESS_PAGINATED'),
  reset: createAction('OFFERS/SIMILAR/RESET'),
};

export const similarOffersReworked = {
  isLoading: createAction<boolean>('OFFERS/SIMILAR_REWORKED/IS_LOADING'),
  error: createAction<Error | null>('OFFERS/SIMILAR_REWORKED/ERROR'),
  success: createAction<PaginatedResponse<OfferREST>>(
    'OFFERS/SIMILAR_REWORKED/SUCCESS',
  ),
  reset: createAction<void>('OFFERS/SIMILAR_REWORKED/RESET'),
};

export const resetSimilarOffers = similarOffers.reset;

export const resetSimilarOffersReworked = similarOffersReworked.reset;

export function fetchSimilarOffers(
  offerId: number,
  params: any = {},
  options?: OptionCallback<Offer[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(similarOffers.isLoading(true));
    dispatch(similarOffers.error(null));
    try {
      const response = await fetchSimilarOffersUntypedAPI(offerId, params);
      // @ts-expect-error
      if (!response.data.results && !params.page) {
        dispatch(similarOffers.success([]));
        dispatch(similarOffers.success(response.data));
        if (options && options.onSuccess) {
          // @ts-expect-error
          options.onSuccess(response.data);
        }
      } else {
        dispatch(similarOffers.successPaginated(response.data));
        if (options && options.onSuccess) {
          // @ts-expect-error
          options.onSuccess(response.data.results);
        }
      }
    } catch (error) {
      dispatch(similarOffers.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(similarOffers.isLoading(false));
  };
}

export function fetchSimilarOffersReworked(
  offerId: number,
  fetchSimilarOffersParams: PaginationFilterParams,
  options?: OptionCallback<PaginatedResponse<OfferREST>>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(similarOffersReworked.isLoading(true));
    dispatch(similarOffersReworked.error(null));

    const currentState = getState().offer.similarOffersReworked;
    const nextPage = currentState.next_page ?? 1;

    const params: PaginationFilterParams = {
      page: nextPage,
      page_size: fetchSimilarOffersParams.page_size,
    };

    try {
      const response = await fetchSimilarOffersAPI(offerId, params);
      dispatch(similarOffersReworked.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(similarOffersReworked.error(error));
      options?.onError?.(error);
    }
    dispatch(similarOffersReworked.isLoading(false));
  };
}

export function fetchSimilarOffersWithReset(
  offerId: number,
  params: any = {},
  options?: OptionCallback<Offer[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(similarOffers.reset());
    dispatch(fetchSimilarOffers(offerId, params, options));
  };
}

export const offers = {
  isLoading: createAction('OFFERS/LIST/IS_LOADING'),
  error: createAction('OFFERS/LIST/ERROR'),
  success: createAction('OFFERS/LIST/SUCCESS'),
  delete: createAction('OFFERS/LIST/DELETE'),
};

export function deleteOffer(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(offers.delete(id));
    dispatch(offerByDay.delete(id));
  };
}

export const offersByMetaActivity = {
  isLoading: createAction('OFFERS/BY_META_ACTIVITY/IS_LOADING'),
  error: createAction('OFFERS/BY_META_ACTIVITY/ERROR'),
  success: createAction('OFFERS/BY_META_ACTIVITY/SUCCESS'),
};

export function fetchMetaActivityOffers(id: number, params: any = {}) {
  return async (dispatch: Dispatch) => {
    if (!Object.keys(params).length) return;
    dispatch(offersByMetaActivity.isLoading(true));
    dispatch(offersByMetaActivity.error(null));

    try {
      const response = await fetchAllEventsAPI({
        meta_activity: id,
        ...params,
      });
      dispatch(offersByMetaActivity.success(response.data));
    } catch (err) {
      dispatch(offersByMetaActivity.error(err));
    }
    dispatch(offersByMetaActivity.isLoading(false));
  };
}

export const offersByEstablishment = {
  isLoading: createAction('OFFERS/BY_ESTABLISHMENT/IS_LOADING'),
  error: createAction('OFFERS/BY_ESTABLISHMENT/ERROR'),
  success: createAction('OFFERS/BY_ESTABLISHMENT/SUCCESS'),
};

export function fetchEstablishmentEvents(id: number, params: any = {}) {
  return async (dispatch: Dispatch) => {
    if (!Object.keys(params).length) return;
    dispatch(offersByEstablishment.isLoading(true));
    dispatch(offersByEstablishment.error(null));

    try {
      const response = await fetchAllEventsAPI({
        establishment: id,
        ...params,
      });
      dispatch(offersByEstablishment.success(response.data));
    } catch (err) {
      dispatch(offersByEstablishment.error(err));
    }
    dispatch(offersByEstablishment.isLoading(false));
  };
}

export function fetchAllOffers(
  params?: any,
  options?: OptionCallback<Array<Offer>>,
) {
  return async (dispatch: Dispatch) => {
    if (!params || !Object.keys(params).length) return;
    dispatch(offers.isLoading(true));
    dispatch(offers.error(null));

    try {
      const response = await fetchAllEventsAPI(params);
      dispatch(offers.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(offers.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(offers.isLoading(false));
  };
}

export const offersPaginated = {
  isLoading: createAction('OFFERS/LIST_PAGINATED/IS_LOADING'),
  error: createAction('OFFERS/LIST_PAGINATED/ERROR'),
  success: createAction('OFFERS/LIST_PAGINATED/SUCCESS'),
  delete: createAction('OFFERS/LIST_PAGINATED/DELETE'),
};

export function fetchAllOffersPaginated(
  params?: any,
  options?: OptionCallback<Array<Offer>>,
) {
  return async (dispatch: Dispatch) => {
    if (!params || !Object.keys(params).length) return;
    dispatch(offersPaginated.isLoading(true));
    dispatch(offersPaginated.error(null));

    try {
      const response = await fetchAllEventsAPI(params);
      dispatch(offersPaginated.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      dispatch(offersPaginated.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(offersPaginated.isLoading(false));
  };
}

export const compatiblePacks = {
  isLoading: createAction('OFFERS/COMPATIBLE_PACKS/IS_LOADING'),
  error: createAction('OFFERS/COMPATIBLE_PACKS/ERROR'),
  success: createAction('OFFERS/COMPATIBLE_PACKS/SUCCESS'),
};

export function fetchCompatiblePacks(offerId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(compatiblePacks.isLoading(true));
    dispatch(compatiblePacks.error(null));
    dispatch(compatiblePacks.success([]));

    try {
      const response = await fetchCompatiblePacksAPI(offerId);
      dispatch(compatiblePacks.success(response.data));
    } catch (error) {
      dispatch(compatiblePacks.error(error));
    }
    dispatch(compatiblePacks.isLoading(false));
  };
}

export const offerByDay = {
  isLoading: createAction('OFFERS/DAY/IS_LOADING'),
  error: createAction('OFFERS/DAY/ERROR'),
  success: createAction('OFFERS/DAY/SUCCESS'),
  delete: createAction('OFFERS/DAY/DELETE'),
  reset: createAction('OFFER/DAY/RESET'),
  bulk: createAction('OFFER/DAY/RESET'),
};

export function retrieveOfferAsManager(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(offerByDay.error(null));
    try {
      const response = await fetchOffersByDayAPI({ id__in: [id] });
      // @ts-expect-error
      if (response.data.length === 1) {
        // @ts-expect-error
        dispatch(offerByDay.bulk(response.data[0]));
        // @ts-expect-error
        if (options && options.onSuccess) options.onSuccess(response.data[0]);
      }
    } catch (error) {
      dispatch(offerByDay.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(offerByDay.isLoading(false));
  };
}

export function refreshOffersByDay(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(offerByDay.error(null));
    const { year, month, day, ...filters } = params;
    try {
      const response = await fetchOffersByDayAPI({
        date: `${year}-${month < 10 ? `0${month}` : month}-${
          day < 10 ? `0${day}` : day
        }`,
        ...filters,
      });
      dispatch(offerByDay.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(offerByDay.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(offerByDay.isLoading(false));
  };
}

export function fetchOffersByDay(
  day: {
    year: number;
    month: number;
    day: number;
  },
  options: OptionCallback<Offer[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerByDay.isLoading(true));
    // @ts-expect-error
    dispatch(refreshOffersByDay(day, options));
  };
}

export const retrieveActions = {
  success: createAction('OFFER/RETRIEVE/SUCCESS'),
  error: createAction('OFFER/RETRIEVE/ERROR'),
  isLoading: createAction('OFFER/RETRIEVE/IS_LOADING'),
};

export function fetchOfferById(id: number, options?: OptionCallback<Offer>) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));
    try {
      const response = await fetchByIdAPI(id);
      dispatch(retrieveActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(retrieveActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(retrieveActions.isLoading(false));
  };
}

export const offerWaitingListActions = {
  success: createAction('OFFER/UPDATE_WAITING_LIST/SUCCESS'),
  error: createAction('OFFER/UPDATE_WAITING_LIST/ERROR'),
  isLoading: createAction('OFFER/UPDATE_WAITING_LIST/IS_LOADING'),
};

export function toggleWaitingListFreeze(
  offerId: number,
  newFreezeState: boolean,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerWaitingListActions.isLoading(true));
    dispatch(offerWaitingListActions.error(null));
    try {
      const offer = await toggleWaitingListFreezeAPI(offerId, newFreezeState);
      dispatch(offerWaitingListActions.success(offer));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(offerWaitingListActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(offerWaitingListActions.isLoading(false));
  };
}

export const offersFilterActions = {
  toogleOpen: createAction('OFFER/FILTER/TOOGLE_OPEN'),
  setOpen: createAction('OFFER/FILTER/TOOGLE_ALWAYS_OPEN'),
  setFilters: createAction('OFFER/FILTER/SET_FILTER'),
};

export function toogleFilter() {
  return async (dispatch: Dispatch) => {
    dispatch(offersFilterActions.toogleOpen());
  };
}

export function setFilters(filters: any) {
  return async (dispatch: Dispatch) => {
    dispatch(offersFilterActions.setFilters(filters));
  };
}

export const offerMarketplaceListActions = {
  isLoading: createAction('OFFER/MARKETPLACE/IS_LOADING'),
  error: createAction('OFFER/MARKETPLACE/ERROR'),
  success: createAction('OFFER/MARKETPLACE/SUCCESS'),
};

export function fetchMarketplaceOfferList(
  params: OfferListParams,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerMarketplaceListActions.error(null));
    dispatch(offerMarketplaceListActions.isLoading(true));

    try {
      const response = await fetchOffersListAPI({
        ...params,
        with_booking_window: true,
      });
      // @ts-expect-error
      dispatch(offerMarketplaceListActions.success(response.data.results));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(offerMarketplaceListActions.error(error));
      dispatch(offerMarketplaceListActions.error(null));
      if (options && options.onError) options.onError(error);
    }

    dispatch(offerMarketplaceListActions.isLoading(false));
  };
}

export const offerNextActions = {
  isLoading: createAction('OFFER/NEXT/IS_LOADING'),
  error: createAction('OFFER/NEXT/ERROR'),
  success: createAction('OFFER/NEXT/SUCCESS'),
};

export function fetchNextAvailableOffer(
  params: OfferListParams,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(offerNextActions.error(null));
      dispatch(offerNextActions.isLoading(true));
      const response = await fetchOffersListAPI({
        only_future_strict: true,
        max_date: DateTime.now().plus({ months: 4 }).toISODate(),
        ...params,
        with_tags: true,
        page_size: 1,
        page: 1,
      });

      // @ts-expect-error
      dispatch(offerNextActions.success(response.data?.results?.[0] ?? null));

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data?.results?.[0] ?? null);
      }
    } catch (error) {
      dispatch(offerNextActions.error(error));

      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(offerNextActions.isLoading(false));
  };
}

export const offerBulkActions = {
  isLoading: createAction('OFFER/BULK/IS_LOADING'),
  error: createAction('OFFER/BULK/ERROR'),
  success: createAction('OFFER/BULK/SUCCESS'),
};

/**
 * To be used only in cases where the length of the batch could be
 * critical.
 */
export function fetchOfferBulkBatched(
  ids: Array<number>,
  options?: OptionCallback<Offer[]> & { onCacheUsed?: () => void },
  useCache?: boolean,
  ignoreManagerOnly?: boolean,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    let ids_uniq = uniq((ids ?? []).filter((id) => !!id));
    if (useCache) {
      ids_uniq = ids_uniq.filter((id) => !getState().offer.byId[id]);
    }

    if (ids_uniq.length === 0) {
      if (useCache) options?.onCacheUsed?.();
      return;
    }

    const BATCH_SIZE = 100;

    const ids_batched = chunk(ids_uniq, BATCH_SIZE);
    const boundActionList = ids_batched.map(
      (batch_ids) => () =>
        dispatch(
          fetchOfferBulk(batch_ids, options, useCache, ignoreManagerOnly),
        ),
    );

    try {
      // /!\ Async reduce below to await for batch to be resolved before sending the next ones
      boundActionList.reduce(
        async (previousPromise, nextBoundedAction, index) => {
          if (index === 0) return previousPromise;
          await previousPromise;
          return nextBoundedAction();
        },
        boundActionList[0](),
      );

      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      options?.onError?.();
    }
  };
}

export function fetchOfferBulk(
  ids: Array<number>,
  options?: OptionCallback<Offer[]> & { onCacheUsed?: () => void },
  useCache?: boolean,
  ignoreManagerOnly?: boolean,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    let ids_uniq = uniq((ids ?? []).filter((id) => !!id));
    if (useCache) {
      ids_uniq = ids_uniq.filter((id) => !getState().offer.byId[id]);
    }

    if (ids_uniq.length === 0) {
      if (useCache) options?.onCacheUsed?.();
      return;
    }
    dispatch(offerBulkActions.error(null));
    dispatch(offerBulkActions.isLoading(true));

    try {
      const filterParams: {
        id__in: Array<number>;
        ignore_manager_only?: boolean;
      } = { id__in: ids_uniq };
      if (ignoreManagerOnly)
        filterParams.ignore_manager_only = !!ignoreManagerOnly;
      const response = await fetchOffersListAPI(filterParams);
      // @ts-expect-error
      dispatch(offerBulkActions.success(response.data.results));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(offerBulkActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(offerBulkActions.isLoading(false));
  };
}

export const setStoredOffersInGroupsDataActions = {
  execute: createAction<{ groupId: number; offersIds: number[] }>(
    'OFFER/SET_STORED_DATA_IN_GROUP/EXECUTE',
  ),
};

export const setStoredOffersInGroups = (
  groupId: number,
  offersIds: number[],
) => {
  return async (dispatch: Dispatch) =>
    dispatch(
      setStoredOffersInGroupsDataActions.execute({ groupId, offersIds }),
    );
};
export const offerStatusActions = {
  isLoading: createAction('OFFER/STATUS/IS_LOADING'),
  error: createAction('OFFER/STATUS/ERROR'),
  success: createAction('OFFER/STATUS/SUCCESS'),
  list: createAction('OFFER/STATUS/LIST'),
};

export function fetchOfferStatus(
  id: number,
  params: OfferStatusParams = {},
  options?: OptionCallback<OfferStatus>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerStatusActions.error(null));
    dispatch(offerStatusActions.isLoading(true));

    try {
      const response = await fetchOfferStatusAPI(id, params);
      const data = { ...response.data, id };
      dispatch(offerStatusActions.success(data));
      options && options.onSuccess && options.onSuccess(data);
    } catch (error) {
      dispatch(offerStatusActions.error(error));
      options && options.onError && options.onError(error);
    }

    dispatch(offerStatusActions.isLoading(false));
  };
}

export function fetchOfferStatusList(
  ids: Array<number>,
  params: any = {},
  options?: OptionCallback<OfferStatus[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerStatusActions.error(null));
    dispatch(offerStatusActions.isLoading(true));

    try {
      const response = await fetchOfferStatusListAPI(ids, params);

      // @ts-expect-error
      dispatch(offerStatusActions.list(response.data.results));
      // @ts-expect-error
      options && options.onSuccess && options.onSuccess(response.data.results);
    } catch (error) {
      console.error(error);
      dispatch(offerStatusActions.error(error));
      options && options.onError && options.onError(error);
    }

    dispatch(offerStatusActions.isLoading(false));
  };
}

export const retrieveByIdActions = {
  success: createAction('OFFER/RETRIEVE_BY_ID/SUCCESS'),
  error: createAction('OFFER/RETRIEVE_BY_ID/ERROR'),
  isLoading: createAction('OFFER/RETRIEVE_BY_ID/IS_LOADING'),
};

export function retrieveOffer(
  id: number,
  options?: OptionCallback<OfferREST>,
  params?: { with_booking_window?: boolean },
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveByIdActions.isLoading(true));
    dispatch(retrieveByIdActions.error(null));

    try {
      const response = await retrieveOfferAPI(id, params);
      dispatch(retrieveByIdActions.success(response.data));

      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(retrieveByIdActions.error(error));
      if (options && options.onError) options.onError(error);
    } finally {
      dispatch(retrieveByIdActions.isLoading(false));
    }
  };
}

export const massDisableActions = {
  success: createAction('OFFER/MASS_DISABLE/SUCCESS'),
  error: createAction('OFFER/MASS_DISABLE/ERROR'),
  isLoading: createAction('OFFER/MASS_DISABLE/IS_LOADING'),
};

export function disableMassOffers(
  dateInterval: {
    start: string;
    end: string;
  },
  filters: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(massDisableActions.isLoading(true));
    dispatch(massDisableActions.error(null));

    try {
      const response = await massDisableOfferAPI(dateInterval, filters);
      if (response.status === 200) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        if (options && options.onSuccess) {
          dispatch(
            monitorBackgroundTask(backgroundTaskUuid, {
              // @ts-expect-error
              onSuccess: options.onSuccess,
            }),
          );
        } else {
          dispatch(monitorBackgroundTask(backgroundTaskUuid));
        }
      }

      dispatch(massDisableActions.success(response.data));
    } catch (error) {
      dispatch(massDisableActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(massDisableActions.isLoading(false));
  };
}

export const numberOfMassDisabledOfferRetrieveActions = {
  error: createAction('NUMBER_OF_MASS_DISABLED_OFFER/FETCH/ERROR'),
  isLoading: createAction('NUMBER_OF_MASS_DISABLED_OFFER/FETCH/IS_LOADING'),
  success: createAction('NUMBER_OF_MASS_DISABLED_OFFER/FETCH/SUCCESS'),
};

export function retrieveNumberOfMassDisabledOfferAction(
  params?: { start: string; end: string; options?: { is_workshop?: boolean } },
  options?: OptionCallback<{ number_of_mass_disabled_offer: number }>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(numberOfMassDisabledOfferRetrieveActions.isLoading(true));
    dispatch(numberOfMassDisabledOfferRetrieveActions.error(null));
    try {
      const response = await fetchNumberOfMassDisabledOfferAPI({
        start: params.start,
        end: params.end,
        ...params?.options,
      });
      dispatch(numberOfMassDisabledOfferRetrieveActions.success(response.data));
      // @ts-expect-error
      options?.onSuccess && options.onSuccess(response.data);
    } catch (error) {
      dispatch(numberOfMassDisabledOfferRetrieveActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(numberOfMassDisabledOfferRetrieveActions.isLoading(false));
  };
}

export const numberOfMassDisabledOfferInGroupActions = {
  error: createAction('NUMBER_OF_MASS_DISABLED_OFFER_GROUP/FETCH/ERROR'),
  isLoading: createAction(
    'NUMBER_OF_MASS_DISABLED_OFFER_GROUP/FETCH/IS_LOADING',
  ),
  success: createAction('NUMBER_OF_MASS_DISABLED_OFFER_GROUP/FETCH/SUCCESS'),
};

export function retrieveNumberOfMassDisabledOfferInGroup(
  params?: { start: string; end: string; options?: { is_workshop?: boolean } },
  options?: OptionCallback<{ number_of_mass_disabled_offer: number }>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(numberOfMassDisabledOfferInGroupActions.isLoading(true));
    dispatch(numberOfMassDisabledOfferInGroupActions.error(null));
    try {
      const response = await fetchOffersListAPI({
        page: 1,
        page_size: null,
        min_date: params.start,
        max_date: params.end,
        with_group: true,
        available: true,
        ...params?.options,
      });
      dispatch(
        // @ts-expect-error
        numberOfMassDisabledOfferInGroupActions.success(response.data.results),
      );
      // @ts-expect-error
      options?.onSuccess && options.onSuccess(response.data.results);
    } catch (error) {
      dispatch(numberOfMassDisabledOfferInGroupActions.error(error));
      options?.onError && options.onError(error);
    }
    dispatch(numberOfMassDisabledOfferInGroupActions.isLoading(false));
  };
}
export const listRegisteredIds = {
  success: createAction('OFFER/LIST_REGISTERED/SUCCESS'),
  error: createAction('OFFER/LIST_REGISTERED/ERROR'),
  isLoading: createAction('OFFER/LIST_REGISTERED/IS_LOADING'),
};

export function fetchOfferRegisteredIds(
  options?: OptionCallback<Array<number>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listRegisteredIds.isLoading(true));
    dispatch(listRegisteredIds.error(null));

    try {
      const response = await userRegistrationAPI();
      if (response.status === 200) {
        if (options && options.onSuccess) {
          // @ts-expect-error
          options.onSuccess(response.data);
        }
        dispatch(listRegisteredIds.success(response.data));
      }
    } catch (error) {
      dispatch(listRegisteredIds.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(listRegisteredIds.isLoading(false));
  };
}

export function restoreOffer(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    try {
      await restoreOfferAPI(id);
      dispatch(snackbarSuccess('offer.restore.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('offer.restore.error'));
    }
  };
}

export const bookedGenderActions = {
  isLoading: createAction('OFFER/BOOKED_GENDER/IS_LOADING'),
  error: createAction('OFFER/BOOKED_GENDER/ERROR'),
  success: createAction('OFFER/BOOKED_GENDER/SUCCESS'),
};

export function fetchBookedGender(params: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(bookedGenderActions.error(null));
    dispatch(bookedGenderActions.isLoading(true));
    try {
      const filterData = {};
      const { filters } = params;
      if (filters) {
        if (
          filters.establishmentGroups &&
          filters.establishmentGroups.length > 0
        ) {
          // @ts-expect-error
          filterData.establishment_group__in = filters.establishmentGroups;
        }
        if (filters.establishments && filters.establishments.length > 0) {
          // @ts-expect-error
          filterData.establishment__in = filters.establishments;
        }
        if (filters.coaches && filters.coaches.length > 0) {
          // @ts-expect-error
          filterData.coach__in = filters.coaches;
        }
        if (filters.metaActivities && filters.metaActivities.length > 0) {
          // @ts-expect-error
          filterData.activity__in = filters.metaActivities;
        }
        if (filters.levels && filters.levels.length > 0) {
          // @ts-expect-error
          filterData.level__in = filters.levels;
        }
      }

      delete params.filters;
      const response = await fetchBookedGenderAPI({
        ...params,
        ...filterData,
      });
      dispatch(bookedGenderActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(bookedGenderActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(bookedGenderActions.isLoading(false));
  };
}

export function fetchBookedGenderBulk(
  ids: Array<number>,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(bookedGenderActions.isLoading(true));
    dispatch(bookedGenderActions.error(null));
    try {
      const response = await fetchBookedGenderAPI({
        id__in: ids,
      });
      dispatch(bookedGenderActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(bookedGenderActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(bookedGenderActions.isLoading(false));
  };
}

export const offerUserRegistrationAction = {
  isLoading: createAction('OFFER/USER_REGISTRATION/IS_LOADING'),
};

export function offerUserRegistration(
  data: Parameters<typeof postUserRegistrationAPI>[0],
  options?: OptionCallback,
  params?: UserRegistrationParams,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerUserRegistrationAction.isLoading(true));
    try {
      const response = await postUserRegistrationAPI(data, params);
      if (response && response.data && response.data.buyable_item_error_code) {
        const error_code = response.data.buyable_item_error_code;
        if (ALL_ERROR_CODES.includes(error_code)) {
          dispatch(
            snackbarError(
              `canNotBuyErrorCode.${response.data.buyable_item_error_code}`,
            ),
          );
        } else {
          dispatch(snackbarError(`canNotBuyErrorCode.generic`));
        }
      }
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (err) {
      if (isErrorWithCustomCode(err) && err.response.data?.error_code) {
        dispatch(
          snackbarError(`canNotBuyErrorCode.${err.response.data.error_code}`),
        );
      }
      options && options.onError && options.onError(err);
    }
    dispatch(offerUserRegistrationAction.isLoading(false));
  };
}

export const offerMarketplaceByMetaActivityListActions = {
  isLoading: createAction('OFFER/MARKETPLACE/BY_META_ACTIVITY/IS_LOADING'),
  error: createAction('OFFER/MARKETPLACE/BY_META_ACTIVITY/ERROR'),
  success: createAction('OFFER/MARKETPLACE/BY_META_ACTIVITY/SUCCESS'),
  reset: createAction('OFFER/MARKETPLACE/BY_META_ACTIVITY/RESET'),
  init: createAction('OFFER/MARKETPLACE/BY_META_ACTIVITY/INIT'),
};

export function resetMarketplaceOfferByMetaActivityList() {
  return async (dispatch: Dispatch) => {
    dispatch(offerMarketplaceByMetaActivityListActions.reset());
  };
}

export function fetchMarketplaceOfferByMetaActivityList(
  metaActivityId: number,
  params: {
    company: number;
    page_size: number;
    page: number;
    min_date: string;
    max_date: string;
    with_unique_offer_by_group: boolean;
    username?: string;
    is_workshop?: boolean;
    available?: boolean;
  },
  options?: OptionPaginatedCallback<Offer>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerMarketplaceByMetaActivityListActions.init(metaActivityId));
    dispatch(
      offerMarketplaceByMetaActivityListActions.isLoading({
        metaActivityId,
        value: true,
      }),
    );

    try {
      const response = await fetchOffersListAPI({
        ...params,
        activity__in: [metaActivityId],
        is_workshop: true,
        with_tags: true,
      });
      dispatch(
        offerMarketplaceByMetaActivityListActions.success({
          metaActivityId,
          value: response.data,
        }),
      );
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
      dispatch(
        offerMarketplaceByMetaActivityListActions.isLoading({
          metaActivityId,
          value: false,
        }),
      );

      return response.data;
    } catch (error) {
      console.error(error);
      dispatch(
        offerMarketplaceByMetaActivityListActions.error({
          metaActivityId,
          value: error,
        }),
      );

      dispatch(
        offerMarketplaceByMetaActivityListActions.isLoading({
          metaActivityId,
          value: false,
        }),
      );
      if (options && options.onError) options.onError(error);
      return null;
    }
  };
}

export const createOffersActions = {
  error: createAction('OFFER/CREATE/ERROR'),
  loading: createAction('OFFER/CREATE/IS_LOADING'),
  success: createAction('OFFER/CREATE/SUCCESS'),
};

export function createOffers(
  offer: OfferCreate,
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOffersActions.loading(true));
    try {
      const response = await createOffersAPI(offer);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      if (options && options.onSuccess) {
        options.onSuccess();
        dispatch(
          monitorBackgroundTask(backgroundTaskUuid, {
            onSuccess: options?.onBackgroundSuccess,
            onError: options?.onBackgroundError,
          }),
        );
      } else {
        dispatch(monitorBackgroundTask(backgroundTaskUuid));
      }
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `snackbar:spivi.error.${error.response.data.error_code}`,
          ),
        );
      }

      dispatch(createOffersActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(createOffersActions.loading(false));
  };
}

export const editOffersActions = {
  error: createAction('OFFER/EDIT/ERROR'),
  loading: createAction('OFFER/EDIT/IS_LOADING'),
  success: createAction('OFFER/EDIT/SUCCESS'),
};

export function editOffers(
  offerId: number,
  offer: OfferEdit,
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editOffersActions.loading(true));
    try {
      const response = await editOffersAPI({ offerId, data: offer });
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];

      options?.onSuccess?.();

      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: options?.onBackgroundError,
        }),
      );
    } catch (error) {
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `snackbar:spivi.error.${error.response.data.error_code}`,
          ),
        );
      }
      dispatch(editOffersActions.error(error));
      options?.onError?.();
    }
    dispatch(editOffersActions.loading(false));
  };
}

export const checkOfferTagEligibilityAactions = {
  success: createAction('OFFER/TAG_ELIGIBILITY/SUCCESS'),
  error: createAction('OFFER/TAG_ELIGIBILITY/ERROR'),
  isLoading: createAction('OFFER/TAG_ELIGIBILITY/IS_LOADING'),
};

export function checkOfferTagEligibility(
  offerId: number,
  data?: { member_id: number },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(checkOfferTagEligibilityAactions.isLoading(true));
    dispatch(checkOfferTagEligibilityAactions.error(null));

    try {
      const response = await checkOfferTagEligibilityAPI(offerId, data);
      if (response.status === 200) {
        if (options && options.onSuccess) {
          // @ts-expect-error
          options.onSuccess(response.data);
        }
        dispatch(checkOfferTagEligibilityAactions.success(response.data));
      }
    } catch (error) {
      dispatch(checkOfferTagEligibilityAactions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(checkOfferTagEligibilityAactions.isLoading(false));
  };
}

export const massUnTagAllOffers = {
  success: createAction('OFFER/TAG/MASS_UNTAG/SUCCESS'),
  error: createAction('OFFER/TAG/MASS_UNTAG/ERROR'),
  isLoading: createAction('OFFER/TAG/MASS_UNTAG/IS_LOADING'),
};

export function unTagAllOffers(
  params: {
    tag_id: number;
    from_whitelist: boolean;
    from_blacklist: boolean;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(massUnTagAllOffers.isLoading(true));
    dispatch(massUnTagAllOffers.error(null));

    try {
      const response = await unTagAllOffersAPI(params);
      if (response.status === 200) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        if (options && options.onSuccess) {
          dispatch(
            monitorBackgroundTask(backgroundTaskUuid, {
              // @ts-expect-error
              onSuccess: options.onSuccess,
            }),
          );
        } else {
          dispatch(monitorBackgroundTask(backgroundTaskUuid));
        }
      }

      dispatch(massUnTagAllOffers.success(response.data));
    } catch (error) {
      dispatch(massUnTagAllOffers.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(massUnTagAllOffers.isLoading(false));
  };
}

export const unTagOfferActions = {
  success: createAction('OFFER/TAG/UNTAG_OFFER/SUCCESS'),
  error: createAction('OFFER/TAG/UNTAG_OFFER/ERROR'),
  isLoading: createAction('OFFER/TAG/UNTAG_OFFER/IS_LOADING'),
};

export function unTagOffer(
  params: {
    offer_id: number;
    tag_id: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(unTagOfferActions.isLoading(true));
    dispatch(unTagOfferActions.error(null));

    try {
      const response = await unTagOfferAPI(params);
      if (response.status === 200) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        if (options && options.onSuccess) {
          dispatch(
            monitorBackgroundTask(backgroundTaskUuid, {
              // @ts-expect-error
              onSuccess: options.onSuccess,
            }),
          );
        } else {
          dispatch(monitorBackgroundTask(backgroundTaskUuid));
        }
      }

      dispatch(unTagOfferActions.success(response.data));
    } catch (error) {
      dispatch(unTagOfferActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(unTagOfferActions.isLoading(false));
  };
}

export const disableOfferActions = {
  success: createAction('OFFER/DISABLE/SUCCESS'),
  error: createAction('OFFER/DISABLE/ERROR'),
  isLoading: createAction('OFFER/DISABLE/IS_LOADING'),
};

export function disableOffer(
  data: {
    offerId: number;
    notify: boolean;
    deleteAll: boolean;
    custom_selection: boolean;
    custom_selection_ids: Array<number>;
    cancel_linked_hybrid_offer?: boolean;
  },
  options: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(disableOfferActions.isLoading(true));
    dispatch(disableOfferActions.error(null));

    try {
      const response = await disableOfferAPI(data);
      if (response.status === 200) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        if (options && options.onSuccess) {
          options.onSuccess();

          dispatch(
            monitorBackgroundTask(backgroundTaskUuid, {
              onSuccess: options?.onBackgroundSuccess,
              onError: options?.onBackgroundError,
            }),
          );
        } else {
          dispatch(monitorBackgroundTask(backgroundTaskUuid));
        }
      }

      dispatch(disableOfferActions.success(response.data));
    } catch (error) {
      dispatch(disableOfferActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(disableOfferActions.isLoading(false));
  };
}

export const hardDeleteOfferActions = {
  success: createAction('OFFER/DELETE/SUCCESS'),
  error: createAction('OFFER/DELETE/ERROR'),
  isLoading: createAction('OFFER/DELETE/IS_LOADING'),
};

export function hardDeleteOffers(
  offerId: number,
  data: DeleteOfferPayload,
  options: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(hardDeleteOfferActions.isLoading(true));
    dispatch(hardDeleteOfferActions.error(null));

    try {
      const response = await deleteOfferAPI(offerId, data);
      if (response.status === 204) {
        const backgroundTaskUuid = response.headers['x-background-task-uuid'];
        if (options && options.onSuccess) {
          options.onSuccess();

          dispatch(
            monitorBackgroundTask(backgroundTaskUuid, {
              onSuccess: options?.onBackgroundSuccess,
              onError: options?.onBackgroundError,
            }),
          );
        } else {
          dispatch(monitorBackgroundTask(backgroundTaskUuid));
        }
      }

      dispatch(hardDeleteOfferActions.success(response.data));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        dispatch(hardDeleteOfferActions.error('calendar.canDeleteWithBooking'));
      }
      dispatch(hardDeleteOfferActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(hardDeleteOfferActions.isLoading(false));
  };
}

export const fetchOffersInGroupAction = {
  success: createAction('OFFER/GROUP/SUCCESS'),
  error: createAction('OFFER/GROUP/ERROR'),
  isLoading: createAction('OFFER/GROUP/IS_LOADING'),
};

export function fetchOffersInGroup(
  groupId: number,
  options?: OptionCallback<Offer[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchOffersInGroupAction.isLoading(true));
    dispatch(fetchOffersInGroupAction.error(null));

    try {
      const response = await fetchOffersListAPI({
        page: 1,
        page_size: null,
        group_id__in: [groupId],
      });

      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data?.results ?? []);
      }
      dispatch(fetchOffersInGroupAction.isLoading(false));
      dispatch(fetchOffersInGroupAction.success(response.data));
    } catch (error) {
      dispatch(fetchOffersInGroupAction.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(fetchOffersInGroupAction.isLoading(false));
  };
}

export const bookingGuestNumberActions = {
  isLoading: createAction('OFFER/GUEST/IS_LOADING'),
  error: createAction('OFFER/GUEST/ERROR'),
  success: createAction('OFFER/GUEST/SUCCESS'),
};

export function fetchBookingGuestNumber(
  offerId: number,
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(bookingGuestNumberActions.error(null));
    dispatch(bookingGuestNumberActions.isLoading(true));

    try {
      const response = await fetchBookingGuestNumberAPI(offerId);
      const result = response.data;
      dispatch(bookingGuestNumberActions.success(result));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(bookingGuestNumberActions.error(error));
      options && options.onError && options.onError(error);
    }

    dispatch(bookingGuestNumberActions.isLoading(false));
  };
}

export const listOffersWithPendingReplacementRequestActions = {
  success: createAction('OFFER/WITH_PENDING_REPLACEMENT/LIST/SUCCESS'),
  loading: createAction('OFFER/WITH_PENDING_REPLACEMENT/LIST/LOADING'),
  error: createAction('OFFER/WITH_PENDING_REPLACEMENT/LIST/ERROR'),
};

export const listOffersWithPendingReplacementRequestIds = (
  offerIdList: number[],
  shouldCheckUpsell: boolean,
  options?: OptionCallback,
): ThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    // If action is dispatched from one of the backoffice page (shouldCheckUpsell === true)
    // then we check that subteacher upsell is active before making the api call.

    // If shouldCheckUpsell is false, then make the api call (case coach backoffice)
    if (
      shouldCheckUpsell &&
      !getState().company.feature.data.upsell.find(
        (u) => u.upsell_identifier === UPSELL_IDENTIFIER_SUBTEACHER_TOOL,
      )
    )
      return;

    dispatch(listOffersWithPendingReplacementRequestActions.error(null));
    dispatch(listOffersWithPendingReplacementRequestActions.loading(true));

    try {
      const response = await listOffersWithPendingReplacementRequestIdsAPI({
        offer_id_list: offerIdList,
      });
      dispatch(
        listOffersWithPendingReplacementRequestActions.success(response.data),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(listOffersWithPendingReplacementRequestActions.error(error));
      options && options.onError && options.onError();
    }

    dispatch(listOffersWithPendingReplacementRequestActions.loading(false));
  };
};

export const listOffersWithRefusedReplacementRequestActions = {
  success: createAction('OFFER/WITH_REFUSED_REPLACEMENT/LIST/SUCCESS'),
  loading: createAction('OFFER/WITH_REFUSED_REPLACEMENT/LIST/LOADING'),
  error: createAction('OFFER/WITH_REFUSED_REPLACEMENT/LIST/ERROR'),
};

export const listOffersWithRefusedReplacementRequestIds = (
  offerIdList: number[],
  options?: OptionCallback,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(listOffersWithRefusedReplacementRequestActions.error(null));
    dispatch(listOffersWithRefusedReplacementRequestActions.loading(true));

    try {
      const response = await listOffersWithRefusedReplacementRequestIdsAPI({
        offer_id_list: offerIdList,
      });
      dispatch(
        listOffersWithRefusedReplacementRequestActions.success(response.data),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(listOffersWithRefusedReplacementRequestActions.error(error));
      options && options.onError && options.onError();
    }

    dispatch(listOffersWithRefusedReplacementRequestActions.loading(false));
  };
};

export const postRollCallActions = {
  error: createAction('OFFER/ROLLCALL/OFFER/ERROR'),
  isLoading: createAction('OFFER/ROLLCALL/OFFER/IS_LOADING'),
};

export function postRollCall(offerId: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(postRollCallActions.error(null));
    dispatch(postRollCallActions.isLoading(true));

    try {
      await postRollCallOfferAPI(offerId);
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(postRollCallActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(postRollCallActions.isLoading(false));
  };
}

export const postRollCallBulkActions = {
  error: createAction('OFFER/ROLLCALL/BULK/ERROR'),
  isLoading: createAction('OFFER/ROLLCALL/BULK/IS_LOADING'),
};

export function postRollCallBulk(
  data: { offer_id_list: Array<number> },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(postRollCallBulkActions.error(null));
    dispatch(postRollCallBulkActions.isLoading(true));

    try {
      await postRollCallBulkAPI(data);
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(postRollCallBulkActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(postRollCallBulkActions.isLoading(false));
  };
}

export const offerStatusWaitingListPositionActions = {
  isLoading: createAction<boolean>('OFFER/WAITING_LIST_POSITION/IS_LOADING'),
  error: createAction<Error | null>('OFFER/WAITING_LIST_POSITION/ERROR'),
  success: createAction<OfferStatusWaitingListPosition>(
    'OFFER/WAITING_LIST_POSITION/SUCCESS',
  ),
  list: createAction<OfferStatusWaitingListPosition[]>(
    'OFFER/WAITING_LIST_POSITION/LIST',
  ),
};

export function fetchOfferWaitingListPosition(
  id: number,
  params: { [key: string]: number | string | boolean } = {},
  options?: OptionCallback<OfferStatus>,
) {
  return async (dispatch: Dispatch) => {
    if (!id) return;
    dispatch(offerStatusWaitingListPositionActions.error(null));
    dispatch(offerStatusWaitingListPositionActions.isLoading(true));

    try {
      const response = await fetchOfferWaitingListPositionAPI(id, params);
      const data = { ...response.data, id };
      dispatch(offerStatusWaitingListPositionActions.success(data));
      // @ts-expect-error
      options?.onSuccess?.(data);
    } catch (error) {
      dispatch(offerStatusWaitingListPositionActions.error(error));
      options?.onError?.(error);
    }
    dispatch(offerStatusWaitingListPositionActions.isLoading(false));
  };
}

export function fetchOfferWaitingListPositionList(
  ids: number[],
  params: { [key: string]: number | string | boolean } = {},
  options?: OptionCallback<OfferStatus[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerStatusWaitingListPositionActions.error(null));
    dispatch(offerStatusWaitingListPositionActions.isLoading(true));
    const uniq_ids = uniq((ids ?? []).filter((id) => !!id));
    if (uniq_ids.length === 0) {
      return;
    }
    try {
      const response = await fetchOfferWaitingListPositionListAPI(
        uniq_ids,
        params,
      );

      dispatch(
        offerStatusWaitingListPositionActions.list(response.data.results),
      );
      // @ts-expect-error
      options && options.onSuccess && options.onSuccess(response.data.results);
    } catch (error) {
      console.error(error);
      dispatch(offerStatusWaitingListPositionActions.error(error));
      options && options.onError && options.onError(error);
    }

    dispatch(offerStatusWaitingListPositionActions.isLoading(false));
  };
}

export const updateInternalNoteActions = {
  loading: createAction<boolean>('OFFER/UPDATE_INTERNAL_NOTE/LOADING'),
  error: createAction<Error | null>('OFFER/UPDATE_INTERNAL_NOTE/ERROR'),
};
export function updateInternalNote(
  offerId: number,
  data: { internal_note: string },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateInternalNoteActions.loading(true));
    try {
      const response = await updateInternalNoteAPI(offerId, data);
      // @ts-expect-error
      options?.onSuccess(response.data);
      dispatch(retrieveActions.success(response.data));
      dispatch(snackbarSuccess('dashboard.save.success'));
    } catch (error) {
      dispatch(updateInternalNoteActions.error(error));
      dispatch(snackbarError('dashboard.save.error'));
    }
    dispatch(updateInternalNoteActions.loading(false));
  };
}
