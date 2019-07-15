// @flow

import * as Sentry from '@sentry/browser';

import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';

import {
  fetchAllEstablishments as fetchAllAPI,
  updateEstablishment as updateEstablishmentAPI,
  addEstablishment as addEstablishmentAPI,
} from './api';
import { API_URI, postAuth, deleteAuth } from '../../http';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import type { Dispatch } from '../../state/types';

export const listIsLoading = createAction('ESTABLISHMENTS/LIST/IS_LOADING');
export const listLoaded = createAction('ESTABLISHMENTS/LIST/LOADED');
export const listError = createAction('ESTABLISHMENTS/LIST/ERROR');

export function fetchEstablishments() {
  return async (dispatch: Dispatch) => {
    dispatch(listIsLoading(true));
    dispatch(listError(null));

    try {
      const response = await fetchAllAPI();
      dispatch(listLoaded(response.data));
    } catch (error) {
      dispatch(listError(error));
    }

    dispatch(listIsLoading(false));
  };
}

export const upsertIsLoading = createAction('ESTABLISHMENTS/UPSERT/IS_LOADING');
export const upsertLoaded = createAction('ESTABLISHMENTS/UPSERT/LOADED');
export const upsertError = createAction('ESTABLISHMENTS/UPSERT/ERROR');

export function createOrUpdateEstablishment(establishmentData: FormData) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertIsLoading(true));

    try {
      const createOrUpdate = establishmentData.has('id')
        ? updateEstablishmentAPI
        : addEstablishmentAPI;
      const response = await createOrUpdate(establishmentData);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data);
      }

      dispatch(upsertLoaded(response));
      const message = establishmentData.has('id')
        ? 'establishment.forms.update.success'
        : 'establishment.forms.create.success';
      dispatch(snackbarSuccess(message));
      dispatch(push('/establishment'));
      dispatch(fetchEstablishments());
    } catch (error) {
      dispatch(snackbarError('establishment.forms.error'));
      dispatch(upsertError(error));
    }

    dispatch(upsertIsLoading(false));
  };
}

export const actionStartUpdate = createAction('ESTABLISHMENTS/UPDATE/START');

export function startUpdate(establishment: { id: number }) {
  return async (dispatch: Dispatch) => {
    dispatch(actionStartUpdate(establishment));
    dispatch(push(`/establishments/edit/${establishment.id}`));
  };
}

export const addImage = {
  isLoading: createAction('ESTABLISHMENTS/ADD_IMAGE/IS_LOADING'),
  error: createAction('ESTABLISHMENTS/ADD_IMAGE/ERROR'),
  success: createAction('ESTABLISHMENTS/ADD_IMAGE/SUCCESS'),
};

export function addImageToEstablishment(id: number, image: File) {
  return async (dispatch: Dispatch) => {
    dispatch(addImage.isLoading({ id, loading: true }));
    dispatch(addImage.error(null));

    try {
      const data = new FormData();
      data.append('image', image);
      const response = await postAuth(
        `${API_URI}/establishments/${id}/images/`,
        data,
      );
      dispatch(addImage.success({ id, image: response.data }));
    } catch (error) {
      dispatch(addImage.error(error));
      Sentry.captureException(error);
    }
    dispatch(addImage.isLoading({ id, loading: false }));
  };
}

export const removeImage = {
  isLoading: createAction('ESTABLISHMENTS/REMOVE_IMAGE/IS_LOADING'),
  error: createAction('ESTABLISHMENTS/REMOVE_IMAGE/ERROR'),
  success: createAction('ESTABLISHMENTS/REMOVE_IMAGE/SUCCESS'),
};

export function removeImageFromEstablishment(id: number, imageId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(removeImage.isLoading({ id, imageId, loading: true }));
    dispatch(removeImage.error(null));

    try {
      await deleteAuth(`${API_URI}/establishments/${id}/images/${imageId}/`);
      dispatch(removeImage.success({ id, imageId }));
    } catch (error) {
      dispatch(removeImage.error(error));
      Sentry.captureException(error);
    }
    dispatch(removeImage.isLoading({ id, imageId, loading: false }));
  };
}
