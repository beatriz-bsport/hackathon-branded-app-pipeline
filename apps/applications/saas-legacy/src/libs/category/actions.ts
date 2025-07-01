import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import api, { fetchSCTWithCache as fetchSCTWithCacheAPI } from './api';
import { SCT } from './types';

export const actions = {
  HAS_FETCHED_SCTS: 'HAS_FETCHED_SCTS',
  isLoading: createAction<boolean>('SCTS/FETCH/LOADING'),
};

export function fetchSCT(params: any = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(actions.isLoading(true));
    try {
      const categories = await api.fetchSCT(params);
      const SCTs = categories.data;
      // @ts-expect-error
      dispatch(fetchedCategories(SCTs));
    } catch (err) {
      console.error(err);
    }
    dispatch(actions.isLoading(false));
  };
}

export function fetchSCTWithCache(params: any = {}) {
  return async (dispatch: Dispatch) => {
    dispatch(actions.isLoading(true));
    try {
      const categories = await fetchSCTWithCacheAPI(params);
      const SCTs = categories.data;
      // @ts-expect-error
      dispatch(fetchedCategories(SCTs));
    } catch (err) {
      console.error(err);
    }
    dispatch(actions.isLoading(false));
  };
}

function fetchedCategories(SCTs: Array<SCT>) {
  return { SCTs, type: actions.HAS_FETCHED_SCTS };
}
