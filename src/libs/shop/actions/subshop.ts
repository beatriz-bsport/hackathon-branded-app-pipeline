import { createAction } from 'redux-actions';

import { AxiosResponse } from 'axios';
import * as api from '#libs/shop/api';

import { snackbarSuccess, snackbarError } from '#libs/snackbar/actions';
import type {
  Dispatch,
  OptionCallback,
  PaginatedResponse,
} from '../../../state/types';
import { SubShop, SubShopAPI } from '../types';

export const subshopListActions = {
  isLoading: createAction<boolean>('SUBSHOP/LIST/LOADING'),
  error: createAction<Error | null>('SUBSHOP/LIST/ERROR'),
  success: createAction<PaginatedResponse<SubShop>>('SUBSHOP/LIST/SUCCESS'),
};

export function fetchAllSubShop(
  companyId?: number,
  option?: OptionCallback<AxiosResponse<PaginatedResponse<SubShop>>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(subshopListActions.error(null));
    dispatch(subshopListActions.isLoading(true));

    try {
      const response = await api.fetchAllSubShop({
        companyId,
      });
      dispatch(subshopListActions.success(response.data));
      option?.onSuccess?.(response);
    } catch (e) {
      option?.onError?.(e);
      dispatch(subshopListActions.error(e));
    }
    dispatch(subshopListActions.isLoading(false));
  };
}

export const subShopCreateOrUpdateActions = {
  isLoading: createAction<boolean>('SUBSHOP/CREATE_OR_UPDATE/LOADING'),
  error: createAction<Error | null>('SUBSHOP/CREATE_OR_UPDATE/ERROR'),
  success: createAction<SubShopAPI>('SUBSHOP/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateSubShop({
  name,
  id,
}: {
  name: string;
  id?: number;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(subShopCreateOrUpdateActions.isLoading(true));
    dispatch(subShopCreateOrUpdateActions.error(null));

    const createOrUpdate = id ? api.updateSubShop : api.createSubShop;
    try {
      const response = await createOrUpdate({ name, id });

      dispatch(subShopCreateOrUpdateActions.success(response.data));
      dispatch(snackbarSuccess('shop.subShop.createOrUpdate.success'));
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('shop.subShop.createOrUpdate.error'));
      dispatch(subShopCreateOrUpdateActions.error(e));
    }
    dispatch(subShopCreateOrUpdateActions.isLoading(false));
  };
}

export const subshopDeleteActions = {
  isLoading: createAction<boolean>('SUBSHOP/DELETE/LOADING'),
  error: createAction<Error | null>('SUBSHOP/DELETE/ERROR'),
  success: createAction<number>('SUBSHOP/DELETE/SUCCESS'),
};

export function deleteSubShop(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(subshopDeleteActions.isLoading(true));
    dispatch(subshopDeleteActions.error(null));

    try {
      await api.deleteSubShop(id);
      dispatch(subshopDeleteActions.success(id));
      dispatch(snackbarSuccess('shop.subShop.delete.success'));
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('shop.subShop.delete.error'));
      dispatch(subshopDeleteActions.isLoading(true));
      dispatch(subshopDeleteActions.error(e));
    }
    dispatch(subshopDeleteActions.isLoading(false));
  };
}

export default {
  fetchAllSubShop,
  createOrUpdateSubShop,
  deleteSubShop,
};
