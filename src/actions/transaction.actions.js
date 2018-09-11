import api from '../api';
import types from './transaction.types';

export function startFetchTransactions() {
  return { type: types.START_FETCH_TRANSACTIONS };
}
export function errorFetchingTransactions() {
  return { type: types.ERROR_FETCHING_TRANSACTIONS };
}
export function fetchedTransactions(transactions) {
  return { type: types.HAS_FETCHED_TRANSACTIONS, transactions };
}
export function fetchAll() {
  return async (dispatch) => {
    dispatch(startFetchTransactions());

    try {
      const response = await api.transaction.fetchAll();
      const transactions = response.data;
      dispatch(fetchedTransactions(transactions));
    } catch (err) {
      dispatch(errorFetchingTransactions());
    }
  };
}
