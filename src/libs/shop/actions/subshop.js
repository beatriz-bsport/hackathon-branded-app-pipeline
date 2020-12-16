// @flow
import { createAction } from 'redux-actions';

import * as api from '../api';

import {
  snackbarSuccess,
  snackbarError,
} from '../../../actions/snackbar.actions';
import type { Dispatch } from '../../../state/types.ts';

export const subshopListActions = {
  isLoading: createAction('SUBSHOP/LIST/LOADING'),
  error: createAction('SUBSHOP/LIST/ERROR'),
  success: createAction('SUBSHOP/LIST/SUCCESS'),
};

export function fetchAllSubShop(companyId: ?number) {
  return async (dispatch: Dispatch) => {
    dispatch(subshopListActions.error(null));
    dispatch(subshopListActions.isLoading(true));

    try {
      const response = await api.fetchAllSubShop({ companyId });
      dispatch(subshopListActions.success(response.data));
    } catch (e) {
      dispatch(subshopListActions.error(e));
    }
    dispatch(subshopListActions.isLoading(false));
  };
}

export const subShopCreateOrUpdateActions = {
  isLoading: createAction('SUBSHOP/CREATE_OR_UPDATE/LOADING'),
  error: createAction('SUBSHOP/CREATE_OR_UPDATE/ERROR'),
  success: createAction('SUBSHOP/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateSubShop({
  name,
  id,
}: {
  name: string,
  id: ?number,
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
  isLoading: createAction('SUBSHOP/DELETE/LOADING'),
  error: createAction('SUBSHOP/DELETE/ERROR'),
  success: createAction('SUBSHOP/DELETE/SUCCESS'),
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
