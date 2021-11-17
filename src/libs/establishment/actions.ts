import * as Sentry from '@sentry/react';

import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import { ThunkDispatch } from 'redux-thunk';
import type { Dispatch } from '../../state/types';
import {
  fetchAllEstablishments as fetchEstablishmentListAPI,
  fetchEstablishment as fetchEstablishmentAPI,
  fetchEstablishmentFavorite as fetchEstablishmentFavoriteAPI,
  updateEstablishment as updateEstablishmentAPI,
  updateEstablishmentV2 as updateEstablishmentV2API,
  addEstablishmentV2 as addEstablishmentV2API,
  addEstablishment as addEstablishmentAPI,
  deleteEstablishment as deleteEstablishmentAPI,
  fetchAssociatedEstablishments as fetchAssociatedEstablishmentsAPI,
  restoreEstablishment as restoreEstablishmentAPI,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAPI,
  createEstablishmentGroup as createEstablishmentGroupAPI,
  updateEstablishmentGroup as updateEstablishmentGroupAPI,
  deleteEstablishmentGroup as deleteEstablishmentGroupAPI,
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAPI,
  createEstablishmentBillingGroup as createEstablishmentBillingGroupAPI,
  updateEstablishmentBillingGroup as updateEstablishmentBillingGroupAPI,
  deleteEstablishmentBillingGroup as deleteEstablishmentBillingGroupAPI,
} from './api';
import { API_URI, postAuth, deleteAuth } from '../../http';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import { createDictionnaryById, createIdList } from '../../actions/utils';
import { getFreshEstablishmentIds } from './selectors';
import { RootState } from '../../reducers';
import { OptionCallback } from '../../state/types';

import type {
  EstablishmentAddressInput,
  EstablishmentGroup,
  EstablishmentBillingGroup,
} from './types';

export const deleteActions = {
  isLoading: createAction('ESTABLISHMENT/DELETE/IS_LOADING'),
  error: createAction('ESTABLISHMENT/DELETE/ERROR'),
  success: createAction('ESTABLISHMENT/DELETE/SUCCESS'),
};

export function deleteEstablishment(id: number, options?: OptionCallback) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(deleteActions.isLoading(true));
    dispatch(deleteActions.error(null));
    try {
      await deleteEstablishmentAPI(id);
      dispatch(snackbarSuccess('establishment.delete.success'));
      dispatch(resetEstablishments());
      dispatch(fetchEstablishments());
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(deleteActions.isLoading(false));
      dispatch(deleteActions.error(err));
      dispatch(snackbarError('establishment.delete.error'));
      if (options && options.onError) options.onError();
    }
  };
}

export const resetAction = createAction('ESTABLISHMENT/RESET/SUCCESS');

export function resetEstablishments() {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(resetAction(true));
  };
}

export const restoreActions = {
  isLoading: createAction('ESTABLISHMENT/RESTORE/IS_LOADING'),
  error: createAction('ESTABLISHMENT/RESTORE/IS_LOADING'),
  success: createAction('ESTABLISHMENT/RESTORE/IS_LOADING'),
};

export function restoreEstablishment(id: number, options?: OptionCallback) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(restoreActions.isLoading(true));
    try {
      const response = await restoreEstablishmentAPI(id);
      const payload = { [response.data.id]: response.data };
      dispatch(detailActions.success(payload));
      dispatch(snackbarSuccess('establishment.restore.success'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('establishment.restore.error'));
      if (options && options.onError) options.onError(err);
    }
    dispatch(restoreActions.isLoading(false));
  };
}

export const listIsLoading = createAction('ESTABLISHMENTS/LIST/IS_LOADING');
export const listLoaded = createAction('ESTABLISHMENTS/LIST/LOADED');
export const listError = createAction('ESTABLISHMENTS/LIST/ERROR');

export function fetchEstablishments(params?: any, options?: OptionCallback) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(listIsLoading(true));
    dispatch(listError(null));

    try {
      const response = await fetchEstablishmentListAPI({
        page_size: 100,
        ...(params || {}),
      });
      dispatch(
        listLoaded({
          establishmentDict: createDictionnaryById(response.data.results),
          establishmentIdList: createIdList(response.data.results),
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      console.error(error);
      dispatch(listError(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(listIsLoading(false));
  };
}

export const upsertIsLoading = createAction('ESTABLISHMENTS/UPSERT/IS_LOADING');
export const upsertLoaded = createAction('ESTABLISHMENTS/UPSERT/LOADED');
export const upsertError = createAction('ESTABLISHMENTS/UPSERT/ERROR');

export function createOrUpdateEstablishment(establishmentData: FormData) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
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
        ? 'establishment.update.success'
        : 'establishment.create.success';
      dispatch(snackbarSuccess(message));
      dispatch(push('/establishment'));
    } catch (error) {
      dispatch(snackbarError('establishment.error'));
      dispatch(upsertError(error));
    }

    dispatch(upsertIsLoading(false));
  };
}
export const UpdateOrCreateEstablishmentsActionsV2 = {
  isLoading: createAction('ESTABLISHMENTV2/UPSERT/IS_LOADING'),
  error: createAction('ESTABLISHMENTV2/UPSERT/ERROR'),
  success: createAction('ESTABLISHMENTV2/UPSERT/SUCCESS'),
};
export function createOrUpdateEstablishmentV2(
  id?: number,
  data: EstablishmentAddressInput,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(UpdateOrCreateEstablishmentsActionsV2.isLoading(true));
    dispatch(UpdateOrCreateEstablishmentsActionsV2.error(false));
    try {
      const response = id
        ? await updateEstablishmentV2API(id, data)
        : await addEstablishmentV2API(data);
      dispatch(
        UpdateOrCreateEstablishmentsActionsV2.success({
          id: id || response.data.id,
          data: response.data,
        }),
      );
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(UpdateOrCreateEstablishmentsActionsV2.error(err));
    }
    dispatch(UpdateOrCreateEstablishmentsActionsV2.isLoading(false));
  };
}

export const actionStartUpdate = createAction('ESTABLISHMENTS/UPDATE/START');

export function startUpdate(establishment: { id: number }) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
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
  return async (dispatch: ThunkDispatch<any, any, any>) => {
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
  return async (dispatch: ThunkDispatch<any, any, any>) => {
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
  return async (dispatch: ThunkDispatch<any, any, any>) => {
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

export function fetchAssociatedEstablishments(params?: { company: number }) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(associatedEstablishmentListActions.isLoading(true));
    dispatch(associatedEstablishmentListActions.error(null));

    try {
      const response = await fetchAssociatedEstablishmentsAPI(params);
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

function fetchEstablishmentBulkBase(
  params: any = {},
  options?: OptionCallback,
) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(establishmentBulkRetrieveActions.isLoading(true));
    dispatch(establishmentBulkRetrieveActions.error(null));
    let promise = null;
    try {
      const response = await fetchEstablishmentListAPI({
        page_size: 300,
        ...params,
      });
      promise = response.data;
      dispatch(establishmentBulkRetrieveActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(establishmentBulkRetrieveActions.error(error));
      if (options && options.onError) options.onError(error);
    }
    dispatch(establishmentBulkRetrieveActions.isLoading(false));
    return promise;
  };
}

export const fetchEstablishmentBulk = (
  ids: Array<number>,
  options?: OptionCallback,
) => {
  return async (
    dispatch: ThunkDispatch<any, any, any>,
    getState: () => RootState,
  ) => {
    const freshEstablishmentList = getFreshEstablishmentIds(getState());
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshEstablishmentList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    const res = await dispatch(
      fetchEstablishmentBulkBase({ id__in: ids_uniq }, options),
    );
    /* eslint-disable-next-line */
    return res;
  };
};

export const fetchAssociatedEstablishmentBulk = (
  ids: Array<number>,
  options?: OptionCallback,
) => {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    const ids_uniq = uniq(ids.filter((id) => !!id));
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(
      fetchEstablishmentBulkBase(
        { associated_establishment__in: ids_uniq },
        options,
      ),
    );
  };
};

export const favoriteActions = {
  isLoading: createAction('ESTABLISHMENT/FAVORITE/IS_LOADING'),
  error: createAction('ESTABLISHMENT/FAVORITE/ERROR'),
  success: createAction('ESTABLISHMENT/FAVORITE/SUCCESS'),
};

export function fetchEstablishmentFavorite(
  company: number,
  options?: OptionCallback,
) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(favoriteActions.isLoading(true));
    dispatch(favoriteActions.error(null));
    try {
      const response = await fetchEstablishmentFavoriteAPI(company);
      dispatch(favoriteActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch(favoriteActions.success(null));
      } else {
        dispatch(favoriteActions.error(error));
        if (options && options.onError) options.onError(error);
      }
    }
    dispatch(favoriteActions.isLoading(false));
  };
}

export const fetchAllEstablishmentGroupActions = {
  isLoading: createAction('ESTABLISHMENT_GROUP/GET/IS_LOADING'),
  error: createAction('ESTABLISHMENT_GROUP/GET/ERROR'),
  success: createAction('ESTABLISHMENT_GROUP/GET/SUCCESS'),
};

export function fetchAllEstablishmentGroup(
  companyId?: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(fetchAllEstablishmentGroupActions.isLoading(true));
    dispatch(fetchAllEstablishmentGroupActions.error(null));
    try {
      const response = await fetchAllEstablishmentGroupAPI(companyId);
      dispatch(fetchAllEstablishmentGroupActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(favoriteActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(fetchAllEstablishmentGroupActions.isLoading(false));
  };
}

export const upsertEstablishmentGroupActions = {
  isLoading: createAction('ESTABLISHMENT_GROUP/UPSERT/IS_LOADING'),
  error: createAction('ESTABLISHMENT_GROUP/UPSERT/ERROR'),
  success: createAction('ESTABLISHMENT_GROUP/UPSERT/SUCCESS'),
};

export function upsertEstablishmentGroup(
  establishmentGroup: EstablishmentGroup,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertEstablishmentGroupActions.isLoading(true));
    dispatch(upsertEstablishmentGroupActions.error(null));
    const kind = establishmentGroup.id ? 'update' : 'create';
    try {
      const response = establishmentGroup.id
        ? await updateEstablishmentGroupAPI(establishmentGroup)
        : await createEstablishmentGroupAPI(establishmentGroup);

      dispatch(upsertEstablishmentGroupActions.success(response.data));
      dispatch(snackbarSuccess(`establishmentGroup.${kind}.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`establishmentGroup.${kind}.error`));
      dispatch(upsertEstablishmentGroupActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(upsertEstablishmentGroupActions.isLoading(false));
  };
}

export const deleteEstablishmentGroupActions = {
  isLoading: createAction('ESTABLISHMENT_GROUP/DELETE/IS_LOADING'),
  error: createAction('ESTABLISHMENT_GROUP/DELETE/ERROR'),
  success: createAction('ESTABLISHMENT_GROUP/DELETE/SUCCESS'),
};

export function deleteEstablishmentGroup(
  establishmentGroup: EstablishmentGroup,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteEstablishmentGroupActions.isLoading(true));
    dispatch(deleteEstablishmentGroupActions.error(null));
    try {
      await deleteEstablishmentGroupAPI(establishmentGroup.id);
      dispatch(deleteEstablishmentGroupActions.success(establishmentGroup));
      dispatch(snackbarSuccess(`establishmentGroup.delete.success`));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(snackbarError(`establishmentGroup.delete.error`));
      dispatch(deleteEstablishmentGroupActions.error(error.response.data));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteEstablishmentGroupActions.isLoading(false));
  };
}

export const fetchAllEstablishmentBillingGroupActions = {
  isLoading: createAction('ESTABLISHMENT_BILLING_GROUP/GET/IS_LOADING'),
  error: createAction('ESTABLISHMENT_BILLING_GROUP/GET/ERROR'),
  success: createAction('ESTABLISHMENT_BILLING_GROUP/GET/SUCCESS'),
};

export function fetchAllEstablishmentBillingGroup(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllEstablishmentBillingGroupActions.isLoading(true));
    dispatch(fetchAllEstablishmentBillingGroupActions.error(null));
    try {
      const response = await fetchAllEstablishmentBillingGroupAPI();
      dispatch(fetchAllEstablishmentBillingGroupActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(favoriteActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(fetchAllEstablishmentBillingGroupActions.isLoading(false));
  };
}

export const upsertEstablishmentBillingGroupActions = {
  isLoading: createAction('ESTABLISHMENT_BILLING_GROUP/UPSERT/IS_LOADING'),
  error: createAction('ESTABLISHMENT_BILLING_GROUP/UPSERT/ERROR'),
  success: createAction('ESTABLISHMENT_BILLING_GROUP/UPSERT/SUCCESS'),
};

export function upsertEstablishmentBillingGroup(
  establishmentBillingGroup: EstablishmentBillingGroup,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertEstablishmentBillingGroupActions.isLoading(true));
    dispatch(upsertEstablishmentBillingGroupActions.error(null));
    const kind = establishmentBillingGroup.id ? 'update' : 'create';
    try {
      const response = establishmentBillingGroup.id
        ? await updateEstablishmentBillingGroupAPI(establishmentBillingGroup)
        : await createEstablishmentBillingGroupAPI(establishmentBillingGroup);

      dispatch(upsertEstablishmentBillingGroupActions.success(response.data));
      dispatch(snackbarSuccess(`establishmentBillingGroup.${kind}.success`));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(snackbarError(`establishmentBillingGroup.${kind}.error`));
      dispatch(
        upsertEstablishmentBillingGroupActions.error(error.response.data),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(upsertEstablishmentBillingGroupActions.isLoading(false));
  };
}

export const deleteEstablishmentBillingGroupActions = {
  isLoading: createAction('ESTABLISHMENT_BILLING_GROUP/DELETE/IS_LOADING'),
  error: createAction('ESTABLISHMENT_BILLING_GROUP/DELETE/ERROR'),
  success: createAction('ESTABLISHMENT_BILLING_GROUP/DELETE/SUCCESS'),
};

export function deleteEstablishmentBillingGroup(
  establishmentBillingGroup: EstablishmentBillingGroup,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteEstablishmentBillingGroupActions.isLoading(true));
    dispatch(deleteEstablishmentBillingGroupActions.error(null));
    try {
      await deleteEstablishmentBillingGroupAPI(establishmentBillingGroup.id);
      dispatch(
        deleteEstablishmentBillingGroupActions.success(
          establishmentBillingGroup,
        ),
      );
      dispatch(snackbarSuccess(`establishmentBillingGroup.delete.success`));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(snackbarError(`establishmentBillingGroup.delete.error`));
      dispatch(
        deleteEstablishmentBillingGroupActions.error(error.response.data),
      );
      if (options && options.onError) options.onError();
    }
    dispatch(deleteEstablishmentBillingGroupActions.isLoading(false));
  };
}
