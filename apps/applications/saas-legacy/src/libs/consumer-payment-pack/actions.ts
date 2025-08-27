import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';
import chunk from 'lodash/chunk';
import type {
  Dispatch,
  OptionCallback,
  PaginatedResponse,
} from '../../state/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import {
  fetchByOfferByMember as fetchByOfferByMemberAPI,
  fetchNonCompatibleByOfferByMember as fetchNonCompatibleByOfferByMemberAPI,
  fetchIncompatibilitiesReasonsByOfferByConsumerPack as fetchIncompatibilitiesReasonsByOfferByConsumerPackAPI,
  fetchConsumerPackList as fetchConsumerPaymentPackListAPI,
  fetchConsumerPaymentPackExtensionList as fetchConsumerPaymentPackExtensionListAPI,
  createConsumerPaymentPackExtension as createConsumerPaymentPackExtensionAPI,
  deleteConsumerPaymentPackExtension as deleteConsumerPaymentPackExtensionAPI,
  refundConsumerPaymentPack as refundConsumerPaymentPackAPI,
  fetchConsumerPaymentPackCreditRefundList as fetchConsumerPaymentPackCreditRefundListAPI,
  addCreditToConsumerPack as addCreditAPI,
  subCreditToConsumerPack as subCreditAPI,
  fetchConsumerPaymentPackCompatibleList as fetchConsumerPaymentPackCompatibleListAPI,
  fetchConsumerPaymentPackPenalty as fetchConsumerPaymentPackPenaltyAPI,
  unblock as unblockAPI,
  activateManually as activateManuallyAPI,
  fetchConsumerPaymentPackMaxoutBooking as fetchConsumerPaymentPackMaxoutBookingAPI,
  fetchByOfferByMemberV2 as fetchByOfferByMemberV2API,
  fetchConsumerPack as fetchConsumerPackAPI,
} from './api';

import type {
  ConsumerPaymentPack,
  ConsumerPaymentPackExtension,
  ConsumerPaymentPackExtensionCreate,
  ConsumerPaymentPackExtensionParams,
  ConsumerPaymentPackREST,
} from './types';
import type { RootState } from '../../reducers';

import { CONSUMER_PAYMENT_PACK_EXTENSION_PAGE_SIZE } from './constants';
import { isErrorWithCustomCode } from '#src/libs/utils';
import { DateTime } from 'luxon';

export const byOfferByMember = {
  isLoading: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/ERROR'),
  success: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/SUCCESS'),
};

export function fetchByOfferByMember(
  offer: number,
  member: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferByMember.isLoading(true));
    dispatch(byOfferByMember.error(null));
    dispatch(byOfferByMember.success([]));
    try {
      const response = await fetchByOfferByMemberV2API(offer, { member });
      dispatch(byOfferByMember.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(byOfferByMember.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(byOfferByMember.isLoading(false));
  };
}

export const nonCompatibleByOfferByMember = {
  isLoading: createAction(
    'CONSUMER_PACK/NON_COMPATIBLE_BY_OFFER_BY_MEMBER/IS_LOADING',
  ),
  error: createAction('CONSUMER_PACK/NON_COMPATIBLE_BY_OFFER_BY_MEMBER/ERROR'),
  success: createAction(
    'CONSUMER_PACK/NON_COMPATIBLE_BY_OFFER_BY_MEMBER/SUCCESS',
  ),
};

export const incompatibilitiesReasonsByOfferByConsumerPack = {
  isLoading: createAction(
    'CONSUMER_PACK/INCOMPATIBILITIES_BY_OFFER_BY_CONSUMER_PACK/IS_LOADING',
  ),
  error: createAction(
    'CONSUMER_PACK/INCOMPATIBILITIES_BY_OFFER_BY_CONSUMER_PACK/ERROR',
  ),
  success: createAction(
    'CONSUMER_PACK/INCOMPATIBILITIES_BY_OFFER_BY_CONSUMER_PACK/SUCCESS',
  ),
  reset: createAction(
    'CONSUMER_PACK/INCOMPATIBILITIES_BY_OFFER_BY_CONSUMER_PACK/RESET',
  ),
};

export function fetchNonCompatibleByOfferByMember(
  offer: number,
  member: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(nonCompatibleByOfferByMember.success([]));
    dispatch(nonCompatibleByOfferByMember.isLoading(true));
    try {
      const response = await fetchNonCompatibleByOfferByMemberAPI(offer, {
        member,
      });
      dispatch(nonCompatibleByOfferByMember.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(nonCompatibleByOfferByMember.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(nonCompatibleByOfferByMember.isLoading(false));
  };
}

export function fetchIncompatibilitiesReasonsByOfferByConsumerPack(
  cpp: number,
  offer: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(incompatibilitiesReasonsByOfferByConsumerPack.isLoading(true));
    try {
      const response =
        await fetchIncompatibilitiesReasonsByOfferByConsumerPackAPI(cpp, offer);
      dispatch(
        incompatibilitiesReasonsByOfferByConsumerPack.success(
          // @ts-expect-error
          response.data.incompatibilities_to_offer,
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error(error);
      dispatch(incompatibilitiesReasonsByOfferByConsumerPack.error(error));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(incompatibilitiesReasonsByOfferByConsumerPack.isLoading(false));
  };
}

export function resetIncompatibilitiesReasonsByOfferByConsumerPack() {
  return async (dispatch: Dispatch) => {
    dispatch(incompatibilitiesReasonsByOfferByConsumerPack.reset());
  };
}

export const byPaymentPack = {
  isLoading: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/ERROR'),
  success: createAction('CONSUMER_PACK/BY_PAYMENT_PACK/SUCCESS'),
};

export function resetByPaymentPack() {
  return async (dispatch: Dispatch) => {
    dispatch(byPaymentPack.success({ results: [], count: 0, page: 1 }));
    dispatch(byPaymentPack.isLoading(false));
  };
}

export function fetchByPaymentPack(
  paymentPackId: number,
  page?: number,
  page_size?: number,
  options?: OptionCallback<ConsumerPaymentPackREST | ConsumerPaymentPackREST[]>,
  params: any = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(byPaymentPack.isLoading(true));
    dispatch(byPaymentPack.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        payment_pack: paymentPackId,
        page,
        page_size,
        ...(params || {}),
      });
      dispatch(byPaymentPack.success({ ...response.data, page: page || 1 }));
      if (options && options.onSuccess) {
        if (response.data.results) {
          options.onSuccess(response.data.results);
        } else {
          // @ts-expect-error
          options.onSuccess(response.data);
        }
      }
    } catch (error) {
      dispatch(byPaymentPack.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(byPaymentPack.isLoading(false));
  };
}

export const updateConsumerPack = {
  isLoading: createAction('CONSUMER_PACK/UPDATE/IS_LOADING'),
  error: createAction('CONSUMER_PACK/UPDATE/ERROR'),
  success: createAction('CONSUMER_PACK/UPDATE/SUCCESS'),
};

export function updateCredit(consumerPackId: number, nbCredit: number) {
  return async (dispatch: Dispatch) => {
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: true }),
    );
    try {
      const apiCall = nbCredit >= 0 ? addCreditAPI : subCreditAPI;
      const response = await apiCall(
        consumerPackId,
        nbCredit >= 0 ? nbCredit : -nbCredit,
      );
      if (response.status === 200) {
        dispatch(updateConsumerPack.success(response.data));
        dispatch(snackbarSuccess('paymentPack.credit.updated'));
      }
    } catch (err) {
      dispatch(updateConsumerPack.error(err));
      dispatch(snackbarError('paymentPack.credit.error'));
    }
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: false }),
    );
  };
}

export function unblock(consumerPackId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: true }),
    );
    try {
      const response = await unblockAPI(consumerPackId);
      dispatch(updateConsumerPack.success(response.data));
      dispatch(snackbarSuccess('paymentPack.credit.updated'));
    } catch (err) {
      console.error(err);
      dispatch(updateConsumerPack.error(err));
      dispatch(snackbarError('paymentPack.credit.error'));
    }
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: false }),
    );
  };
}

export function activateManually(consumerPackId: number) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: true }),
    );
    try {
      const tz = getState()?.theme?.theme?.timezone_name;
      const startDate = tz
        ? DateTime.now().setZone(tz).toISODate()
        : DateTime.now().toISODate();

      const response = await activateManuallyAPI(
        consumerPackId,
        startDate || DateTime.now().toISODate(),
      ).then((_) => fetchConsumerPackAPI(consumerPackId));
      dispatch(updateConsumerPack.success(response.data));
      dispatch(snackbarSuccess('paymentPack.manualActivation.updated'));
    } catch (err) {
      console.error(err);
      dispatch(updateConsumerPack.error(err));
      dispatch(snackbarError('paymentPack.manualActivation.error'));
    }
    dispatch(
      updateConsumerPack.isLoading({ id: consumerPackId, loading: false }),
    );
  };
}

export const partialRefundActions = {
  isLoading: createAction('CONSUMER_PACK/PARTIAL_REFUND/IS_LOADING'),
  error: createAction('CONSUMER_PACK/PARTIAL_REFUND/ERROR'),
  success: createAction('CONSUMER_PACK/PARTIAL_REFUND/SUCCESS'),
  list: createAction('CONSUMER_PACK/PARTIAL_REFUND/LIST'),
  listReset: createAction('CONSUMER_PACK/PARTIAL_REFUND/LIST_RESET'),
};

export function fetchConsumerPaymentPackCreditRefundList(
  consumer_payment_pack: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(partialRefundActions.isLoading(true));
    dispatch(partialRefundActions.listReset());
    dispatch(partialRefundActions.error(null));
    try {
      const response = await fetchConsumerPaymentPackCreditRefundListAPI({
        consumer_payment_pack,
        page_size: 10,
      });
      // @ts-expect-error
      dispatch(partialRefundActions.list(response.data.results)); // TODO fix pagination
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(partialRefundActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(partialRefundActions.isLoading(false));
  };
}

export const consumerPaymentPackMaxoutBookingAction = {
  isLoading: createAction('CONSUMER_PACK/MAX_OUT/IS_LOADING'),
  error: createAction('CONSUMER_PACK/MAX_OUT/ERROR'),
  success: createAction('CONSUMER_PACK/MAX_OUT/SUCCESS'),
};

export function fetchConsumerPaymentPackMaxoutBooking(
  consumer_payment_pack_ids: number[],
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    if ((consumer_payment_pack_ids ?? []).length === 0) return;
    dispatch(consumerPaymentPackMaxoutBookingAction.isLoading(true));
    dispatch(consumerPaymentPackMaxoutBookingAction.error(null));
    try {
      const response = await fetchConsumerPaymentPackMaxoutBookingAPI({
        id__in: consumer_payment_pack_ids,
      });

      dispatch(consumerPaymentPackMaxoutBookingAction.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(consumerPaymentPackMaxoutBookingAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(consumerPaymentPackMaxoutBookingAction.isLoading(false));
  };
}

export function refundConsumerPaymentPack(
  id: number,
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(partialRefundActions.isLoading(true));
    dispatch(partialRefundActions.error(null));
    try {
      const response = await refundConsumerPaymentPackAPI(id, data);
      dispatch(partialRefundActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(partialRefundActions.error(error));
      if (isErrorWithCustomCode(error) && error.response.data?.error_code) {
        dispatch(
          snackbarError(
            `paymentPack:consumerPaymentPack.refund.error.${error.response.data.error_code}`,
          ),
        );
      } else {
        dispatch(
          snackbarError('paymentPack:consumerPaymentPack.refund.error.default'),
        );
      }
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(partialRefundActions.isLoading(false));
  };
}

export const byMember = {
  isLoading: createAction('CONSUMER_PACK/BY_MEMBER/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_MEMBER/ERROR'),
  success: createAction('CONSUMER_PACK/BY_MEMBER/SUCCESS'),
  reset: createAction('CONSUMER_PACK/BY_MEMBER/RESET'),
};

export function resetConsumerPackByMember() {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.reset());
  };
}

type FetchByMemberProps = {
  member: number;
  page?: number;
  page_size: number;
  filters: any;
  options?: OptionCallback;
  params?: any;
  current_consumer_pack_id?: number;
};

export function fetchByMember({
  member,
  page,
  page_size,
  options,
  params = {},
  current_consumer_pack_id,
}: FetchByMemberProps) {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.isLoading(true));
    dispatch(byMember.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        member,
        page,
        page_size,
        ...(params || {}),
        current_item_id: current_consumer_pack_id,
      });
      const current_page = response.data?.page ?? page;
      dispatch(byMember.success({ ...response.data, page: current_page }));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(byMember.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(byMember.isLoading(false));
  };
}

export const universalbyMember = {
  isLoading: createAction('UNIVERSAL_CONSUMER_PACK/BY_MEMBER/IS_LOADING'),
  error: createAction('UNIVERSAL_CONSUMER_PACK/BY_MEMBER/ERROR'),
  success: createAction('UNIVERSAL_CONSUMER_PACK/BY_MEMBER/SUCCESS'),
  reset: createAction('UNIVERSAL_CONSUMER_PACK/BY_MEMBER/RESET'),
};

export function fetchUniversalByMember(
  member: number,
  page: number,
  page_size: number,
  options?: OptionCallback,
  params: any = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(universalbyMember.isLoading(true));
    dispatch(universalbyMember.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        member,
        page,
        page_size,
        ...(params || {}),
      });
      dispatch(universalbyMember.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(universalbyMember.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(universalbyMember.isLoading(false));
  };
}

export const retrieveBulk = {
  isLoading: createAction('CONSUMER_PACK/RETRIEVE_BULK/IS_LOADING'),
  error: createAction('CONSUMER_PACK/RETRIEVE_BULK/ERROR'),
  success: createAction('CONSUMER_PACK/RETRIEVE_BULK/SUCCESS'),
};

export function retrieveConsumerPackBulk(
  ids: Array<number>,
  options?: OptionCallback<ConsumerPaymentPack[]>,
) {
  return async (dispatch: Dispatch) => {
    if (!ids || ids.length === 0) {
      if (options && options.onSuccess) {
        options.onSuccess([]);
        return;
      }
    }
    dispatch(retrieveBulk.isLoading(true));
    dispatch(retrieveBulk.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        id__in: ids,
        page_size: null,
      });
      dispatch(retrieveBulk.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(retrieveBulk.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(retrieveBulk.isLoading(false));
  };
}

/**
 * To be used only in cases where the length of the batch could be
 * critical.
 */
export function retrieveConsumerPackBulkBatched(
  ids: Array<number>,
  options?: OptionCallback<ConsumerPaymentPack[]>,
) {
  return async (dispatch: Dispatch) => {
    const id_uniq = uniq(ids);
    if (!id_uniq.length) {
      options.onSuccess([]);
      return;
    }

    const BATCH_SIZE = 50;

    const ids_batched = chunk(id_uniq, BATCH_SIZE);

    const boundActionList = ids_batched.map(
      (batch_ids) => () =>
        dispatch(
          retrieveConsumerPackBulk(batch_ids, {
            onSuccess: options?.onSuccess,
            onError: options?.onError,
          }),
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

      // No implementation of a general "onSuccess" since they are all handled batch by batch
    } catch (err) {
      console.error(err);
      // No implementation of a general "onError" since they are all handled batch by batch
    }
  };
}

export const fetchConsumerPackAction = {
  isLoading: createAction<boolean>(
    'CONSUMER_PACK/GET_CONSUMER_PACK/IS_LOADING',
  ),
  error: createAction<Error | null>('CONSUMER_PACK/GET_CONSUMER_PACK/ERROR'),
  success: createAction<ConsumerPaymentPack>(
    'CONSUMER_PACK/GET_CONSUMER_PACK/SUCCESS',
  ),
};

export function fetchConsumerPack(
  id: number,
  options: OptionCallback<ConsumerPaymentPack>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchConsumerPackAction.isLoading(true));
    dispatch(fetchConsumerPackAction.error(null));
    try {
      const response = await fetchConsumerPackAPI(id);
      dispatch(fetchConsumerPackAction.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchConsumerPackAction.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchConsumerPackAction.isLoading(false));
  };
}

export const forBookingActions = {
  isLoading: createAction('CONSUMER_PACK/FOR_BOOKING/IS_LOADING'),
  error: createAction('CONSUMER_PACK/FOR_BOOKING/ERROR'),
  success: createAction('CONSUMER_PACK/FOR_BOOKING/SUCCESS'),
  reset: createAction('CONSUMER_PACK/FOR_BOOKING/RESET'),
};

export const resetConsumerPackForBooking = forBookingActions.reset;

export function fetchConsumerPaymentPackForBooking(
  offer: number,
  options: OptionCallback<ConsumerPaymentPack[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(forBookingActions.isLoading(true));
    dispatch(forBookingActions.error(null));
    dispatch(forBookingActions.success([]));
    try {
      const response = await fetchByOfferByMemberAPI(offer, { mine: true });
      dispatch(forBookingActions.success(response.data));
      if (options && options.onSuccess) {
        // @ts-expect-error
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(forBookingActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(forBookingActions.isLoading(false));
  };
}

export const fetchConsumerPaymentPackExtensionListActions = {
  isLoading: createAction<boolean>('CONSUMER_PACK/EXTENSION_LIST/LOADING'),
  error: createAction<Error | null>('CONSUMER_PACK/EXTENSION_LIST/ERROR'),
  success: createAction<PaginatedResponse<ConsumerPaymentPackExtension>>(
    'CONSUMER_PACK/EXTENSION_LIST/SUCCESS',
  ),
};

/**
 * Fetch the list of extensions for a specific consumer payment pack
 * @param params Object containing the required `consumer_payment_pack` ID + optional pagination params
 */
export function fetchConsumerPaymentPackExtensionList(
  params: ConsumerPaymentPackExtensionParams,
  options?: OptionCallback<PaginatedResponse<ConsumerPaymentPackExtension>>,
) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(fetchConsumerPaymentPackExtensionListActions.isLoading(true));
    dispatch(fetchConsumerPaymentPackExtensionListActions.error(null));

    const page = getState().consumerPaymentPack.extension.page ?? 1;
    try {
      const response = await fetchConsumerPaymentPackExtensionListAPI({
        ...params,
        page: params.page ?? page,
        page_size: CONSUMER_PAYMENT_PACK_EXTENSION_PAGE_SIZE,
      });

      dispatch(
        fetchConsumerPaymentPackExtensionListActions.success(response.data),
      );
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchConsumerPaymentPackExtensionListActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(fetchConsumerPaymentPackExtensionListActions.isLoading(false));
    }
  };
}

export const createConsumerPaymentPackExtensionActions = {
  isLoading: createAction<boolean>('CONSUMER_PACK/EXTENSION/CREATE/LOADING'),
  error: createAction<Error | null>('CONSUMER_PACK/EXTENSION/CREATE/ERROR'),
};

/**
 * Create an extension for a consumer payment pack
 * @param data The payload sent for the creation of the extension
 */
export function createConsumerPaymentPackExtension(
  data: ConsumerPaymentPackExtensionCreate,
  options?: OptionCallback<ConsumerPaymentPackExtension>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createConsumerPaymentPackExtensionActions.isLoading(true));
    dispatch(createConsumerPaymentPackExtensionActions.error(null));
    try {
      const response = await createConsumerPaymentPackExtensionAPI(data);

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(createConsumerPaymentPackExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(createConsumerPaymentPackExtensionActions.isLoading(false));
    }
  };
}

export const deleteConsumerPaymentPackExtensionActions = {
  isLoading: createAction<boolean>('CONSUMER_PACK/EXTENSION/DELETE/LOADING'),
  error: createAction<Error | null>('CONSUMER_PACK/EXTENSION/DELETE/ERROR'),
};

/**
 * Delete a consumer payment pack extension
 * @param id The ID of the extension to delete
 */
export function deleteConsumerPaymentPackExtension(
  id: number,
  options?: OptionCallback<number>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteConsumerPaymentPackExtensionActions.isLoading(true));
    dispatch(deleteConsumerPaymentPackExtensionActions.error(null));
    try {
      await deleteConsumerPaymentPackExtensionAPI(id);

      options?.onSuccess?.(id);
    } catch (error) {
      console.error(error);
      dispatch(deleteConsumerPaymentPackExtensionActions.error(error));
      options?.onError?.();
    } finally {
      dispatch(deleteConsumerPaymentPackExtensionActions.isLoading(false));
    }
  };
}

export const listConsumerPaymentPackCompatibleActions = {
  isLoading: createAction('CONSUMER_PACK/COMPATIBLE_LIST/IS_LOADING'),
  error: createAction('CONSUMER_PACK/COMPATIBLE_LIST/ERROR'),
  success: createAction('CONSUMER_PACK/COMPATIBLE_LIST/SUCCESS'),
  reset: createAction('CONSUMER_PACK/COMPATIBLE_LIST/RESET'),
};

export const resetConsumerPaymentPackCompatibleList =
  listConsumerPaymentPackCompatibleActions.reset;

export function fetchConsumerPaymentPackCompatibleList(
  params: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listConsumerPaymentPackCompatibleActions.isLoading(true));
    dispatch(listConsumerPaymentPackCompatibleActions.error(null));
    try {
      const response = await fetchConsumerPaymentPackCompatibleListAPI(params);
      dispatch(listConsumerPaymentPackCompatibleActions.success(response.data));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(listConsumerPaymentPackCompatibleActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(listConsumerPaymentPackCompatibleActions.isLoading(false));
  };
}

export const listConsumerPaymentPackPenaltyActions = {
  isLoading: createAction('CONSUMER_PACK/PENALTY_LIST/IS_LOADING'),
  error: createAction('CONSUMER_PACK/PENALTY_LIST/ERROR'),
  success: createAction('CONSUMER_PACK/PENALTY_LIST/SUCCESS'),
};

export function fetchConsumerPaymentPackPenalty(
  consumerPaymentPackId: number,
  page: number,
  page_size: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listConsumerPaymentPackPenaltyActions.isLoading(true));
    dispatch(listConsumerPaymentPackPenaltyActions.error(null));
    try {
      const response = await fetchConsumerPaymentPackPenaltyAPI({
        consumer_payment_pack: consumerPaymentPackId,
        page,
        page_size,
      });
      dispatch(
        listConsumerPaymentPackPenaltyActions.success({
          // @ts-expect-error
          ...response.data,
          page,
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(listConsumerPaymentPackPenaltyActions.error(error));
    }
    dispatch(listConsumerPaymentPackPenaltyActions.isLoading(false));
  };
}

export const listConsumerPaymentPackActions = {
  isLoading: createAction('CONSUMER_PAYMENT_PACK/LIST/IS_LOADING'),
  error: createAction('CONSUMER_PAYMENT_PACK/LIST/ERROR'),
  success: createAction('CONSUMER_PAYMENT_PACK/LIST/SUCCESS'),
  reset: createAction('CONSUMER_PAYMENT_PACK/LIST/RESET'),
};

export function fetchConsumerPaymentPackList(
  params: any,
  options: OptionCallback<ConsumerPaymentPackREST[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listConsumerPaymentPackActions.isLoading(true));
    dispatch(listConsumerPaymentPackActions.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI(params);
      dispatch(
        listConsumerPaymentPackActions.success({
          ...response.data,
          page: params?.page || 1,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(listConsumerPaymentPackActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(listConsumerPaymentPackActions.isLoading(false));
  };
}
