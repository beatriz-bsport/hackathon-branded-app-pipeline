import { createAction } from 'redux-actions';

import {
  retrieveSubshopList as retrieveSubshopListAPI,
  createSubshop as createSubshopAPI,
  updateSubshop as updateSubshopAPI,
  deleteSubshop as deleteSubshopAPI,
} from '../api';

import type { SubShop } from '#libs/shop/types';
import type { Dispatch, OptionCallback } from '../../../state/types';

export const retrieveSubshopListActions = {
  isLoading: createAction<boolean>('SUB_SHOP/LIST/LOADING'),
  error: createAction<Error | null>('SUB_SHOP/LIST/ERROR'),
  success: createAction<SubShop[]>('SUB_SHOP/LIST/SUCCESS'),
};

/**
 * Retrieves the list of all subshops from a company
 * @param company The company ID
 */
export const retrieveSubshopList = (
  company?: number,
  options?: OptionCallback<SubShop[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveSubshopListActions.isLoading(true));
      dispatch(retrieveSubshopListActions.error(null));

      const result = await retrieveSubshopListAPI(company && { company });

      dispatch(retrieveSubshopListActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(retrieveSubshopListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(retrieveSubshopListActions.isLoading(false));
    }
  };
};

export const createSubshopActions = {
  isLoading: createAction<boolean>('SUB_SHOP/CREATE/LOADING'),
  error: createAction<Error | null>('SUB_SHOP/CREATE/ERROR'),
  success: createAction<SubShop>('SUB_SHOP/CREATE/SUCCESS'),
};

/**
 * Creates a new company subshop
 * @param data Object containing the name of the new subshop
 */
export const createSubshop = (
  data: { name: string },
  options?: OptionCallback<SubShop>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createSubshopActions.isLoading(true));
      dispatch(createSubshopActions.error(null));

      const result = await createSubshopAPI(data);

      dispatch(createSubshopActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(createSubshopActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createSubshopActions.isLoading(false));
    }
  };
};

export const updateSubshopActions = {
  isLoading: createAction<boolean>('SUB_SHOP/UPDATE/LOADING'),
  error: createAction<Error | null>('SUB_SHOP/UPDATE/ERROR'),
  success: createAction<SubShop>('SUB_SHOP/UPDATE/SUCCESS'),
};

/**
 * Updates an existing company subshop
 * @param data Object containing the ID + name of existing subshop
 */
export const updateSubshop = (
  data: { id: number; name: string },
  options?: OptionCallback<SubShop>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateSubshopActions.isLoading(true));
      dispatch(updateSubshopActions.error(null));

      const result = await updateSubshopAPI(data);

      dispatch(updateSubshopActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(updateSubshopActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(updateSubshopActions.isLoading(false));
    }
  };
};

export const deleteSubshopActions = {
  isLoading: createAction<boolean>('SUB_SHOP/DELETE/LOADING'),
  error: createAction<Error | null>('SUB_SHOP/DELETE/ERROR'),
  success: createAction<number>('SUB_SHOP/DELETE/SUCCESS'),
};

/**
 * Deletes an existing company subshop
 * @param id The ID of the subshop to delete
 */
export const deleteSubshop = (id: number, options?: OptionCallback<number>) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteSubshopActions.isLoading(true));
      dispatch(deleteSubshopActions.error(null));

      await deleteSubshopAPI(id);

      dispatch(deleteSubshopActions.success(id));
      options?.onSuccess?.(id);
    } catch (error) {
      dispatch(deleteSubshopActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteSubshopActions.isLoading(false));
    }
  };
};
