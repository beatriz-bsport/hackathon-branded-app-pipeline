// @flow

import { createAction } from 'redux-actions';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import {
  fetchCouponPage as fetchCouponPageAPI,
  fetchCouponDiscounts as fetchCouponDiscountsAPI,
  createCoupon as createCouponAPI,
  updateCoupon as updateCouponAPI,
  deleteCoupon as deleteCouponAPI,
} from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

export const couponList = {
  error: createAction('COUPON/LIST/ERROR'),
  isLoading: createAction('COUPON/LIST/IS_LOADING'),
  success: createAction('COUPON/LIST/SUCCESS'),
  delete: createAction('COUPON/LIST/DELETE'),
};

export function fetchCouponPage(page: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponList.isLoading(true));
    dispatch(couponList.error(null));

    try {
      const response = await fetchCouponPageAPI(page);
      dispatch(
        couponList.success({
          items: response.data,
          // page: response.data.next_page,
        }),
      );
      dispatch(couponList.error(null));
    } catch (error) {
      dispatch(couponList.error(error));
    }

    dispatch(couponList.isLoading(false));
  };
}

export function deleteCoupon(
  id: string,
  options?: { onSuccess?: () => void, onError?: () => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponList.isLoading(true));
    dispatch(couponList.error(null));

    try {
      await deleteCouponAPI(id);
      dispatch(couponList.delete(id));
      dispatch(couponList.error(null));
      dispatch(fetchCouponPage(1));
      dispatch(snackbarSuccess('coupon:message.delete.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(couponList.error(error));
      dispatch(snackbarError('coupon:message.delete.error'));
      if (options && options.onError) options.onError();
    }

    dispatch(couponList.isLoading(false));
  };
}

export const couponCreateOrUpdate = {
  error: createAction('COUPON/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('COUPON/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('COUPON/CREATE_OR_UPDATE/SUCCESS'),
};

export function createCoupon(
  data: *,
  options?: { onSuccess?: () => void, onError?: () => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await createCouponAPI(data);
      dispatch(couponCreateOrUpdate.success(response.data));
      dispatch(couponCreateOrUpdate.error(null));
      dispatch(snackbarSuccess('coupon:message.create.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(couponList.error(error));
      dispatch(snackbarError('coupon:message.create.error'));
      if (options && options.onError) options.onError();
    }

    dispatch(couponCreateOrUpdate.isLoading(false));
  };
}

export function updateCoupon(
  id: string,
  data: *,
  options?: { onSuccess?: () => void, onError?: () => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await updateCouponAPI(id, data);
      dispatch(couponCreateOrUpdate.success(response.data));
      dispatch(couponCreateOrUpdate.error(null));
      dispatch(snackbarSuccess('coupon:message.update.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(couponList.error(error));
      dispatch(snackbarError('coupon:message.update.error'));
      if (options && options.onError) options.onError();
    }

    dispatch(couponCreateOrUpdate.isLoading(false));
  };
}
export const discountList = {
  error: createAction('DISCOUNT/LIST/ERROR'),
  isLoading: createAction('DISCOUNT/LIST/IS_LOADING'),
  success: createAction('DISCOUNT/LIST/SUCCESS'),
};

export function fetchCouponDiscounts(
  couponId: number,
  params: any,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(discountList.isLoading(true));
    dispatch(discountList.error(null));

    try {
      const response = await fetchCouponDiscountsAPI(couponId, params);
      if (params.page) {
        response.data.page = params.page;
      }
      dispatch(discountList.success(response.data));
      dispatch(discountList.error(null));
    } catch (error) {
      dispatch(discountList.error(error));
    }

    dispatch(discountList.isLoading(false));
  };
}

export function resetDiscounts() {
  return async (dispatch: Dispatch) => {
    dispatch(discountList.success({ results: [], count: 0, page: 1 }));
  };
}
