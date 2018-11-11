// @flow

import { push } from 'react-router-redux';

import api from '../api';
import types from './establishment.types';
import { snackbarSuccess, snackbarError } from './snackbar.actions';

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

export function actionCreateOrUpdateEstablishment(coachData) {
  return { type: types.ESTABLISHMENT_CREATE_OR_UPDATE, coach: coachData };
}
export function actionCreateOrUpdateEstablishmentSuccess(response) {
  return { type: types.ESTABLISHMENT_CREATE_OR_UPDATE_SUCCESS, response };
}
export function actionCreateOrUpdateEstablishmentError(error) {
  return { type: types.ESTABLISHMENT_CREATE_OR_UPDATE_ERROR, error };
}

export function createOrUpdateEstablishment(establishmentData) {
  return async (dispatch) => {
    try {
      dispatch(actionCreateOrUpdateEstablishment(establishmentData));
      const createOrUpdate = establishmentData.has('id')
        ? api.establishment.updateEstablishment
        : api.establishment.addEstablishment;
      const response = await createOrUpdate(establishmentData);

      if (response.status === 200 && response.status === 201) {
        dispatch(actionCreateOrUpdateEstablishmentSuccess(response));
        dispatch(
          snackbarSuccess(
            establishmentData.has('id')
              ? 'establishment.forms.update.success'
              : 'establishment.forms.create.success',
          ),
        );
        dispatch(push('/map'));
        dispatch(fetchEstablishments());
      } else {
        dispatch(snackbarError('establishment.forms.error'));
        dispatch(actionCreateOrUpdateEstablishmentError(response.data));
      }
    } catch (e) {
      dispatch(snackbarError('establishment.forms.error'));
      dispatch(actionCreateOrUpdateEstablishmentError(e));
    }
  };
}

export function actionStartUpdate(establishment) {
  return { type: types.ESTABLISHMENT_UPDATE, establishment };
}

export function startUpdate(establishment) {
  return async (dispatch) => {
    dispatch(actionStartUpdate(establishment));
    dispatch(push(`/establishments/edit/${establishment.id}`));
  };
}
