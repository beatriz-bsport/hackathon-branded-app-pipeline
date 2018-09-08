import api from '../api';
import types from './category.types';

export function fetchSCT() {
  return async (dispatch, getState) => {
    try {
      console.log('caca');
      const [categories, easyAccessesResponse] = await Promise.all([
        api.category.fetchSCT(),
        api.category.fetchEasyAccesses(),
      ]);
      const SCTs = categories.data;
      const easyAccesses = easyAccessesResponse.data;
      console.log('hello');
      dispatch(fetchedCategories(SCTs, easyAccesses));
    } catch (err) {}
  };
}

export function fetchedCategories(SCTs, easyAccesses) {
  return { SCTs, easyAccesses, type: types.HAS_FETCHED_SCTS };
}
