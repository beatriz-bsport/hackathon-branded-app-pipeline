import api from '../api';
import types from './invoice.types';

export function startFetchInvoices() {
  return { type: types.START_FETCH_INVOICES };
}
export function errorFetchingInvoices() {
  return { type: types.ERROR_FETCHING_INVOICES };
}
export function fetchedInvoices(invoices) {
  return { type: types.HAS_FETCHED_INVOICES, invoices };
}
export function fetchAll() {
  return async (dispatch) => {
    dispatch(startFetchInvoices());

    try {
      const response = await api.invoice.fetchAll();
      const invoices = response.data;
      dispatch(fetchedInvoices(invoices));
    } catch (err) {
      dispatch(errorFetchingInvoices());
    }
  };
}
