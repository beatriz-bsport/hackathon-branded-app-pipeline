import { createAction } from 'redux-actions';
import {
  OptionCallback,
  Dispatch,
  OptionPaginatedCallback,
  PaginatedResponse,
} from '../../../state/types';

import {
  retrieveCadence as retrieveCadenceAPI,
  fetchCadenceList as fetchCadenceListAPI,
  createCadence as createCadenceAPI,
  updateCadence as updateCadenceAPI,
  archiveCadence as archiveCadenceAPI,
  restoreCadence as restoreCadenceAPI,
  activateCadence as activateCadenceAPI,
  shutOffCadence as shutOffCadenceAPI,
  setInitialCadenceConfiguration as setInitialCadenceConfigurationAPI,
  patchInitialCadenceConfiguration as patchInitialCadenceConfigurationAPI,
} from '#libs/sequential_marketing/api';

import type {
  Cadence,
  CadenceQueryParams,
} from '#libs/sequential_marketing/types';

import { snackbarError, snackbarSuccess } from '#libs/snackbar/actions';

import type { FormValues } from '#libs/sequential_marketingDEPRECATED/serializers/types';

export const createCadenceActions = {
  isLoading: createAction<boolean>('CADENCE/CREATE/IS_LOADING'),
  error: createAction<Error>('CADENCE/CREATE/ERROR'),
  success: createAction<Cadence>('CADENCE/CREATE/SUCCESS'),
};

export function createCadence(
  data: { name: string },
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCadenceActions.isLoading(true));
    dispatch(createCadenceActions.error(null));

    try {
      const response = await createCadenceAPI(data);
      dispatch(createCadenceActions.success(response.data));
      dispatch(snackbarSuccess('cadence.create.success'));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createCadenceActions.error(err));
      dispatch(snackbarError('cadence.create.error'));
      options && options.onError && options.onError();
    }

    dispatch(createCadenceActions.isLoading(false));
  };
}

export const updateCadenceActions = {
  isLoading: createAction<boolean>('CADENCE/UPDATE/IS_LOADING'),
  error: createAction<Error>('CADENCE/UPDATE/ERROR'),
  success: createAction<Cadence>('CADENCE/UPDATE/SUCCESS'),
};

export function updateCadence(
  id: number,
  data: { name?: string; priority_index?: number },
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceActions.isLoading(true));
    dispatch(updateCadenceActions.error(null));

    try {
      const response = await updateCadenceAPI(id, data);
      dispatch(updateCadenceActions.success(response.data));
      dispatch(snackbarSuccess('cadence.update.success'));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('cadence.update.error'));
      dispatch(updateCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(updateCadenceActions.isLoading(false));
  };
}

export const archiveCadenceActions = {
  isLoading: createAction<boolean>('CADENCE/ARCHIVE/IS_LOADING'),
  error: createAction<Error>('CADENCE/ARCHIVE/ERROR'),
  success: createAction<{ id: number }>('CADENCE/ARCHIVE/SUCCESS'),
};

export function archiveCadence(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(archiveCadenceActions.isLoading(true));
    dispatch(archiveCadenceActions.error(null));

    try {
      await archiveCadenceAPI(id);
      dispatch(archiveCadenceActions.success({ id }));
      options && options.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(archiveCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(archiveCadenceActions.isLoading(false));
  };
}

export const restoreCadenceActions = {
  isLoading: createAction<boolean>('CADENCE/RESTORE/IS_LOADING'),
  error: createAction<Error>('CADENCE/RESTORE/ERROR'),
  success: createAction<Cadence>('CADENCE/RESTORE/SUCCESS'),
};

export function restoreCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreCadenceActions.isLoading(true));
    dispatch(restoreCadenceActions.error(null));

    try {
      const response = await restoreCadenceAPI(id);
      dispatch(restoreCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(restoreCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(restoreCadenceActions.isLoading(false));
  };
}

export const activateCadenceActions = {
  isLoading: createAction<boolean>('CADENCE/ACTIVATE/IS_LOADING'),
  error: createAction<Error>('CADENCE/ACTIVATE/ERROR'),
  success: createAction<Cadence>('CADENCE/ACTIVATE/SUCCESS'),
};

export function activateCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(activateCadenceActions.isLoading(true));
    dispatch(activateCadenceActions.error(null));

    try {
      const response = await activateCadenceAPI(id);
      dispatch(activateCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(activateCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(activateCadenceActions.isLoading(false));
  };
}

export const shutOffCadenceActions = {
  isLoading: createAction<boolean>('CADENCE/SHUT_OFF/IS_LOADING'),
  error: createAction<Error>('CADENCE/SHUT_OFF/ERROR'),
  success: createAction<Cadence>('CADENCE/SHUT_OFF/SUCCESS'),
};

export function shutOffCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(shutOffCadenceActions.isLoading(true));
    dispatch(shutOffCadenceActions.error(null));

    try {
      const response = await shutOffCadenceAPI(id);
      dispatch(shutOffCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(shutOffCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(shutOffCadenceActions.isLoading(false));
  };
}

export const upsertInitialCadenceConfigurationActions = {
  isLoading: createAction<boolean>('CADENCE/SETUP_CONFIG/IS_LOADING'),
  error: createAction<Error>('CADENCE/SETUP_CONFIG/ERROR'),
  success: createAction<Cadence>('CADENCE/SETUP_CONFIG/SUCCESS'),
};

export function setInitialCadenceConfiguration(
  id: number,
  data: FormValues,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertInitialCadenceConfigurationActions.isLoading(true));
    dispatch(upsertInitialCadenceConfigurationActions.error(null));

    try {
      const response = await setInitialCadenceConfigurationAPI(id, data);
      dispatch(upsertInitialCadenceConfigurationActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(upsertInitialCadenceConfigurationActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(upsertInitialCadenceConfigurationActions.isLoading(false));
  };
}

export function updateInitialCadenceConfiguration(
  id: number,
  data: FormValues,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertInitialCadenceConfigurationActions.isLoading(true));
    dispatch(upsertInitialCadenceConfigurationActions.error(null));

    try {
      const response = await patchInitialCadenceConfigurationAPI(id, data);
      dispatch(upsertInitialCadenceConfigurationActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(upsertInitialCadenceConfigurationActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(upsertInitialCadenceConfigurationActions.isLoading(false));
  };
}

export const retrieveCadenceActions = {
  isLoading: createAction<boolean>('CADENCE/RETRIEVE/IS_LOADING'),
  error: createAction<Error>('CADENCE/RETRIEVE/ERROR'),
  success: createAction<Cadence>('CADENCE/RETRIEVE/SUCCESS'),
};

export function retrieveCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCadenceActions.isLoading(true));
    dispatch(retrieveCadenceActions.error(null));

    try {
      const response = await retrieveCadenceAPI(id);
      dispatch(retrieveCadenceActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveCadenceActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(retrieveCadenceActions.isLoading(false));
  };
}

export const fetchCadenceListActions = {
  isLoading: createAction<boolean>('CADENCE/LIST/IS_LOADING'),
  error: createAction<Error>('CADENCE/LIST/ERROR'),
  success: createAction<PaginatedResponse<Cadence>>('CADENCE/LIST/SUCCESS'),
};

export function fetchCadenceList(
  params?: CadenceQueryParams,
  options?: OptionPaginatedCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCadenceListActions.isLoading(true));
    dispatch(fetchCadenceListActions.error(null));

    try {
      const response = await fetchCadenceListAPI(params);
      dispatch(fetchCadenceListActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCadenceListActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(fetchCadenceListActions.isLoading(false));
  };
}
