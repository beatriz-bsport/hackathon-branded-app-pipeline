import { createAction } from 'redux-actions';

import type {
  SubShop,
  SubshopTemplate,
  SubshopTemplateCreate,
  SubshopTemplateUpdate,
} from '#src/libs/shop/types';
import type { PaginationFilterParams } from '#src/libs/types';
import type { RootState } from '#src/reducers';

import { FRANCHISE_SUBSHOP_TEMPLATE_PAGE_SIZE } from '#src/libs/shop/constants';
import type {
  Dispatch,
  OptionCallback,
  PaginatedResponse,
} from '../../../state/types';
import {
  fetchSubshopList as retrieveSubshopListAPI,
  createSubshop as createSubshopAPI,
  updateSubshop as updateSubshopAPI,
  deleteSubshop as deleteSubshopAPI,
  fetchSubshopTemplateList as fetchSubshopTemplateListAPI,
  createSubshopTemplate as createSubshopTemplateAPI,
  updateSubshopTemplate as updateSubshopTemplateAPI,
  deleteSubshopTemplate as deleteSubshopTemplateAPI,
} from '../api';

export const fetchSubshopListActions = {
  isLoading: createAction<boolean>('SUB_SHOP/LIST/LOADING'),
  error: createAction<Error | null>('SUB_SHOP/LIST/ERROR'),
  success: createAction<SubShop[]>('SUB_SHOP/LIST/SUCCESS'),
};

/**
 * Fetch the list of all subshops from a company
 * @param company The company ID
 */
export const fetchSubshopList = (
  company?: number,
  options?: OptionCallback<SubShop[]>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(fetchSubshopListActions.isLoading(true));
      dispatch(fetchSubshopListActions.error(null));

      const result = await retrieveSubshopListAPI(company && { company });

      dispatch(fetchSubshopListActions.success(result.data));
      options?.onSuccess?.(result.data);
    } catch (error) {
      dispatch(fetchSubshopListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchSubshopListActions.isLoading(false));
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

export const fetchSubshopTemplateListActions = {
  isLoading: createAction<boolean>('SUB_SHOP_TEMPLATE/LIST/LOADING'),
  error: createAction<Error | null>('SUB_SHOP_TEMPLATE/LIST/ERROR'),
  success: createAction<PaginatedResponse<SubshopTemplate>>(
    'SUB_SHOP_TEMPLATE/LIST/SUCCESS',
  ),
};

/**
 * Fetch the list of existing subshop templates
 */
export const fetchSubshopTemplateList = (
  params?: PaginationFilterParams,
  options?: OptionCallback<PaginatedResponse<SubshopTemplate>>,
) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const page =
      params?.page ??
      getState().shopReworked.shopTemplates.subshopTemplate.page;
    try {
      dispatch(fetchSubshopTemplateListActions.isLoading(true));
      dispatch(fetchSubshopTemplateListActions.error(null));

      const response = await fetchSubshopTemplateListAPI({
        page,
        page_size: FRANCHISE_SUBSHOP_TEMPLATE_PAGE_SIZE,
      });

      dispatch(fetchSubshopTemplateListActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchSubshopTemplateListActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(fetchSubshopTemplateListActions.isLoading(false));
    }
  };
};

export const createSubshopTemplateActions = {
  isLoading: createAction<boolean>('SUB_SHOP_TEMPLATE/CREATE/LOADING'),
  error: createAction<Error | null>('SUB_SHOP_TEMPLATE/CREATE/ERROR'),
};

/**
 * Creates a new subshop template
 * @param data Object containing the name/franchisor/company_ids of the subshop template
 */
export const createSubshopTemplate = (
  data: SubshopTemplateCreate,
  options?: OptionCallback<SubshopTemplate>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createSubshopTemplateActions.isLoading(true));
      dispatch(createSubshopTemplateActions.error(null));

      const response = await createSubshopTemplateAPI(data);

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(createSubshopTemplateActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(createSubshopTemplateActions.isLoading(false));
    }
  };
};

export const updateSubshopTemplateActions = {
  isLoading: createAction<boolean>('SUB_SHOP_TEMPLATE/UPDATE/LOADING'),
  error: createAction<Error | null>('SUB_SHOP_TEMPLATE/UPDATE/ERROR'),
};

/**
 * Updates an existing subshop template
 * @param data Object containing the updated fields of the subshop template
 */
export const updateSubshopTemplate = (
  data: SubshopTemplateUpdate,
  options?: OptionCallback<SubshopTemplate>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateSubshopTemplateActions.isLoading(true));
      dispatch(updateSubshopTemplateActions.error(null));

      const response = await updateSubshopTemplateAPI(data);

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(updateSubshopTemplateActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(updateSubshopTemplateActions.isLoading(false));
    }
  };
};

export const deleteSubshopTemplateActions = {
  isLoading: createAction<boolean>('SUB_SHOP_TEMPLATE/DELETE/LOADING'),
  error: createAction<Error | null>('SUB_SHOP_TEMPLATE/DELETE/ERROR'),
};

/**
 * Deletes an existing subshop template
 * @param id The ID of the subshop template to delete
 */
export const deleteSubshopTemplate = (
  id: number,
  options?: OptionCallback<number>,
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteSubshopTemplateActions.isLoading(true));
      dispatch(deleteSubshopTemplateActions.error(null));

      await deleteSubshopTemplateAPI(id);

      options?.onSuccess?.(id);
    } catch (error) {
      dispatch(deleteSubshopTemplateActions.error(error));
      console.error(error);
      options?.onError?.();
    } finally {
      dispatch(deleteSubshopTemplateActions.isLoading(false));
    }
  };
};
