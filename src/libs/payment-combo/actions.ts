import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  fetchPaymentComboList as fetchPaymentComboListAPI,
  fetchPaymentComboPurchaseList as fetchPaymentComboPurchaseListAPI,
  createOrUpdatePaymentCombo as createOrUpdatePaymentComboAPI,
  retrievePaymentCombo as retrievePaymentComboAPI,
  deletePaymentCombo as deletePaymentComboAPI,
  fetchSelectedPaymentCombos as fetchSelectedPaymentCombosAPI,
} from './api';

import { fetchPrivatePassList as fetchPrivatePassListAPI } from '../private-service/api';

import type {
  Dispatch,
  ThunkAction,
  OptionCallback,
  OptionPaginatedCallback,
  PaginatedResponse,
} from '../../state/types';
import type {
  PaymentComboPayload,
  PaymentCombo,
  FetchPaymentComboListParams,
  FetchPaymentComboPurchaseListParams,
  PaymentComboPurchase,
} from './types';
import { PrivatePass } from '#libs/private-service/types';

export const paymentComboRetrieveActions = {
  error: createAction<Error | null>('PAYMENT_COMBO/RETRIEVE/ERROR'),
  isLoading: createAction<boolean>('PAYMENT_COMBO/RETRIEVE/IS_LOADING'),
  success: createAction<PaymentCombo>('PAYMENT_COMBO/RETRIEVE/SUCCESS'),
};
export function fetchPaymentCombo(
  id: number,
  options?: OptionCallback<PaymentCombo>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboRetrieveActions.isLoading(true));
    dispatch(paymentComboRetrieveActions.error(null));

    try {
      const response = await retrievePaymentComboAPI(id);
      dispatch(paymentComboRetrieveActions.success(response.data));
      dispatch(paymentComboRetrieveActions.error(null));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(paymentComboRetrieveActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(paymentComboRetrieveActions.isLoading(false));
  };
}

export const paymentComboListActions = {
  error: createAction<Error | null>('PAYMENT_COMBO/LIST/ERROR'),
  isLoading: createAction<boolean>('PAYMENT_COMBO/LIST/IS_LOADING'),
  success: createAction<PaymentCombo[]>('PAYMENT_COMBO/LIST/SUCCESS'),
};
export function fetchPaymentComboList(
  params?: FetchPaymentComboListParams,
  options?: OptionCallback<PaymentCombo[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboListActions.isLoading(true));
    dispatch(paymentComboListActions.error(null));

    try {
      const response = await fetchPaymentComboListAPI(params);
      dispatch(paymentComboListActions.success(response.data));
      dispatch(paymentComboListActions.error(null));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(paymentComboListActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(paymentComboListActions.isLoading(false));
  };
}

export const paymentComboBulkActions = {
  error: createAction<Error | null>('PAYMENT_COMBO/BULK/ERROR'),
  isLoading: createAction<boolean>('PAYMENT_COMBO/BULK/IS_LOADING'),
  success: createAction<PaymentCombo[]>('PAYMENT_COMBO/BULK/SUCCESS'),
};
export function fetchPaymentComboBulk(
  params: {
    company: Number;
    id__in?: Number[];
  },
  options?: OptionCallback<PaymentCombo[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboBulkActions.isLoading(true));
    dispatch(paymentComboBulkActions.error(null));

    try {
      const response = await fetchSelectedPaymentCombosAPI(params);
      // @ts-expect-error
      dispatch(paymentComboBulkActions.success(response.data));
      dispatch(paymentComboBulkActions.error(null));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(paymentComboBulkActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(paymentComboBulkActions.isLoading(false));
  };
}

export const paymentComboDeleteActions = {
  error: createAction<Error | null>('PAYMENT_COMBO/DELETE/ERROR'),
  isLoading: createAction<boolean>('PAYMENT_COMBO/DELETE/IS_LOADING'),
  success: createAction<number>('PAYMENT_COMBO/DELETE/SUCCESS'),
};
export function deletePaymentCombo(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboDeleteActions.isLoading(true));
    dispatch(paymentComboDeleteActions.error(null));

    try {
      await deletePaymentComboAPI(id);
      dispatch(paymentComboDeleteActions.success(id));
      dispatch(paymentComboDeleteActions.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(paymentComboDeleteActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(paymentComboDeleteActions.isLoading(false));
  };
}

export const paymentComboCreateOrUpdateActions = {
  error: createAction<Error | null>('PAYMENT_COMBO/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction<boolean>('PAYMENT_COMBO/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction<PaymentCombo>('PAYMENT_COMBO/CREATE_OR_UPDATE/SUCCESS'),
};
export function createOrUpdatePaymentCombo(
  data: PaymentComboPayload,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboCreateOrUpdateActions.isLoading(true));
    dispatch(paymentComboCreateOrUpdateActions.error(null));

    try {
      const response = await createOrUpdatePaymentComboAPI(data);
      dispatch(paymentComboCreateOrUpdateActions.success(response.data));
      dispatch(paymentComboCreateOrUpdateActions.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(paymentComboCreateOrUpdateActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(paymentComboCreateOrUpdateActions.isLoading(false));
  };
}

export const paymentComboPurchaseListActions = {
  error: createAction<Error | null>('PAYMENT_COMBO_PURCHASE/LIST/ERROR'),
  isLoading: createAction<boolean>('PAYMENT_COMBO_PURCHASE/LIST/IS_LOADING'),
  success: createAction<PaginatedResponse<PaymentComboPurchase[]>>(
    'PAYMENT_COMBO_PURCHASE/LIST/SUCCESS',
  ),
};
export function fetchPaymentComboPurchaseList(
  params: FetchPaymentComboPurchaseListParams,
  options?: OptionPaginatedCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboPurchaseListActions.isLoading(true));
    dispatch(paymentComboPurchaseListActions.error(null));

    try {
      const response = await fetchPaymentComboPurchaseListAPI(params);
      dispatch(paymentComboPurchaseListActions.success(response.data));
      dispatch(paymentComboPurchaseListActions.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(paymentComboPurchaseListActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(paymentComboPurchaseListActions.isLoading(false));
  };
}

export const paymentComboForBookingActions = {
  error: createAction<Error | null>('PAYMENT_COMBO_PURCHASE/FOR_BOOKING/ERROR'),
  isLoading: createAction<boolean>(
    'PAYMENT_COMBO_PURCHASE/FOR_BOOKING/IS_LOADING',
  ),
  success: createAction<PaymentCombo[]>(
    'PAYMENT_COMBO_PURCHASE/FOR_BOOKING/SUCCESS',
  ),
  reset: createAction('PAYMENT_COMBO_PURCHASE/FOR_BOOKING/RESET'),
};
export const resetPaymentComboForBooking = paymentComboForBookingActions.reset;
export function fetchPaymentComboForBooking(
  company: number,
  offer: number,
  options: OptionCallback<PaymentCombo[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(paymentComboForBookingActions.isLoading(true));
    dispatch(paymentComboForBookingActions.error(null));

    try {
      const response = await fetchPaymentComboListAPI({
        manager_only: false,
        available: true,
        company,
        offer,
        include_expired: false,
      });
      dispatch(paymentComboForBookingActions.success(response.data));
      dispatch(paymentComboForBookingActions.error(null));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(paymentComboForBookingActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(paymentComboForBookingActions.isLoading(false));
  };
}

export const relatedPrivatePassBulkActions = {
  error: createAction<Error | null>('RELATED_PRIVATE_PASS/BULK/ERROR'),
  isLoading: createAction<boolean>('RELATED_PRIVATE_PASS/BULK/ISLOADING'),
  success: createAction<PrivatePass[]>('RELATED_PRIVATE_PASS/BULK/SUCCESS'),
};
export function fetchRelatedPrivatePassBulk(ids: number[]) {
  return async (dispatch: Dispatch) => {
    dispatch(relatedPrivatePassBulkActions.isLoading(true));
    dispatch(relatedPrivatePassBulkActions.error(null));
    try {
      const response = await fetchPrivatePassListAPI({
        id__in: uniq(ids.filter((id) => !!id)),
      });
      // @ts-expect-error
      dispatch(relatedPrivatePassBulkActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(relatedPrivatePassBulkActions.error(err));
    }
    dispatch(relatedPrivatePassBulkActions.isLoading(false));
  };
}

export const fetchPaymentComboFromContractActions = {
  error: createAction<Error | null>('PAYMENT_COMBO/FROM_CONTRACT/ERROR'),
  isLoading: createAction<boolean>('PAYMENT_COMBO/FROM_CONTRACT/IS_LOADING'),
  success: createAction<PaymentCombo[]>('PAYMENT_COMBO/FROM_CONTRACT/SUCCESS'),
};

export const fetchPaymentComboFromContract = (
  params: {
    company: number;
    id__in?: number[];
  },
  options?: OptionCallback<PaymentCombo[]>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPaymentComboFromContractActions.isLoading(true));
    dispatch(fetchPaymentComboFromContractActions.error(null));

    try {
      const ids_uniq = uniq((params?.id__in ?? []).filter((_id) => !!_id));
      if (params?.id__in && ids_uniq.length === 0) {
        return;
      }
      const response = await fetchPaymentComboListAPI(params);
      dispatch(fetchPaymentComboFromContractActions.success(response.data));
      dispatch(fetchPaymentComboFromContractActions.error(null));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchPaymentComboFromContractActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(fetchPaymentComboFromContractActions.isLoading(false));
  };
};
