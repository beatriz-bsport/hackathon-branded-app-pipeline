import { createAction } from 'redux-actions';

import {
  retrieveCadence as retrieveCadenceAPI,
  fetchCadenceList as fetchCadenceListAPI,
  createCadence as createCadenceAPI,
  updateCadence as updateCadenceAPI,
  archiveCadence as archiveCadenceAPI,
  restoreCadence as restoreCadenceAPI,
  duplicateCadence as duplicateCadenceAPI,
  activateCadence as activateCadenceAPI,
  shutOffCadence as shutOffCadenceAPI,
  setCadenceInitialConfiguration as setCadenceInitialConfigurationAPI,
  patchCadenceInitialConfiguration as patchCadenceInitialConfigurationAPI,
} from '#src/libs/sequential_marketing/api';
import {
  ERROR_CADENCE_FREE_TRIAL_QUOTA_REACHED,
  ERROR_CADENCE_NOT_INITIALIZED_FOR_DUPLICATION,
} from '#src/libs/sequential_marketing/constants';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import { isErrorWithCustomCode } from '#src/libs/utils';

import type {
  Cadence,
  CadenceQueryParams,
  CadenceInitialConfiguration,
} from '#src/libs/sequential_marketing/types';
import type {
  OptionCallback,
  Dispatch,
  OptionPaginatedCallback,
  PaginatedResponse,
} from '../../../state/types';

export const createCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/CREATE/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/CREATE/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/CREATE/SUCCESS'),
};

export function createCadence(
  data: { name: string; is_multiple_visit_allowed?: boolean },
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createCadenceActions.isLoading(true));
    dispatch(createCadenceActions.error(null));

    try {
      const response = await createCadenceAPI(data);
      dispatch(createCadenceActions.success(response.data));
      dispatch(snackbarSuccess('audience.create.success'));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createCadenceActions.error(err));
      dispatch(snackbarError('audience.create.error'));
      options?.onError?.();
    }

    dispatch(createCadenceActions.isLoading(false));
  };
}

export const updateCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/UPDATE/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/UPDATE/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/UPDATE/SUCCESS'),
};

export function updateCadence(
  id: number,
  data: {
    name?: string;
    priority_index?: number;
    is_multiple_visit_allowed?: boolean;
  },
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceActions.isLoading(true));
    dispatch(updateCadenceActions.error(null));

    try {
      const response = await updateCadenceAPI(id, data);
      dispatch(updateCadenceActions.success(response.data));
      dispatch(snackbarSuccess('audience.update.success'));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('audience.update.error'));
      dispatch(updateCadenceActions.error(err));
      options?.onError?.();
    }

    dispatch(updateCadenceActions.isLoading(false));
  };
}

export const archiveCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/ARCHIVE/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/ARCHIVE/ERROR'),
  success: createAction<{ id: number }>('CADENCE_WIP/ARCHIVE/SUCCESS'),
};

export function archiveCadence(id: number, options?: OptionCallback<number>) {
  return async (dispatch: Dispatch) => {
    dispatch(archiveCadenceActions.isLoading(true));
    dispatch(archiveCadenceActions.error(null));

    try {
      await archiveCadenceAPI(id);
      dispatch(archiveCadenceActions.success({ id }));
      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      dispatch(archiveCadenceActions.error(err));
      options?.onError?.();
    }

    dispatch(archiveCadenceActions.isLoading(false));
  };
}

export const restoreCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/RESTORE/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/RESTORE/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/RESTORE/SUCCESS'),
};

export function restoreCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(restoreCadenceActions.isLoading(true));
    dispatch(restoreCadenceActions.error(null));

    try {
      const response = await restoreCadenceAPI(id);
      dispatch(restoreCadenceActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(restoreCadenceActions.error(err));
      options?.onError?.();
    }

    dispatch(restoreCadenceActions.isLoading(false));
  };
}

export const duplicateCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/DUPLICATE/IS_LOADING'),
  error: createAction<Error | null>('CADENCE_WIP/DUPLICATE/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/DUPLICATE/SUCCESS'),
};

export function duplicateCadence(
  id: number,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(duplicateCadenceActions.isLoading(true));
    dispatch(duplicateCadenceActions.error(null));

    try {
      const response = await duplicateCadenceAPI(id);
      dispatch(duplicateCadenceActions.success(response.data));
      dispatch(snackbarSuccess('audience.duplicate.success'));
      options?.onSuccess?.(response.data);
    } catch (error: any) {
      dispatch(duplicateCadenceActions.error(error));
      if (
        error?.response?.data?.error_code ===
        ERROR_CADENCE_NOT_INITIALIZED_FOR_DUPLICATION
      ) {
        dispatch(snackbarError('audience.duplicate.uninitializedWorkflow'));
      } else {
        dispatch(snackbarError('audience.duplicate.error'));
      }
      options?.onError?.(error);
    }

    dispatch(duplicateCadenceActions.isLoading(false));
  };
}

export const activateCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/ACTIVATE/IS_LOADING'),
  error: createAction<Error | null>('CADENCE_WIP/ACTIVATE/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/ACTIVATE/SUCCESS'),
};

export function activateCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(activateCadenceActions.isLoading(true));
    dispatch(activateCadenceActions.error(null));

    try {
      const response = await activateCadenceAPI(id);
      dispatch(activateCadenceActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err: any) {
      const isFreeTrialQuotaReached =
        err &&
        'response' in err &&
        isErrorWithCustomCode(err) &&
        err?.response?.data?.error_code ===
          ERROR_CADENCE_FREE_TRIAL_QUOTA_REACHED;
      if (!isFreeTrialQuotaReached) {
        dispatch(activateCadenceActions.error(err));
      }

      console.error(err);
      options?.onError?.(err);
    }

    dispatch(activateCadenceActions.isLoading(false));
  };
}

export const shutOffCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/SHUT_OFF/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/SHUT_OFF/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/SHUT_OFF/SUCCESS'),
};

export function shutOffCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(shutOffCadenceActions.isLoading(true));
    dispatch(shutOffCadenceActions.error(null));

    try {
      const response = await shutOffCadenceAPI(id);
      dispatch(shutOffCadenceActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(shutOffCadenceActions.error(err));
      options?.onError?.();
    }

    dispatch(shutOffCadenceActions.isLoading(false));
  };
}

export const upsertCadenceInitialConfigurationActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/SETUP_CONFIG/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/SETUP_CONFIG/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/SETUP_CONFIG/SUCCESS'),
};

export function setCadenceInitialConfiguration(
  id: number,
  data: CadenceInitialConfiguration,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertCadenceInitialConfigurationActions.isLoading(true));
    dispatch(upsertCadenceInitialConfigurationActions.error(null));

    try {
      const response = await setCadenceInitialConfigurationAPI(id, data);
      dispatch(upsertCadenceInitialConfigurationActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(upsertCadenceInitialConfigurationActions.error(err));
      options?.onError?.();
    }

    dispatch(upsertCadenceInitialConfigurationActions.isLoading(false));
  };
}

export function updateCadenceInitialConfiguration(
  id: number,
  data: CadenceInitialConfiguration,
  options?: OptionCallback<Cadence>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertCadenceInitialConfigurationActions.isLoading(true));
    dispatch(upsertCadenceInitialConfigurationActions.error(null));

    try {
      const response = await patchCadenceInitialConfigurationAPI(id, data);
      dispatch(upsertCadenceInitialConfigurationActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(upsertCadenceInitialConfigurationActions.error(err));
      options?.onError?.();
    }

    dispatch(upsertCadenceInitialConfigurationActions.isLoading(false));
  };
}

export const retrieveCadenceActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/RETRIEVE/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/RETRIEVE/ERROR'),
  success: createAction<Cadence>('CADENCE_WIP/RETRIEVE/SUCCESS'),
};

export function retrieveCadence(id: number, options?: OptionCallback<Cadence>) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCadenceActions.isLoading(true));
    dispatch(retrieveCadenceActions.error(null));

    try {
      const response = await retrieveCadenceAPI(id);
      dispatch(retrieveCadenceActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveCadenceActions.error(err));
      options?.onError?.();
    }

    dispatch(retrieveCadenceActions.isLoading(false));
  };
}

export const fetchCadenceListActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/LIST/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/LIST/ERROR'),
  success: createAction<PaginatedResponse<Cadence>>('CADENCE_WIP/LIST/SUCCESS'),
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
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCadenceListActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchCadenceListActions.isLoading(false));
  };
}
