import api from '../api';
import types from './establishment.types';

export function startFetchEstablishments() {
  return { type: types.START_FETCH_ESTABLISHMENTS };
}
export function errorFetchingEstablishments() {
  return { type: types.ERROR_FETCHING_ESTABLISHMENTS };
}
export function fetchedEstablishments(establishments) {
  return { type: types.HAS_FETCHED_ESTABLISHMENTS, establishments };
}
export function fetchEstablishments() {
  return async (dispatch) => {
    dispatch(startFetchEstablishments());

    try {
      const response = await api.establishment.fetchAll();
      const establishments = response.data;
      dispatch(fetchedEstablishments(establishments));
    } catch (err) {
      dispatch(errorFetchingEstablishments());
    }
  };
}
