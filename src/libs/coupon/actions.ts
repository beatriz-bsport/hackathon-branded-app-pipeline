import { createAction } from 'redux-actions';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import {
  fetchCouponPage as fetchCouponPageAPI,
  fetchCouponDiscounts as fetchCouponDiscountsAPI,
  fetchDiscountList as fetchDiscountListAPI,
  createCoupon as createCouponAPI,
  updateCoupon as updateCouponAPI,
  deleteCoupon as deleteCouponAPI,
  fetchCoupons as fetchCouponsAPI,
  untagCoupon as untagCouponAPI,
  fetchCouponTemplateList as fetchCouponTemplateListAPI,
  createOrUpdateCouponTemplate as createOrUpdateCouponTemplateAPI,
  deleteCouponTemplate as deleteCouponTemplateAPI,
  retrieveCouponTemplate as retrieveCouponTemplateAPI,
  createCouponTemplateInstance as createCouponTemplateInstanceAPI,
  deleteCouponTemplateInstance as deleteCouponTemplateInstanceAPI,
} from './api';

import { OptionCallback, Dispatch, ThunkAction } from '../../state/types';
import { Coupon, CouponTemplate } from './types';

export const couponList = {
  error: createAction('COUPON/LIST/ERROR'),
  isLoading: createAction('COUPON/LIST/IS_LOADING'),
  success: createAction('COUPON/LIST/SUCCESS'),
  delete: createAction('COUPON/LIST/DELETE'),
};

export function fetchCouponPage(page: number, options?: any): ThunkAction {
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
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(couponList.error(null));
    } catch (error) {
      dispatch(couponList.error(error));
    }

    dispatch(couponList.isLoading(false));
  };
}

export function fetchCoupons(data: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(couponList.isLoading(true));
    dispatch(couponList.error(null));
    try {
      const response = await fetchCouponsAPI(data);
      dispatch(
        couponList.success({
          items: response.data,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(couponList.error(null));
    } catch (error) {
      dispatch(couponList.error(error));
    }

    dispatch(couponList.isLoading(false));
  };
}

export function deleteCoupon(
  id: string,
  options?: { onSuccess?: () => void; onError?: () => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponList.isLoading(true));
    dispatch(couponList.error(null));

    try {
      await deleteCouponAPI(id);
      dispatch(couponList.delete(id));
      dispatch(couponList.error(null));
      dispatch(fetchCouponPage(1));
      dispatch(snackbarSuccess('coupon.delete.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(couponList.error(error));
      dispatch(snackbarError('coupon.delete.error'));
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
  data: any,
  options?: OptionCallback<Coupon>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await createCouponAPI(data);
      dispatch(couponCreateOrUpdate.success(response.data));
      dispatch(couponCreateOrUpdate.error(null));
      dispatch(snackbarSuccess('coupon.create.success'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(couponList.error(error));
      dispatch(snackbarError('coupon.create.error'));
      if (options && options.onError) options.onError();
    }

    dispatch(couponCreateOrUpdate.isLoading(false));
  };
}

export function updateCoupon(
  id: string | number,
  data: any,
  options?: OptionCallback<Coupon>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await updateCouponAPI(id, data);
      dispatch(couponCreateOrUpdate.success(response.data));
      dispatch(couponCreateOrUpdate.error(null));
      dispatch(snackbarSuccess('coupon.update.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(couponList.error(error));
      dispatch(snackbarError('coupon.update.error'));
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

export function fetchDiscountList(
  params: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(discountList.isLoading(true));
    dispatch(discountList.error(null));

    try {
      const response = await fetchDiscountListAPI(params);
      if (params.page) {
        response.data.page = params.page;
      }
      dispatch(discountList.success(response.data));
      dispatch(discountList.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(discountList.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(discountList.isLoading(false));
  };
}

export function untagCoupon(coupondId: number, tagId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));
    try {
      await untagCouponAPI(coupondId, tagId);
    } catch (err) {
      dispatch(couponCreateOrUpdate.error(err));
    }

    dispatch(couponCreateOrUpdate.isLoading(false));
  };
}

export function resetDiscounts() {
  return async (dispatch: Dispatch) => {
    dispatch(discountList.success({ results: [], count: 0, page: 1 }));
  };
}

export const listCouponTemplateActions = {
  isLoading: createAction('COUPON_TEMPLATE/LIST/IS_LOADING'),
  error: createAction('COUPON_TEMPLATE/LIST/ERROR'),
  success: createAction('COUPON_TEMPLATE/LIST/SUCCESS'),
};

export function fetchCouponTemplateList(
  params?: {
    franchisor?: number;
    id__in?: Array<number>;
  },
  options?: OptionCallback<Array<CouponTemplate>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listCouponTemplateActions.error(null));
    dispatch(listCouponTemplateActions.isLoading(true));
    try {
      const response = await fetchCouponTemplateListAPI(params);
      dispatch(
        listCouponTemplateActions.success(
          response.data.results || response.data,
        ),
      );

      if (options && options.onSuccess) {
        options.onSuccess(response.data.results || response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(listCouponTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(listCouponTemplateActions.isLoading(false));
  };
}

export const createOrUpdateCouponTemplateActions = {
  isLoading: createAction('COUPON_TEMPLATE/CREATE_OR_UPDATE/IS_LOADING'),
  error: createAction('COUPON_TEMPLATE/CREATE_OR_UPDATE/ERROR'),
  success: createAction('COUPON_TEMPLATE/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateCouponTemplate(
  data: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateCouponTemplateActions.error(null));
    dispatch(createOrUpdateCouponTemplateActions.isLoading(true));
    try {
      const response = await createOrUpdateCouponTemplateAPI(data);
      dispatch(createOrUpdateCouponTemplateActions.success(response.data));

      if (options && options.onSuccess) {
        dispatch(snackbarSuccess('coupon.createOrUpdate.success'));
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('coupon.createOrUpdate.error'));
      dispatch(createOrUpdateCouponTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createOrUpdateCouponTemplateActions.isLoading(false));
  };
}

export const deleteCouponTemplateActions = {
  isLoading: createAction('COUPON_TEMPLATE/DELETE/IS_LOADING'),
  error: createAction('COUPON_TEMPLATE/DELETE/ERROR'),
  success: createAction('COUPON_TEMPLATE/DELETE/SUCCESS'),
};

export function deleteCouponTemplate(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCouponTemplateActions.error(null));
    dispatch(deleteCouponTemplateActions.isLoading(true));
    try {
      const response = await deleteCouponTemplateAPI(id);
      dispatch(deleteCouponTemplateActions.success(id));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
        dispatch(snackbarSuccess(`coupon.delete.success`));
      }
    } catch (err) {
      console.error(err);
      dispatch(deleteCouponTemplateActions.error(err));
      dispatch(snackbarError(`coupon.delete.error`));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deleteCouponTemplateActions.isLoading(false));
  };
}

export const createCouponTemplateInstanceActions = {
  isLoading: createAction('COUPON_TEMPLATE_INSTANCE/CREATE/IS_LOADING'),
  error: createAction('COUPON_TEMPLATE_INSTANCE/CREATE/ERROR'),
  success: createAction('COUPON_TEMPLATE_INSTANCE/CREATE/SUCCESS'),
};

export function createCouponTemplateInstance(
  data: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCouponTemplateInstanceActions.error(null));
    dispatch(createCouponTemplateInstanceActions.isLoading(true));
    try {
      const response = await createCouponTemplateInstanceAPI(data);
      dispatch(createCouponTemplateInstanceActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createCouponTemplateInstanceActions.error(err));
      dispatch(snackbarError('coupon.templateInstance.create.error'));
      if (options && options.onError) options.onError(err);
    }
    dispatch(createCouponTemplateInstanceActions.isLoading(false));
  };
}

export const deleteCouponTemplateInstanceActions = {
  isLoading: createAction('COUPON_TEMPLATE_INSTANCE/DELETE/IS_LOADING'),
  error: createAction('COUPON_TEMPLATE_INSTANCE/DELETE/ERROR'),
  success: createAction('COUPON_TEMPLATE_INSTANCE/DELETE/SUCCESS'),
};

export function deleteCouponTemplateInstance(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCouponTemplateInstanceActions.error(null));
    dispatch(deleteCouponTemplateInstanceActions.isLoading(true));
    try {
      const response = await deleteCouponTemplateInstanceAPI(id);
      dispatch(deleteCouponTemplateInstanceActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(deleteCouponTemplateInstanceActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(deleteCouponTemplateInstanceActions.isLoading(false));
  };
}

export const retrieveCouponTemplateActions = {
  isLoading: createAction('COUNPON_TEMPLATE/RETRIEVE/IS_LOADING'),
  error: createAction('COUNPON_TEMPLATE/RETRIEVE/ERROR'),
  success: createAction('COUNPON_TEMPLATE/RETRIEVE/SUCCESS'),
};

export function retrieveCouponTemplate(
  id: number,
  options?: OptionCallback<CouponTemplate>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCouponTemplateActions.error(null));
    dispatch(retrieveCouponTemplateActions.isLoading(true));
    try {
      const response = await retrieveCouponTemplateAPI(id);
      dispatch(retrieveCouponTemplateActions.success(response.data));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrieveCouponTemplateActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(retrieveCouponTemplateActions.isLoading(false));
  };
}
