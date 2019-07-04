// @flow

import * as api from '../api';
import types from '../action.types';

import type { Dispatch } from '../../../state/types';

export function provisionFetchStart(page: number) {
  return { type: types.PROVISION_FETCH_START, page };
}
export function provisionFetchSuccess(data: *) {
  return { type: types.PROVISION_FETCH_SUCCESS, data };
}
export function provisionFetchError(error: ?Error) {
  return { type: types.PROVISION_FETCH_ERROR, error };
}

export function fetchProvisions(
  shopitemId: number,
  page: number,
  page_size: ?number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(provisionFetchStart(page));
    try {
      const response = await api.fetchProvisions(shopitemId, page, page_size);
      if (response.status === 200) {
        const { data } = response;
        return dispatch(provisionFetchSuccess(data));
      }
      return dispatch(provisionFetchError(Error(response.status)));
    } catch (e) {
      console.error(e);
      return dispatch(provisionFetchError(e));
    }
  };
}

export function provisionCreateOrUpdateStart(id: ?number) {
  return { type: types.PROVISION_CREATEORUPDATE_START, id };
}
export function provisionCreateOrUpdateSuccess(data: *) {
  return { type: types.PROVISION_CREATEORUPDATE_SUCCESS, data };
}
export function provisionCreateOrUpdateError(error: ?Error) {
  return { type: types.PROVISION_CREATEORUPDATE_ERROR, error };
}

export function createOrUpdateProvision(data_: *, callback: ?() => void) {
  return async (dispatch: Dispatch) => {
    dispatch(provisionCreateOrUpdateStart());
    try {
      const response = await api.createProvision(data_);
      const { data } = response;
      dispatch(provisionCreateOrUpdateSuccess(data));
      if (typeof callback === 'function') {
        callback();
      }
      return;
    } catch (e) {
      console.error(e);
      dispatch(provisionCreateOrUpdateError(e));
    }
  };
}

export default {
  fetchProvisions,
  createOrUpdateProvision,
};
