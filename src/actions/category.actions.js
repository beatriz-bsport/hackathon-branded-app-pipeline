import api from '../api';
import types from './category.types';

export function fetchSCT() {
  return async (dispatch, getState) => {
    try {
      const response = await api.category.fetchSCT();
      const SCTs = response.data;
      dispatch(fetchedSCTs(SCTs));
    } catch (err) {}
  };
}

export function fetchedSCTs(SCTs) {
  return { SCTs, type: types.HAS_FETCHED_SCTS };
}
