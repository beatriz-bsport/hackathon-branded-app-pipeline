import api from '../api';
import types from './paymentPack.types';

export function fetchedAllPaymentPacks(paymentPacks) {
  return { type: types.HAS_FETCHED_ALL_PAYMENT_PACKS, paymentPacks };
}
export function startFetchAllPaymentPacks() {
  return { type: types.START_FETCH_ALL_PAYMENT_PACKS };
}

export function errorFetchingAllPaymentPacks(err) {
  return { type: types.ERROR_FETCHING_ALL_PAYMENT_PACKS, err };
}

export function fetchAll() {
  return async (dispatch, getState) => {
    /*
    if (getState().activity.loading) {
      return dispatch(activityAlreadyLoading());
    }
    */
    dispatch(startFetchAllPaymentPacks());

    try {
      const response = await api.paymentPack.fetchAll();
      const paymentPacks = response.data;
      dispatch(fetchedAllPaymentPacks(paymentPacks));
    } catch (err) {
      dispatch(errorFetchingAllPaymentPacks(JSON.stringify(err)));
    }
  };
}
