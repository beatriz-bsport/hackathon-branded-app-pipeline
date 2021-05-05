import { createAction } from 'redux-actions';
import {
  retrieveOffer as retrieveOfferAPI,
  fetchSimilarOffers as fetchSimilarOffersAPI,
  fetchAllEvents as fetchAllEventsAPI,
  fetchCompatiblePacks as fetchCompatiblePacksAPI,
  fetchOffersByDay as fetchOffersByDayAPI,
  fetchById as fetchByIdAPI,
  toogleWaitingListFreeze as toogleWaitingListFreezeAPI,
  fetchOffersList as fetchOffersListAPI,
  massDisableOffer as massDisableOfferAPI,
  restoreOffer as restoreOfferAPI,
  fetchBookedGender as fetchBookedGenderAPI,
  fetchOfferStatus as fetchOfferStatusAPI,
  fetchOfferStatusList as fetchOfferStatusListAPI,
  postUserRegistration as postUserRegistrationAPI,
} from './api';
import { monitorBackgroundTask } from '../background-task/actions';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import type { Dispatch, OptionCallback } from '../../state/types';
import type { Offer } from '../../api/types';
import { OfferFilter, OfferFilterData, OfferStatus } from './types';

export const similarOffers = {
  isLoading: createAction('OFFERS/SIMILAR/IS_LOADING'),
  error: createAction('OFFERS/SIMILAR/ERROR'),
  success: createAction('OFFERS/SIMILAR/SUCCESS'),
  successPaginated: createAction('OFFERS/SIMILAR/SUCCESS_PAGINATED'),
  reset: createAction('OFFERS/SIMILAR/RESET'),
};

export const resetSimilarOffers = similarOffers.reset;

export function fetchSimilarOffers(
  offerId: number,
  params: any = {},
  options: OptionCallback<Offer[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(similarOffers.isLoading(true));
    dispatch(similarOffers.error(null));
    try {
      const response = await fetchSimilarOffersAPI(offerId, params);
      if (!response.data.results && !params.page) {
        dispatch(similarOffers.success([]));
        dispatch(similarOffers.success(response.data));
        if (options && options.onSuccess) {
          options.onSuccess(response.data);
        }
      } else {
        dispatch(similarOffers.successPaginated(response.data));
        if (options && options.onSuccess) {
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

export function fetchAllOffers(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(offers.isLoading(true));
    dispatch(offers.error(null));

    try {
      const response = await fetchAllEventsAPI(params);
      dispatch(offers.success(response.data));
      if (options && options.onSuccess) {
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
      if (response.data.length === 1) {
        dispatch(offerByDay.bulk(response.data[0]));
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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerByDay.isLoading(true));
    dispatch(refreshOffersByDay(day, options));
  };
}

export const retrieveActions = {
  success: createAction('OFFER/RETRIEVE/SUCCESS'),
  error: createAction('OFFER/RETRIEVE/ERROR'),
  isLoading: createAction('OFFER/RETRIEVE/IS_LOADING'),
};

export function fetchOfferById(id: number, options: OptionCallback<Offer>) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveActions.isLoading(true));
    dispatch(retrieveActions.error(null));
    try {
      const response = await fetchByIdAPI(id);
      dispatch(retrieveActions.success(response.data));
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

export function toogleWaitingListFreeze(
  offerId: number,
  newFreezeState: boolean,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerWaitingListActions.isLoading(true));
    dispatch(offerWaitingListActions.error(null));
    try {
      const offer = await toogleWaitingListFreezeAPI(offerId, newFreezeState);
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
  params: {
    company: number;
    min_date: string;
    max_date: string;
    filters: OfferFilterData | OfferFilter;
    is_workshop?: boolean;
    available?: boolean;
  },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerMarketplaceListActions.error(null));
    dispatch(offerMarketplaceListActions.isLoading(true));

    try {
      const filterData: OfferFilterData = {};
      const { filters } = params;
      // do not delete this, migration
      if (filters) {
        if (filters.establishments && filters.establishments.length > 0) {
          filterData.establishment__in = filters.establishments;
        }
        if (filters.coaches && filters.coaches.length > 0) {
          filterData.coach__in = filters.coaches;
        }
        if (filters.metaActivities && filters.metaActivities.length > 0) {
          filterData.activity__in = filters.metaActivities;
        }
        if (filters.levels && filters.levels.length > 0) {
          filterData.level__in = filters.levels;
        }
      }
      // eslint-disable-next-line
      delete params.filters;
      const response = await fetchOffersListAPI({
        ...params,
        ...filterData,
      });
      dispatch(offerMarketplaceListActions.success(response.data.results));
      if (options && options.onSuccess) {
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

export const offerBulkActions = {
  isLoading: createAction('OFFER/BULK/IS_LOADING'),
  error: createAction('OFFER/BULK/ERROR'),
  success: createAction('OFFER/BULK/SUCCESS'),
};

export function fetchOfferBulk(ids: Array<number>, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    if (!ids || !ids.length) return;
    dispatch(offerBulkActions.error(null));
    dispatch(offerBulkActions.isLoading(true));

    try {
      const response = await fetchOffersListAPI({
        id__in: ids,
      });
      dispatch(offerBulkActions.success(response.data.results));
      if (options && options.onSuccess) {
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

export const offerStatusActions = {
  isLoading: createAction('OFFER/STATUS/IS_LOADING'),
  error: createAction('OFFER/STATUS/ERROR'),
  success: createAction('OFFER/STATUS/SUCCESS'),
  list: createAction('OFFER/STATUS/LIST'),
};

export function fetchOfferStatus(
  id: number,
  options?: OptionCallback<OfferStatus>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerStatusActions.error(null));
    dispatch(offerStatusActions.isLoading(true));

    try {
      const response = await fetchOfferStatusAPI(id);
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
  options?: OptionCallback<OfferStatus>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerStatusActions.error(null));
    dispatch(offerStatusActions.isLoading(true));

    try {
      const response = await fetchOfferStatusListAPI(ids, params);
      dispatch(offerStatusActions.list(response.data.results));
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

export function retrieveOffer(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveByIdActions.isLoading(true));
    dispatch(retrieveByIdActions.error(null));

    try {
      const response = await retrieveOfferAPI(id);
      dispatch(retrieveByIdActions.success(response.data));

      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(retrieveByIdActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(retrieveByIdActions.isLoading(false));
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

export function fetchBookedGender(params: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(bookedGenderActions.error(null));
    dispatch(bookedGenderActions.isLoading(true));
    try {
      const filterData = {};
      const { filters } = params;
      if (filters) {
        if (filters.establishments && filters.establishments.length > 0) {
          filterData.establishment__in = filters.establishments;
        }
        if (filters.coaches && filters.coaches.length > 0) {
          filterData.coach__in = filters.coaches;
        }
        if (filters.metaActivities && filters.metaActivities.length > 0) {
          filterData.activity__in = filters.metaActivities;
        }
        if (filters.levels && filters.levels.length > 0) {
          filterData.level__in = filters.levels;
        }
      }
      // eslint-disable-next-line no-param-reassign
      delete params.filters;
      const response = await fetchBookedGenderAPI({
        ...params,
        ...filterData,
      });
      dispatch(bookedGenderActions.success(response.data));
      if (options && options.onSuccess) {
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
  options: OptionCallback,
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
) {
  return async (dispatch: Dispatch) => {
    dispatch(offerUserRegistrationAction.isLoading(true));
    try {
      const response = await postUserRegistrationAPI(data);
      options && options.onSuccess(response.data);
    } catch (e) {
      options && options.onError && options.onError(e);
    }
    dispatch(offerUserRegistrationAction.isLoading(false));
  };
}
