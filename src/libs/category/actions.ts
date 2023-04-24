// @ts-nocheck
import { Dispatch } from 'redux';
import api from './api';
import { SCT } from './types';

export const actions = {
  HAS_FETCHED_SCTS: 'HAS_FETCHED_SCTS',
};

export function fetchSCT(params: any = {}) {
  return async (dispatch: Dispatch) => {
    try {
      const categories = await api.fetchSCT(params);
      const SCTs = categories.data;
      dispatch(fetchedCategories(SCTs));
    } catch (err) {
      console.error(err);
    }
  };
}

function fetchedCategories(SCTs: Array<SCT>) {
  return { SCTs, type: actions.HAS_FETCHED_SCTS };
}
