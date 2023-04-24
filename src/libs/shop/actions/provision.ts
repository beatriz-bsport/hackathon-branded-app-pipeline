// @ts-nocheck
import { createAction } from 'redux-actions';
import * as api from '#libs/shop/api';

import { Dispatch, PaginatedResponse } from '../../../state/types';
import { Provision, ProvisionCreate } from '#libs/shop/types';

export const provisionByShopItemActions = {
  isLoading: createAction<boolean>('PROVISION/BY_SHOPITEM/LOADING'),
  error: createAction<Error | null>('PROVISION/BY_SHOPITEM/ERROR'),
  success: createAction<PaginatedResponse<Provision>>(
    'PROVISION/BY_SHOPITEM/SUCCESS',
  ),
};

export function fetchProvisions(
  shopitemId: number,
  page?: number,
  page_size?: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(provisionByShopItemActions.isLoading(true));
    dispatch(provisionByShopItemActions.error(null));
    try {
      const response = await api.fetchProvisions(shopitemId, page, page_size);
      const optionalPageResponse = page
        ? { ...response.data, page }
        : { ...response.data };

      dispatch(provisionByShopItemActions.success(optionalPageResponse));
    } catch (e) {
      console.error(e);
      dispatch(provisionByShopItemActions.error(e));
    }
    dispatch(provisionByShopItemActions.isLoading(false));
  };
}

export const provisionCreateOrUpdateActions = {
  isLoading: createAction<boolean>('PROVISION/CREATE_OR_UPDATE/LOADING'),
  error: createAction<Error | null>('PROVISION/CREATE_OR_UPDATE/ERROR'),
  success: createAction<Provision>('PROVISION/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateProvision(
  data_: Provision | ProvisionCreate,
  callback?: () => void,
) {
  return async (dispatch: Dispatch) => {
    dispatch(provisionCreateOrUpdateActions.isLoading(true));
    dispatch(provisionCreateOrUpdateActions.error(null));
    try {
      const response = await api.createProvision(data_);
      dispatch(provisionCreateOrUpdateActions.success(response.data));
      if (typeof callback === 'function') {
        callback();
      }
      return;
    } catch (e) {
      console.error(e);
      dispatch(provisionCreateOrUpdateActions.error(e));
    }
    dispatch(provisionCreateOrUpdateActions.isLoading(false));
  };
}

export default {
  fetchProvisions,
  createOrUpdateProvision,
};
