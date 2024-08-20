import { createAction } from 'redux-actions';

import { snackbarSuccess, snackbarError } from '#src/libs/snackbar/actions';

import {
  getGymAvailability as getGymAvailabilityAPI,
  createWellhubGym as createWellhubGymAPI,
  fetchWellhubGyms as fetchWellhubGymsAPI,
  getWellhubGym as getWellhubGymAPI,
  updateWellhubGym as updateWellhubGymAPI,
  deleteWellhubGym as deleteWellhubGymAPI,
  configureWellhubGymWebhooks as configureWellhubGymWebhooksAPI,
} from '#src/libs/wellhub/api';

import type {
  OptionCallback,
  Dispatch,
  PaginatedResponse,
} from '#src/state/types';

import type {
  GymAvailabilityResponse,
  WellhubGym,
  WellhubGymUpsert,
} from '#src/libs/wellhub/types';

export const getGymAvailabilityActions = {
  isLoading: createAction<boolean>('WELLHUB_GYM/CHECK_AVAILABILITY/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB_GYM/CHECK_AVAILABILITY/ERROR'),
  success: createAction<GymAvailabilityResponse>(
    'WELLHUB_GYM/CHECK_AVAILABILITY/SUCCESS',
  ),
};

export function getGymAvailability(
  gymId: number,
  options?: OptionCallback<GymAvailabilityResponse>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getGymAvailabilityActions.isLoading(true));
    dispatch(getGymAvailabilityActions.error(null));

    try {
      const response = await getGymAvailabilityAPI({ gym_id: gymId });
      dispatch(getGymAvailabilityActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(getGymAvailabilityActions.error(err));
      options?.onError?.();
    }

    dispatch(getGymAvailabilityActions.isLoading(false));
  };
}

export const createWellhubGymActions = {
  isLoading: createAction<boolean>('WELLHUB_GYM/CREATE/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB_GYM/CREATE/ERROR'),
  success: createAction<WellhubGymUpsert>('WELLHUB_GYM/CREATE/SUCCESS'),
};

export function createWellhubGym(
  gymId: number,
  establishmentIds: number[],
  options?: OptionCallback<WellhubGymUpsert>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createWellhubGymActions.isLoading(true));
    dispatch(createWellhubGymActions.error(null));

    try {
      const response = await createWellhubGymAPI({
        gym_id: gymId,
        establishments: establishmentIds,
      });
      dispatch(createWellhubGymActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(createWellhubGymActions.error(err));
      options?.onError?.();
    }

    dispatch(createWellhubGymActions.isLoading(false));
  };
}

export const fetchWellhubGymsActions = {
  isLoading: createAction<boolean>('WELLHUB_GYM/LIST/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB_GYM/LIST/ERROR'),
  success: createAction<PaginatedResponse<WellhubGym>>(
    'WELLHUB_GYM/LIST/SUCCESS',
  ),
};

export function fetchWellhubGyms(
  options?: OptionCallback<PaginatedResponse<WellhubGym>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchWellhubGymsActions.isLoading(true));
    dispatch(fetchWellhubGymsActions.error(null));

    try {
      const response = await fetchWellhubGymsAPI();
      dispatch(fetchWellhubGymsActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchWellhubGymsActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchWellhubGymsActions.isLoading(false));
  };
}

export const getWellhubGymActions = {
  isLoading: createAction<boolean>('WELLHUB_GYM/GET/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB_GYM/GET/ERROR'),
  success: createAction<WellhubGym>('WELLHUB_GYM/GET/SUCCESS'),
};

export function getWellhubGym(
  wellhubGymUuid: string,
  options?: OptionCallback<WellhubGym>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(getWellhubGymActions.isLoading(true));
    dispatch(getWellhubGymActions.error(null));

    try {
      const response = await getWellhubGymAPI(wellhubGymUuid);
      dispatch(getWellhubGymActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(getWellhubGymActions.error(err));
      options?.onError?.();
    }

    dispatch(getWellhubGymActions.isLoading(false));
  };
}

export const updateWellhubGymActions = {
  isLoading: createAction<boolean>('WELLHUB_GYM/UPDATE/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB_GYM/UPDATE/ERROR'),
  success: createAction<WellhubGymUpsert>('WELLHUB_GYM/UPDATE/SUCCESS'),
};

export function updateWellhubGym(
  wellhubGymUUID: string,
  wellhubGymID: number,
  establishmentIds: number[],
  options?: OptionCallback<WellhubGymUpsert>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateWellhubGymActions.isLoading(true));
    dispatch(updateWellhubGymActions.error(null));

    try {
      const response = await updateWellhubGymAPI(wellhubGymUUID, {
        gym_id: wellhubGymID,
        establishments: establishmentIds,
        disabled: false,
      });
      dispatch(updateWellhubGymActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateWellhubGymActions.error(err));
      options?.onError?.();
    }

    dispatch(updateWellhubGymActions.isLoading(false));
  };
}

export const deleteWellhubGymActions = {
  isLoading: createAction<boolean>('WELLHUB_GYM/DELETE/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB_GYM/DELETE/ERROR'),
  success: createAction<{ uuid: string }>('WELLHUB_GYM/DELETE/SUCCESS'),
};

export function deleteWellhubGym(
  wellhubGymUuid: string,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteWellhubGymActions.isLoading(true));
    dispatch(deleteWellhubGymActions.error(null));

    try {
      await deleteWellhubGymAPI(wellhubGymUuid);
      dispatch(deleteWellhubGymActions.success({ uuid: wellhubGymUuid }));
      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      dispatch(deleteWellhubGymActions.error(err));
      options?.onError?.();
    }

    dispatch(deleteWellhubGymActions.isLoading(false));
  };
}

export const configureWellhubGymWebhooksActions = {
  isLoading: createAction<boolean>('WELLHUB_GYM/CONFIGURE_WEBHOOKS/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB_GYM/CONFIGURE_WEBHOOKS/ERROR'),
  success: createAction<WellhubGym>('WELLHUB_GYM/CONFIGURE_WEBHOOKS/SUCCESS'),
};

export function configureWellhubGymWebhooks(
  wellhubGymUuid: string,
  options?: OptionCallback<WellhubGym>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(configureWellhubGymWebhooksActions.isLoading(true));
    dispatch(configureWellhubGymWebhooksActions.error(null));

    try {
      const response = await configureWellhubGymWebhooksAPI(wellhubGymUuid);
      dispatch(configureWellhubGymWebhooksActions.success(response.data));
      options?.onSuccess?.(response.data);
      dispatch(snackbarSuccess('wellhub.configureWebhooks.success'));
    } catch (err) {
      console.error(err);
      dispatch(configureWellhubGymWebhooksActions.error(err));
      options?.onError?.();
      dispatch(snackbarError('wellhub.configureWebhooks.error'));
    }

    dispatch(configureWellhubGymWebhooksActions.isLoading(false));
  };
}
