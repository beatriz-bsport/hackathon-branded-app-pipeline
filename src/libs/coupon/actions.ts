import { createAction } from 'redux-actions';

import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
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
  createUniqueCodeCoupon as createUniqueCodeCouponAPI,
  updateUniqueCodeCoupon as updateUniqueCodeCouponAPI,
  retrieveCoupon as retrieveCouponAPI,
  markCodesAsRedeemed as markCodesAsRedeemedAPI,
  exportCodesAsCsv as exportCodesAsCsvAPI,
} from './api';

import { OptionCallback, Dispatch, ThunkAction } from '../../state/types';
import {
  Coupon,
  CouponTemplate,
  CouponTemplateInstance,
  Discount,
  FetchCouponsParams,
  FetchDiscountParams,
  ResetDiscountList,
  UniqueCodeCouponCreationPayload,
} from '#libs/coupon/types';
import { FranchiseProductTemplateQueryParams } from '#libs/franchise/types';

export const couponList = {
  error: createAction<Error | null>('COUPON/LIST/ERROR'),
  isLoading: createAction<boolean>('COUPON/LIST/IS_LOADING'),
  success: createAction<{ results: Coupon[] }>('COUPON/LIST/SUCCESS'),
  delete: createAction<string>('COUPON/LIST/DELETE'),
};

export function fetchCouponPage(
  page: number,
  options?: OptionCallback<Coupon[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponList.isLoading(true));
    dispatch(couponList.error(null));

    try {
      const response = await fetchCouponPageAPI(page);
      dispatch(couponList.success({ results: response.data }));
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

export function fetchCoupons(
  data: FetchCouponsParams,
  options?: OptionCallback<Coupon[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponList.isLoading(true));
    dispatch(couponList.error(null));
    try {
      const response = await fetchCouponsAPI(data);
      dispatch(
        couponList.success({
          results: response.data,
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
  error: createAction<Error | null>('COUPON/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction<boolean>('COUPON/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction<Coupon>('COUPON/CREATE_OR_UPDATE/SUCCESS'),
};

export function createCoupon(
  data: Coupon,
  options?: OptionCallback<Coupon>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await createCouponAPI(data);
      dispatch(couponCreateOrUpdate.success(response.data));
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
  data: Coupon,
  options?: OptionCallback<Coupon>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await updateCouponAPI(id, data);
      dispatch(couponCreateOrUpdate.success(response.data));
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
  error: createAction<Error | null>('DISCOUNT/LIST/ERROR'),
  isLoading: createAction<boolean>('DISCOUNT/LIST/IS_LOADING'),
  success: createAction<Discount[] | ResetDiscountList>(
    'DISCOUNT/LIST/SUCCESS',
  ),
};

export function fetchCouponDiscounts(
  couponId: number,
  params: FetchDiscountParams,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(discountList.isLoading(true));
    dispatch(discountList.error(null));

    try {
      const { page } = params;
      const response = await fetchCouponDiscountsAPI(couponId, params);
      const optionalPageResponse = page
        ? { ...response.data, page }
        : { ...response.data };
      dispatch(discountList.success(optionalPageResponse));
      dispatch(discountList.error(null));
    } catch (error) {
      dispatch(discountList.error(error));
    }

    dispatch(discountList.isLoading(false));
  };
}

export function fetchDiscountList(
  params: FetchDiscountParams,
  options: OptionCallback<Discount[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(discountList.isLoading(true));
    dispatch(discountList.error(null));

    try {
      const { page } = params;
      const response = await fetchDiscountListAPI(params);
      const optionalPageResponse = page
        ? { ...response.data, page }
        : { ...response.data };

      dispatch(discountList.success(optionalPageResponse));
      dispatch(discountList.error(null));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(discountList.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(discountList.isLoading(false));
  };
}

export function untagCoupon(coupondId: number, tagId: number): ThunkAction {
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

export function resetDiscounts(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(discountList.success({ results: [], count: 0, page: 1 }));
  };
}

export const listCouponTemplateActions = {
  isLoading: createAction<boolean>('COUPON_TEMPLATE/LIST/IS_LOADING'),
  error: createAction<Error | null>('COUPON_TEMPLATE/LIST/ERROR'),
  success: createAction<CouponTemplate[]>('COUPON_TEMPLATE/LIST/SUCCESS'),
};

export function fetchCouponTemplateList(
  params?: FranchiseProductTemplateQueryParams,
  options?: OptionCallback<CouponTemplate[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listCouponTemplateActions.error(null));
    dispatch(listCouponTemplateActions.isLoading(true));
    try {
      const response = await fetchCouponTemplateListAPI(params);
      const finalPayload: CouponTemplate[] = Array.isArray(response.data)
        ? response.data
        : response.data.results;
      dispatch(listCouponTemplateActions.success(finalPayload));

      if (options && options.onSuccess) {
        options.onSuccess(finalPayload);
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
  isLoading: createAction<boolean>(
    'COUPON_TEMPLATE/CREATE_OR_UPDATE/IS_LOADING',
  ),
  error: createAction<Error | null>('COUPON_TEMPLATE/CREATE_OR_UPDATE/ERROR'),
  success: createAction<CouponTemplate>(
    'COUPON_TEMPLATE/CREATE_OR_UPDATE/SUCCESS',
  ),
};

export function createOrUpdateCouponTemplate(
  data: CouponTemplate,
  options?: OptionCallback<CouponTemplate>,
): ThunkAction {
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
  isLoading: createAction<boolean>('COUPON_TEMPLATE/DELETE/IS_LOADING'),
  error: createAction<Error | null>('COUPON_TEMPLATE/DELETE/ERROR'),
  success: createAction<number>('COUPON_TEMPLATE/DELETE/SUCCESS'),
};

export function deleteCouponTemplate(
  id: number,
  options?: OptionCallback<null>,
): ThunkAction {
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
  isLoading: createAction<boolean>(
    'COUPON_TEMPLATE_INSTANCE/CREATE/IS_LOADING',
  ),
  error: createAction<Error | null>('COUPON_TEMPLATE_INSTANCE/CREATE/ERROR'),
  success: createAction<CouponTemplateInstance>(
    'COUPON_TEMPLATE_INSTANCE/CREATE/SUCCESS',
  ),
};

export function createCouponTemplateInstance(
  data: CouponTemplate,
  options?: OptionCallback<CouponTemplateInstance>,
): ThunkAction {
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
  isLoading: createAction<boolean>(
    'COUPON_TEMPLATE_INSTANCE/DELETE/IS_LOADING',
  ),
  error: createAction<Error | null>('COUPON_TEMPLATE_INSTANCE/DELETE/ERROR'),
  success: createAction<null>('COUPON_TEMPLATE_INSTANCE/DELETE/SUCCESS'),
};

export function deleteCouponTemplateInstance(
  id: number,
  options?: OptionCallback<null>,
): ThunkAction {
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
  isLoading: createAction<boolean>('COUNPON_TEMPLATE/RETRIEVE/IS_LOADING'),
  error: createAction<Error | null>('COUNPON_TEMPLATE/RETRIEVE/ERROR'),
  success: createAction<CouponTemplate>('COUNPON_TEMPLATE/RETRIEVE/SUCCESS'),
};

export function retrieveCouponTemplate(
  id: number,
  options?: OptionCallback<CouponTemplate>,
): ThunkAction {
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

export function createUniqueCodeCoupon(
  data: UniqueCodeCouponCreationPayload,
  options?: OptionCallback<Coupon>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await createUniqueCodeCouponAPI(data);
      dispatch(couponCreateOrUpdate.success(response.data));
      dispatch(snackbarSuccess('coupon.create.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(couponCreateOrUpdate.error(error));
      dispatch(snackbarError('coupon.create.error'));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(couponCreateOrUpdate.isLoading(false));
  };
}

export function updateUniqueCodeCoupon(
  id: number,
  data: UniqueCodeCouponCreationPayload,
  options?: OptionCallback<Coupon>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await updateUniqueCodeCouponAPI(id, data);
      dispatch(couponCreateOrUpdate.success(response.data));
      dispatch(snackbarSuccess('coupon.update.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(couponCreateOrUpdate.error(error));
      dispatch(snackbarError('coupon.update.error'));
      if (options && options.onError) {
        options.onError();
      }
    }

    dispatch(couponCreateOrUpdate.isLoading(false));
  };
}

export const retrieveCouponActions = {
  isLoading: createAction<boolean>('COUPON/RETRIEVE/IS_LOADING'),
  error: createAction<Error | null>('COUPON/RETRIEVE/ERROR'),
  success: createAction<Coupon>('COUPON/RETRIEVE/SUCCESS'),
};

export function retrieveCoupon(
  couponId: string | number,
  options?: OptionCallback<Coupon>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCouponActions.isLoading(true));
    dispatch(retrieveCouponActions.error(null));

    try {
      const response = await retrieveCouponAPI(couponId);
      dispatch(retrieveCouponActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(retrieveCouponActions.error(null));
    } catch (error) {
      dispatch(retrieveCouponActions.error(error));
      if (options && options.onError) {
        options.onError();
      }
    }

    dispatch(retrieveCouponActions.isLoading(false));
  };
}

export function markCodesAsRedeemed(
  id: string | number,
  codes: string[],
  options?: OptionCallback<Coupon>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(couponCreateOrUpdate.isLoading(true));
    dispatch(couponCreateOrUpdate.error(null));

    try {
      const response = await markCodesAsRedeemedAPI(id, { codes });
      dispatch(couponCreateOrUpdate.success(response.data));
      dispatch(snackbarSuccess('coupon.update.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(couponCreateOrUpdate.error(error));
      dispatch(snackbarError('coupon.update.error'));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(couponCreateOrUpdate.isLoading(false));
  };
}

export const exportCodesAsCsvActions = {
  isLoading: createAction<boolean>(
    'UNIQUE_CODE_COUPON/EXPORT_CODES/IS_LOADING',
  ),
  error: createAction<Error | null>('UNIQUE_CODE_COUPON/EXPORT_CODES/ERROR'),
};

export function exportCodesAsCsv(
  id: string | number,
  codes: string[],
  options?: OptionCallback<string>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportCodesAsCsvActions.isLoading(true));
    dispatch(exportCodesAsCsvActions.error(null));

    try {
      const response = await exportCodesAsCsvAPI(id, { codes });
      dispatch(snackbarSuccess('coupon.exportCodes.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(exportCodesAsCsvActions.error(error));
      dispatch(snackbarError('coupon.exportCodes.error'));
      if (options && options.onError) {
        options.onError();
      }
    }

    dispatch(exportCodesAsCsvActions.isLoading(false));
  };
}
