// @flow

import { createAction } from 'redux-actions';
import * as api from '../api';

import type { Dispatch } from '../../../state/types';

export const provisionByShopItemActions = {
  isLoading: createAction('PROVISION/BY_SHOPITEM/LOADING'),
  error: createAction('PROVISION/BY_SHOPITEM/ERROR'),
  success: createAction('PROVISION/BY_SHOPITEM/SUCCESS'),
};

export function fetchProvisions(
  shopitemId: number,
  page: number,
  page_size: ?number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(provisionByShopItemActions.isLoading(true));
    dispatch(provisionByShopItemActions.error(null));
    try {
      const response = await api.fetchProvisions(shopitemId, page, page_size);
      dispatch(provisionByShopItemActions.success({ ...response.data, page }));
    } catch (e) {
      console.error(e);
      dispatch(provisionByShopItemActions.error(e));
    }
    dispatch(provisionByShopItemActions.isLoading(false));
  };
}

export const provisionCreateOrUpdateActions = {
  isLoading: createAction('PROVISION/CREATE_OR_UPDATE/LOADING'),
  error: createAction('PROVISION/CREATE_OR_UPDATE/ERROR'),
  success: createAction('PROVISION/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateProvision(data_: any, callback: ?() => void) {
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
