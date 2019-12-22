// @flow

import * as Sentry from '@sentry/browser';

import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  fetchAllEstablishments as fetchEstablishmentListAPI,
  fetchEstablishment as fetchEstablishmentAPI,
  updateEstablishment as updateEstablishmentAPI,
  addEstablishment as addEstablishmentAPI,
  deleteEstablishment as deleteEstablishmentAPI,
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAPI,
} from './api';
import { API_URI, postAuth, deleteAuth } from '../../http';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import type { Dispatch } from '../../state/types';

import { createDictionnaryById, createIdList } from '../../actions/utils';
import { getFreshEstablishmentIds } from './selectors';

export const deleteActions = {
  isLoading: createAction('ESTABLISHMENT/DELETE/IS_LOADING'),
  error: createAction('ESTABLISHMENT/DELETE/ERROR'),
  success: createAction('ESTABLISHMENT/DELETE/SUCCESS'),
};

export function deleteEstablishment(
  id: number,
  options: ?{ onSuccess: () => void, onError: ?() => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteActions.isLoading(true));
    dispatch(deleteActions.error(null));
    try {
      await deleteEstablishmentAPI(id);
      dispatch(snackbarSuccess('establishment:forms.delete.message.success'));
      dispatch(resetEstablishments());
      dispatch(fetchEstablishments());
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(deleteActions.isLoading(false));
      dispatch(deleteActions.error(err));
      dispatch(snackbarError('establishment:forms.delete.message.error'));
      if (options && options.onError) options.onError();
    }
  };
}
export const resetAction = createAction('ESTABLISHMENT/RESET/SUCCESS');

export function resetEstablishments() {
  return async (dispatch: Dispatch) => {
    dispatch(resetAction(true));
  };
}

export const listIsLoading = createAction('ESTABLISHMENTS/LIST/IS_LOADING');
export const listLoaded = createAction('ESTABLISHMENTS/LIST/LOADED');
export const listError = createAction('ESTABLISHMENTS/LIST/ERROR');

export function fetchEstablishments() {
  return async (dispatch: Dispatch) => {
    dispatch(listIsLoading(true));
    dispatch(listError(null));

    try {
      const response = await fetchEstablishmentListAPI({ page_size: 100 });
      dispatch(
        listLoaded({
          establishmentDict: createDictionnaryById(response.data.results),
          establishmentIdList: createIdList(response.data.results),
        }),
      );
    } catch (error) {
      console.error(error);
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
    dispatch(removeImage.isLoading(true));
    dispatch(removeImage.error(null));

    try {
      await deleteAuth(`${API_URI}/establishments/${id}/images/${imageId}/`);
      dispatch(fetchEstablishmentDetail(id));
    } catch (error) {
      dispatch(removeImage.error(error));
      Sentry.captureException(error);
    }
    dispatch(removeImage.isLoading(false));
  };
}

export const detailActions = {
  isLoading: createAction('ESTABLISHMENT/DETAIL/LOADING'),
  error: createAction('ESTABLISHMENT/DETAIL/ERROR'),
  success: createAction('ESTABLISHMENT/DETAIL/SUCCESS'),
};

export function fetchEstablishmentDetail(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(detailActions.isLoading(true));
    dispatch(detailActions.error(null));

    try {
      const response = await fetchEstablishmentAPI(id);
      const payload = { [response.data.id]: response.data };
      dispatch(detailActions.success(payload));
    } catch (error) {
      dispatch(detailActions.error(error));
    }

    dispatch(detailActions.isLoading(false));
  };
}

export const associatedEstablishmentListActions = {
  isLoading: createAction('ASSOCIATED_ESTABLISHMENT/LIST/LOADING'),
  error: createAction('ASSOCIATED_ESTABLISHMENT/LIST/ERROR'),
  success: createAction('ASSOCIATED_ESTABLISHMENT/LIST/SUCCESS'),
};

export function fetchAssociatedEstablishments() {
  return async (dispatch: Dispatch) => {
    dispatch(associatedEstablishmentListActions.isLoading(true));
    dispatch(associatedEstablishmentListActions.error(null));

    try {
      const response = await fetchAssociatedEstablishmentsAPI();
      dispatch(associatedEstablishmentListActions.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(associatedEstablishmentListActions.error(error));
    }

    dispatch(associatedEstablishmentListActions.isLoading(false));
  };
}

export const establishmentBulkRetrieveActions = {
  isLoading: createAction('ESTABLISHMENT/BULK_RETRIEVE/IS_LOADING'),
  error: createAction('ESTABLISHMENT/BULK_RETRIEVE/ERROR'),
  success: createAction('ESTABLISHMENT/BULK_RETRIEVE/SUCCESS'),
};

export function fetchEstablishmentBulk(
  ids: Array<number>,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const freshEstablishmentList = getFreshEstablishmentIds(getState());
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshEstablishmentList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }

    dispatch(establishmentBulkRetrieveActions.isLoading(true));
    dispatch(establishmentBulkRetrieveActions.error(null));
    try {
      const response = await fetchEstablishmentListAPI({
        page_size: 300,
        id__in: ids_uniq,
      });
      dispatch(establishmentBulkRetrieveActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(establishmentBulkRetrieveActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(establishmentBulkRetrieveActions.isLoading(false));
  };
}
