import { createAction } from 'redux-actions';
import {
  SPIVI_EVENT_DURATION_EXCEPTION,
  SPIVI_UPSELL_NOT_ACTIVATED_EXCEPTION,
  NO_SPIVI_BOX_ID_FOR_ROOM_PLAN_EXCEPTION,
  NO_ROOM_PLAN_SELECTED_EXCEPTION,
} from '@bsport/common/lib/master-data/error-codes/spivi.js';
import { Offer, OfferStatus } from '#src/libs/offer/types';
import { monitorBackgroundTask } from '#src/libs/background-task/actions';
import type {
  Dispatch,
  OptionCallback,
  OptionPaginatedCallback,
  OptionBackgroundCallback,
} from '../../state/types';
import { snackbarError } from '../../actions/snackbar.actions';

import {
  fetchGroupsOfferList as fetchGroupsOfferListAPI,
  fetchGroupOffer as fetchGroupOfferAPI,
  createGroupOffers as createGroupOffersAPI,
  generateGroupOffersPreview as generateGroupOffersPreviewAPI,
  editGroupOffer as editGroupOfferAPI,
  fetchSimilarGroupOffers as fetchSimilarGroupOffersAPI,
  deleteGroupOffer as deleteGroupOfferAPI,
  getGroupOfferFirstOfferIdToBeBooked as getGroupOfferFirstOfferIdToBeBookedAPI,
  listGroupOfferOffersIdsToBeBooked as listGroupOfferOffersIdsToBeBookedAPI,
  getGroupOfferBookableStatus as getGroupOfferBookableStatusAPI,
} from './api';
import { OffersGroupFilter, GroupPreviewData, OffersGroup } from './types';

export const fetchGroupsOfferListActions = {
  error: createAction('META_ACTIVITIES/GROUP/LIST/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/LIST/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/LIST/SUCCESS'),
};

export function fetchGroupsOfferList(
  filter: OffersGroupFilter & {
    page: number;
    page_size: number;
    id__in?: number[];
  },
  options?: OptionPaginatedCallback<OffersGroup>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchGroupsOfferListActions.loading(true));
    dispatch(fetchGroupsOfferListActions.error(null));
    try {
      const response = await fetchGroupsOfferListAPI(filter);

      dispatch(fetchGroupsOfferListActions.loading(false));
      dispatch(fetchGroupsOfferListActions.error(null));

      dispatch(fetchGroupsOfferListActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(fetchGroupsOfferListActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchGroupsOfferListActions.loading(false));
  };
}

export const fetchGroupOfferActions = {
  error: createAction('META_ACTIVITIES/GROUP/DETAIL/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/DETAIL/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/DETAIL/SUCCESS'),
  reset: createAction('META_ACTIVITIES/GROUP/DETAIL/RESET'),
};

export function resetGroupOffer() {
  return async (dispatch: Dispatch) => {
    dispatch(fetchGroupOfferActions.reset());
  };
}

export function fetchGroupOffer(
  id: number,
  options?: OptionCallback<OffersGroup>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchGroupOfferActions.loading(true));
    dispatch(fetchGroupOfferActions.error(null));
    try {
      const response = await fetchGroupOfferAPI(id);
      dispatch(fetchGroupOfferActions.success(response.data));

      dispatch(fetchGroupOfferActions.loading(false));
      dispatch(fetchGroupOfferActions.error(null));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(fetchGroupOfferActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchGroupOfferActions.loading(false));
  };
}

export const fetchExistingGroupOfferActions = {
  error: createAction('META_ACTIVITIES/GROUP/EXIST/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/EXIST/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/EXIST/SUCCESS'),
};

export function fetchExistingGroupOffer(options?: OptionCallback<number>) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchExistingGroupOfferActions.loading(true));
    dispatch(fetchExistingGroupOfferActions.error(null));
    try {
      const response = await fetchGroupsOfferListAPI({
        page: 1,
        page_size: 1,
      });
      dispatch(fetchExistingGroupOfferActions.success(response.data.count));

      dispatch(fetchExistingGroupOfferActions.loading(false));
      dispatch(fetchExistingGroupOfferActions.error(null));
      if (options && options.onSuccess) options.onSuccess(response.data.count);
    } catch (error) {
      dispatch(fetchExistingGroupOfferActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchExistingGroupOfferActions.loading(false));
  };
}

export const createGroupOffersActions = {
  error: createAction('META_ACTIVITIES/GROUP/CREATE/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/CREATE/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/CREATE/SUCCESS'),
};

export function createGroupOffers(
  data: {
    group_data_with_offers: Record<
      number,
      {
        offers_data: Offer[];
        group: OffersGroup<Offer>;
      }
    >;
  },
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createGroupOffersActions.loading(true));
    dispatch(createGroupOffersActions.error(null));
    try {
      const response = await createGroupOffersAPI(data);
      dispatch(createGroupOffersActions.success(response.data));

      dispatch(createGroupOffersActions.loading(false));
      dispatch(createGroupOffersActions.error(null));

      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      options?.onSuccess?.();

      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: options?.onBackgroundError,
        }),
      );

      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(createGroupOffersActions.error(error));
      const error_code = error.response?.data?.error_code;
      if (
        error_code === SPIVI_EVENT_DURATION_EXCEPTION ||
        error_code === SPIVI_UPSELL_NOT_ACTIVATED_EXCEPTION ||
        error_code === NO_SPIVI_BOX_ID_FOR_ROOM_PLAN_EXCEPTION ||
        error_code === NO_ROOM_PLAN_SELECTED_EXCEPTION
      ) {
        dispatch(
          snackbarError(
            `snackbar:spivi.error.${error.response?.data?.error_code}`,
          ),
        );
      }
      if (options && options.onError) options.onError();
    }
    dispatch(createGroupOffersActions.loading(false));
  };
}

export const generateGroupOffersPreviewActions = {
  error: createAction('META_ACTIVITIES/GROUP/PREVIEW/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/PREVIEW/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/PREVIEW/SUCCESS'),
  reset: createAction('META_ACTIVITIES/GROUP/PREVIEW/RESET'),
};
export function resetGeneratePreview() {
  return async (dispatch: Dispatch) => {
    dispatch(generateGroupOffersPreviewActions.reset());
  };
}

export function generateGroupOffersPreview(
  data: GroupPreviewData,
  options?: OptionCallback<
    Record<number, { group: OffersGroup<number>; offers_data: Offer[] }>
  >,
) {
  return async (dispatch: Dispatch) => {
    dispatch(generateGroupOffersPreviewActions.loading(true));
    dispatch(generateGroupOffersPreviewActions.error(null));
    try {
      const response = await generateGroupOffersPreviewAPI(data);
      dispatch(generateGroupOffersPreviewActions.success(response.data));
      dispatch(generateGroupOffersPreviewActions.loading(false));
      dispatch(generateGroupOffersPreviewActions.error(null));

      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(generateGroupOffersPreviewActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(generateGroupOffersPreviewActions.loading(false));
  };
}

export const groupOfferseditGroupOfferActions = {
  error: createAction('META_ACTIVITIES/GROUP/EDIT/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/EDIT/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/EDIT/SUCCESS'),
};

export function editGroupOffer(
  id: number,
  data: {
    level: number;
    name: string;
    allow_booking_after_start: boolean;
    full_booking_only: boolean;
    manager_only: boolean;
  },
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(groupOfferseditGroupOfferActions.loading(true));
    dispatch(groupOfferseditGroupOfferActions.error(null));
    try {
      const response = await editGroupOfferAPI(id, data);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      options?.onSuccess?.();

      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: options?.onBackgroundError,
        }),
      );
      dispatch(groupOfferseditGroupOfferActions.loading(false));
      dispatch(groupOfferseditGroupOfferActions.error(null));

      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(groupOfferseditGroupOfferActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(groupOfferseditGroupOfferActions.loading(false));
  };
}

export const fetchSimilarGroupOffersActions = {
  error: createAction('META_ACTIVITIES/GROUP/SIMILAR/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/SIMILAR/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/SIMILAR/SUCCESS'),
};

export function fetchSimilarGroupOffers(
  id: number,
  options?: OptionCallback<OffersGroup[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSimilarGroupOffersActions.loading(true));
    dispatch(fetchSimilarGroupOffersActions.error(null));
    try {
      const response = await fetchSimilarGroupOffersAPI(id);
      dispatch(fetchSimilarGroupOffersActions.success(response.data));

      dispatch(fetchSimilarGroupOffersActions.loading(false));
      dispatch(fetchSimilarGroupOffersActions.error(null));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(fetchSimilarGroupOffersActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchSimilarGroupOffersActions.loading(false));
  };
}

export const deleteGroupOfferActions = {
  error: createAction('META_ACTIVITIES/GROUP/DELETE/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/DELETE/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/DELETE/SUCCESS'),
};

export function deleteGroupOffer(
  id: number,
  params: {
    notify_if_cancelled: boolean;
    similar_group_ids: number[];
  },
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteGroupOfferActions.loading(true));
    dispatch(deleteGroupOfferActions.error(null));
    try {
      const response = await deleteGroupOfferAPI(id, params);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      options?.onSuccess?.();

      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: options?.onBackgroundError,
        }),
      );
      dispatch(deleteGroupOfferActions.loading(false));
      dispatch(deleteGroupOfferActions.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(deleteGroupOfferActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteGroupOfferActions.loading(false));
  };
}

export const fetchGroupsOfferBulkActions = {
  error: createAction('META_ACTIVITIES/GROUP/BULK/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/BULK/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/BULK/SUCCESS'),
};

export function fetchGroupsOfferBulk(
  id__in?: number[],
  options?: OptionCallback<OffersGroup[]>,
) {
  return async (dispatch: Dispatch) => {
    const id_in_cleaned = id__in?.filter((i) => !!i);
    if (!id_in_cleaned || id_in_cleaned.length === 0) {
      return;
    }
    dispatch(fetchGroupsOfferBulkActions.loading(true));
    dispatch(fetchGroupsOfferBulkActions.error(null));

    try {
      const response = await fetchGroupsOfferListAPI({
        page: 1,
        page_size: null,
        id__in: id_in_cleaned,
      });

      dispatch(fetchGroupsOfferBulkActions.loading(false));
      dispatch(fetchGroupsOfferBulkActions.error(null));

      dispatch(fetchGroupsOfferBulkActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(fetchGroupsOfferBulkActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchGroupsOfferBulkActions.loading(false));
  };
}

export const getGroupOfferFirstOfferIdToBeBookedActions = {
  error: createAction<Error | null>(
    'GROUP_OFFER/FIRST_OFFER_TO_BE_BOOKED/ERROR',
  ),
  loading: createAction<boolean>(
    'GROUP_OFFER/FIRST_OFFER_TO_BE_BOOKED/IS_LOADING',
  ),
  success: createAction<number | null>(
    'GROUP_OFFER/FIRST_OFFER_TO_BE_BOOKED/SUCCESS',
  ),
};

export function getGroupOfferFirstOfferIdToBeBooked(
  id: number,
  options?: OptionCallback<number | null>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getGroupOfferFirstOfferIdToBeBookedActions.loading(true));
    dispatch(getGroupOfferFirstOfferIdToBeBookedActions.error(null));

    try {
      const response = await getGroupOfferFirstOfferIdToBeBookedAPI(id);

      dispatch(getGroupOfferFirstOfferIdToBeBookedActions.loading(false));
      dispatch(getGroupOfferFirstOfferIdToBeBookedActions.error(null));

      dispatch(
        getGroupOfferFirstOfferIdToBeBookedActions.success(response.data),
      );
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(getGroupOfferFirstOfferIdToBeBookedActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(getGroupOfferFirstOfferIdToBeBookedActions.loading(false));
  };
}

export const listGroupOfferOffersIdsToBeBookedActions = {
  error: createAction<Error | null>(
    'GROUP_OFFER/LIST_OFFER_TO_BE_BOOKED/ERROR',
  ),
  loading: createAction<boolean>(
    'GROUP_OFFER/LIST_OFFER_TO_BE_BOOKED/IS_LOADING',
  ),
  success: createAction<{ groupId: number; offersIds: number[] }>(
    'GROUP_OFFER/LIST_OFFER_TO_BE_BOOKED/SUCCESS',
  ),
  reset: createAction('GROUP_OFFER/LIST_OFFER_TO_BE_BOOKED/RESET'),
};
export function resetOffersToBeBookedByGroup(callback?: () => void) {
  return async (dispatch: Dispatch) => {
    await dispatch(listGroupOfferOffersIdsToBeBookedActions.reset());
    callback && callback();
  };
}
export function listGroupOfferOffersIdsToBeBooked(
  id: number,
  options?: OptionCallback<number[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listGroupOfferOffersIdsToBeBookedActions.loading(true));
    dispatch(listGroupOfferOffersIdsToBeBookedActions.error(null));

    try {
      const response = await listGroupOfferOffersIdsToBeBookedAPI(id);

      dispatch(
        listGroupOfferOffersIdsToBeBookedActions.success({
          groupId: id,
          offersIds: response.data,
        }),
      );
      dispatch(listGroupOfferOffersIdsToBeBookedActions.error(null));
      dispatch(listGroupOfferOffersIdsToBeBookedActions.loading(false));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(listGroupOfferOffersIdsToBeBookedActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(listGroupOfferOffersIdsToBeBookedActions.loading(false));
  };
}

export const getGroupOfferBookableStatusActions = {
  error: createAction<Error | null>('GROUP_OFFER/BOOKABLE_STATUS/ERROR'),
  loading: createAction<boolean>('GROUP_OFFER/BOOKABLE_STATUS/IS_LOADING'),
  success: createAction<{ id: number; data: OfferStatus[] }>(
    'GROUP_OFFER/BOOKABLE_STATUS/SUCCESS',
  ),
};

export function getGroupOfferBookableStatus(
  id: number,
  options?: OptionCallback<OfferStatus[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getGroupOfferBookableStatusActions.loading(true));
    dispatch(getGroupOfferBookableStatusActions.error(null));

    try {
      const response = await getGroupOfferBookableStatusAPI(id);

      dispatch(getGroupOfferBookableStatusActions.loading(false));
      dispatch(getGroupOfferBookableStatusActions.error(null));

      dispatch(
        getGroupOfferBookableStatusActions.success({ id, data: response.data }),
      );
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(getGroupOfferBookableStatusActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(getGroupOfferBookableStatusActions.loading(false));
  };
}
