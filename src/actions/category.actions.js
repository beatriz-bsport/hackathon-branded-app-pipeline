// @flow
import api from '../api';
import types from './category.types';

import type { Dispatch } from '../state/types.ts';

export function fetchSCT(params: any = {}) {
  return async (dispatch: Dispatch) => {
    try {
      const [categories, easyAccessesResponse] = await Promise.all([
        api.category.fetchSCT(params),
        api.category.fetchEasyAccesses(),
      ]);
      const SCTs = categories.data;
      const easyAccesses = easyAccessesResponse.data;
      dispatch(fetchedCategories(SCTs, easyAccesses));
    } catch (err) {
      console.error(err);
    }
  };
}

export function fetchedCategories(SCTs: Array<SCT>, easyAccesses: Array<SCT>) {
  return { SCTs, easyAccesses, type: types.HAS_FETCHED_SCTS };
}
