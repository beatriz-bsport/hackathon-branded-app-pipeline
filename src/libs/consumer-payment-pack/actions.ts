import { createAction } from 'redux-actions';

import type { Dispatch, OptionCallback } from '../../state/types';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import {
  fetchByOfferByMember as fetchByOfferByMemberAPI,
  fetchNonCompatibleByOfferByMember as fetchNonCompatibleByOfferByMemberAPI,
  fetchConsumerPackList as fetchConsumerPaymentPackListAPI,
  fetchExtensions as fetchExtensionListAPI,
  createExtension as createExtensionAPI,
  deleteExtension as deleteExtensionAPI,
  refundConsumerPaymentPack as refundConsumerPaymentPackAPI,
  fetchConsumerPaymentPackCreditRefundList as fetchConsumerPaymentPackCreditRefundListAPI,
  addCreditToConsumerPack as addCreditAPI,
  subCreditToConsumerPack as subCreditAPI,
  fetchConsumerPaymentPackCompatibleList as fetchConsumerPaymentPackCompatibleListAPI,
  fetchConsumerPaymentPackPenalty as fetchConsumerPaymentPackPenaltyAPI,
  createMassExtension as createMassExtensionAPI,
  fetchMassExtensions as fetchMassExtensionsAPI,
  deleteMassExtension as deleteMassExtensionAPI,
  unblock as unblockAPI,
  fetchConsumerPaymentPackMaxoutBooking as fetchConsumerPaymentPackMaxoutBookingAPI,
  fetchByOfferByMemberV2 as fetchByOfferByMemberV2API,
} from './api';

import { monitorBackgroundTask } from '../background-task/actions';
import { ConsumerPaymentPack, PaymentPackMassExtension } from './types';

export const byOfferByMember = {
  isLoading: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/ERROR'),
  success: createAction('CONSUMER_PACK/BY_OFFER_BY_MEMBER/SUCCESS'),
};

export function fetchByOfferByMember(
  offer: number,
  member: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(byOfferByMember.isLoading(true));
    dispatch(byOfferByMember.error(null));
    dispatch(byOfferByMember.success([]));
    try {
      const response = await fetchByOfferByMemberV2API(offer, { member });
      dispatch(byOfferByMember.success(response.data));
      if (options && options.onSuccess) {
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
  options?: OptionCallback,
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
      dispatch(partialRefundActions.list(response.data.results)); // TODO fix pagination
      if (options && options.onSuccess) {
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
    if ((consumer_payment_pack_ids || []).length === 0) return;
    dispatch(consumerPaymentPackMaxoutBookingAction.isLoading(true));
    dispatch(consumerPaymentPackMaxoutBookingAction.error(null));
    try {
      const response = await fetchConsumerPaymentPackMaxoutBookingAPI({
        id__in: consumer_payment_pack_ids,
      });

      dispatch(consumerPaymentPackMaxoutBookingAction.success(response.data));
      if (options && options.onSuccess) {
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
        options.onSuccess(response.data);
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

export const byMember = {
  isLoading: createAction('CONSUMER_PACK/BY_MEMBER/IS_LOADING'),
  error: createAction('CONSUMER_PACK/BY_MEMBER/ERROR'),
  success: createAction('CONSUMER_PACK/BY_MEMBER/SUCCESS'),
  reset: createAction('CONSUMER_PACK/BY_MEMBER/RESET'),
};

export function resetConsumerPackByMember() {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.success({ page: 1, count: 0, results: [] }));
  };
}

export function fetchByMember(
  member: number,
  page: number,
  page_size: number,
  options?: OptionCallback,
  params: any = {},
) {
  return async (dispatch: Dispatch) => {
    dispatch(byMember.isLoading(true));
    dispatch(byMember.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        member,
        page,
        page_size,
        ...(params || {}),
      });
      dispatch(byMember.success({ ...response.data, page }));
      if (options && options.onSuccess) {
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
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    if (!ids || ids.length === 0) return;
    dispatch(retrieveBulk.isLoading(true));
    dispatch(retrieveBulk.error(null));
    try {
      const response = await fetchConsumerPaymentPackListAPI({
        id__in: ids,
        page_size: null,
      });
      dispatch(retrieveBulk.success(response.data));
      if (options && options.onSuccess) {
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

// BEGIN Extension
//
// ----------------------------
//
export const extensionListActions = {
  isLoading: createAction('CONSUMER_PACK_EXTENSION/LIST/IS_LOADING'),
  error: createAction('CONSUMER_PACK_EXTENSION/LIST/ERROR'),
  success: createAction('CONSUMER_PACK_EXTENSION/LIST/SUCCESS'),
};

export function fetchPackExtensions(consumerPaymentPackId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(extensionListActions.isLoading(true));
    dispatch(extensionListActions.error(null));
    try {
      const response = await fetchExtensionListAPI(consumerPaymentPackId);
      dispatch(extensionListActions.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(extensionListActions.error(error));
    }
    dispatch(extensionListActions.isLoading(false));
  };
}

export const extensionCreateActions = {
  isLoading: createAction('CONSUMER_PACK_EXTENSION/CREATE/IS_LOADING'),
  error: createAction('CONSUMER_PACK_EXTENSION/CREATE/ERROR'),
  success: createAction('CONSUMER_PACK_EXTENSION/CREATE/SUCCESS'),
};

export function createPackExtension(data: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(extensionCreateActions.isLoading(true));
    dispatch(extensionCreateActions.error(null));
    try {
      const response = await createExtensionAPI(data);
      dispatch(extensionCreateActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(extensionCreateActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(extensionCreateActions.isLoading(false));
  };
}

export const massExtensionActions = {
  isLoading: createAction('CONSUMER_PACK_MASS_EXTENSION/IS_LOADING'),
  error: createAction('CONSUMER_PACK_MASS_EXTENSION/ERROR'),
  success: createAction('CONSUMER_PACK_MASS_EXTENSION/SUCCESS'),
  create: createAction('CONSUMER_PACK_MASS_EXTENSION/CREATE'),
};

export function fetchMassExtensionList(
  params: {
    paymentPack: number;
    page: number;
    page_size: number;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(massExtensionActions.isLoading(true));
    dispatch(massExtensionActions.error(null));
    try {
      const response = await fetchMassExtensionsAPI(params);
      response.data.page = params.page;
      dispatch(massExtensionActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (e) {
      console.error(e);
      dispatch(massExtensionActions.error(e));
      if (options && options.onError) options.onError();
    }
    dispatch(massExtensionActions.isLoading(false));
  };
}

export function createMassExtension(
  data: Pick<
    PaymentPackMassExtension,
    Exclude<keyof PaymentPackMassExtension, 'id' | 'date_created'>
  >,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(massExtensionActions.isLoading(true));
    dispatch(massExtensionActions.error(null));
    try {
      const response = await createMassExtensionAPI(data);
      dispatch(massExtensionActions.create(response.data));
      options && options.onSuccess && options.onSuccess();
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options.onSuccess,
        }),
      );
    } catch (e) {
      console.error(e);
      dispatch(massExtensionActions.error(e));
      if (options && options.onError) options.onError();
    }
    dispatch(massExtensionActions.isLoading(false));
  };
}

export function deleteMassExtension(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(massExtensionActions.isLoading(true));
    try {
      const response = await deleteMassExtensionAPI(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options.onSuccess,
        }),
      );
    } catch (e) {
      console.error(e);
      dispatch(massExtensionActions.error(e));
      if (options && options.onError) options.onError();
    }
    dispatch(massExtensionActions.isLoading(false));
  };
}

export const extensionDeleteActions = {
  isLoading: createAction('CONSUMER_PACK_EXTENSION/DELETE/IS_LOADING'),
  error: createAction('CONSUMER_PACK_EXTENSION/DELETE/ERROR'),
  success: createAction('CONSUMER_PACK_EXTENSION/DELETE/SUCCESS'),
};

export function deletePackExtension(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(extensionDeleteActions.isLoading(true));
    dispatch(extensionDeleteActions.error(null));
    try {
      await deleteExtensionAPI(id);
      dispatch(extensionDeleteActions.success(id));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(extensionDeleteActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(extensionDeleteActions.isLoading(false));
  };
}

//
// ----------------------------
//
// END Extension

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
  options: OptionCallback,
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
