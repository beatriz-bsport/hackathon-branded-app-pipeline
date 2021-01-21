import { Dispatch } from 'redux';
import api from './api';
import { SCT } from './types';

export const actions = {
  HAS_FETCHED_SCTS: 'HAS_FETCHED_SCTS',
};

export function fetchSCT(params: any = {}) {
  return async (dispatch: Dispatch) => {
    try {
      const [categories, easyAccessesResponse] = await Promise.all([
        api.fetchSCT(params),
        api.fetchEasyAccesses(),
      ]);
      const SCTs = categories.data;
      const easyAccesses = easyAccessesResponse.data;
      dispatch(fetchedCategories(SCTs, easyAccesses));
    } catch (err) {
      console.error(err);
    }
  };
}

function fetchedCategories(SCTs: Array<SCT>, easyAccesses: Array<SCT>) {
  return { SCTs, easyAccesses, type: actions.HAS_FETCHED_SCTS };
}
