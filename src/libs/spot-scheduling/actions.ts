// @ts-nocheck
import { createAction } from 'redux-actions';
import type { Dispatch, OptionCallback, ThunkAction } from '../../state/types';

import * as api from './api';
import { DeepPartial } from '../../utils/types';
import { RoomBlueprint, RoomBlueprintFilters } from './types';

export const roomBlueprintActions = {
  success: createAction('SPOTSCHEDULING/ROOMBLUEPRINT/SUCCESS'),
  list: createAction('SPOTSCHEDULING/ROOMBLUEPRINT/LIST'),
  isLoading: createAction('SPOTSCHEDULING/ROOMBLUEPRINT/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/ROOMBLUEPRINT/ERROR'),
  delete: createAction('SPOTSCHEDULING/ROOMBLUEPRINT/DELETE'),
};

export const assetForBlueprintActions = {
  success: createAction('SPOTSCHEDULING/ASSETBLUEPRINT/SUCCESS'),
  list: createAction('SPOTSCHEDULING/ASSETBLUEPRINT/LIST'),
  isLoading: createAction('SPOTSCHEDULING/ASSETBLUEPRINT/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/ASSETBLUEPRINT/ERROR'),
};

export const assetUnboundForBlueprintActions = {
  success: createAction('SPOTSCHEDULING/ASSETUNBOUNDBLUEPRINT/SUCCESS'),
  list: createAction('SPOTSCHEDULING/ASSETUNBOUNDBLUEPRINT/LIST'),
  isLoading: createAction('SPOTSCHEDULING/ASSETUNBOUNDBLUEPRINT/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/ASSETUNBOUNDBLUEPRINT/ERROR'),
  create: createAction('SPOTSCHEDULING/ASSETUNBOUNDBLUEPRINT/CREATE'),
};

export const createOrUpdateSpotForBlueprintActions = {
  success: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/CREATE/SUCCESS'),
  isLoading: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/CREATE/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/CREATE/ERROR'),
};

export const spotForBlueprintActions = {
  list: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/LIST'),
  isLoading: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/IS_LOADING'),
  error: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/ERROR'),
};

export const deleteSpotForBlueprintActions = {
  delete: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/DELETE/SUCCESS'),
  error: createAction('SPOTSCHEDULING/SPOTBLUEPRINT/DELETE/ERROR'),
};

export function fetchRoomBlueprints(
  data?: RoomBlueprintFilters,
  options?: OptionCallback<RoomBlueprint[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(roomBlueprintActions.isLoading(true));
    dispatch(roomBlueprintActions.error(null));
    try {
      const response = await api.fetchRoomBlueprints(data);
      dispatch(roomBlueprintActions.list(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(roomBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(roomBlueprintActions.isLoading(false));
  };
}

export function fetchRoomBlueprintDetail(
  id: number,
  options?: OptionCallback<RoomBlueprint>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(roomBlueprintActions.isLoading(true));
    dispatch(roomBlueprintActions.error(null));
    try {
      const response = await api.fetchRoomBlueprintDetail(id);
      dispatch(roomBlueprintActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(roomBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(roomBlueprintActions.isLoading(false));
  };
}

export function createRoomBlueprint(
  data: DeepPartial<RoomBlueprint>,
  options?: OptionCallback<RoomBlueprint>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(roomBlueprintActions.isLoading(true));
    dispatch(roomBlueprintActions.error(null));
    try {
      const response = await api.createRoomBlueprint(data);
      dispatch(roomBlueprintActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(roomBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(roomBlueprintActions.isLoading(false));
  };
}

export function updateRoomBlueprint(
  id: number,
  data: DeepPartial<RoomBlueprint> | FormData,
  options?: OptionCallback<RoomBlueprint>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(roomBlueprintActions.isLoading(true));
    dispatch(roomBlueprintActions.error(null));
    try {
      const response = await api.updateRoomBlueprint(id, data);
      dispatch(roomBlueprintActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(roomBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(roomBlueprintActions.isLoading(false));
  };
}

export function deleteRoomBlueprint(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(roomBlueprintActions.isLoading(true));
    dispatch(roomBlueprintActions.error(null));
    try {
      await api.deleteRoomBlueprint(id);
      dispatch(roomBlueprintActions.delete(id));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(roomBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(roomBlueprintActions.isLoading(false));
  };
}

export function fetchAssetForBlueprint(
  data: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(assetForBlueprintActions.isLoading(true));
    dispatch(assetForBlueprintActions.error(null));
    try {
      const response = await api.fetchAssetForBlueprint(data);
      dispatch(assetForBlueprintActions.list(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(assetForBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(assetForBlueprintActions.isLoading(false));
  };
}

export function fetchUnboundAssetForBlueprintPaginated(
  params: {
    is_unbound: boolean;
    blueprint: number;
  },
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch(assetUnboundForBlueprintActions.isLoading(true));
    dispatch(assetUnboundForBlueprintActions.error(null));
    try {
      if (!params?.blueprint) {
        throw new Error(
          'Not fetching UnboundAssetForBluePrint without blueprint id',
        );
      }
      const currentState =
        getState()?.spotScheduling?.assetUnboundForBlueprint.byBlueprintId?.[
          params?.blueprint
        ];

      const hasCurrentState = !!currentState;
      const nextPage = currentState?.next_page;
      if (hasCurrentState && !nextPage) {
        // Avoiding spaming when it's actually useless
        // Better to do nothing than allow a lot of api calls.
        return;
      }
      const response = await api.fetchAssetForBlueprint({
        ...params,
        is_unbound: true,
        page: nextPage ?? 1,
      });

      dispatch(
        assetUnboundForBlueprintActions.success({
          data: response.data,
          blueprintId: params.blueprint,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(assetUnboundForBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(assetUnboundForBlueprintActions.isLoading(false));
  };
}

export function createUnboundAssetForBlueprint(
  data: FormData,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    let response = null;
    dispatch(assetUnboundForBlueprintActions.isLoading(true));
    dispatch(assetUnboundForBlueprintActions.error(null));
    try {
      response = await api.createAssetForBlueprint(data);
      dispatch(assetUnboundForBlueprintActions.create(response.data));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(assetUnboundForBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(assetUnboundForBlueprintActions.isLoading(false));
    return response;
  };
}

export function createAssetForBlueprint(
  data: FormData,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    let response = null;
    dispatch(assetForBlueprintActions.isLoading(true));
    dispatch(assetForBlueprintActions.error(null));
    try {
      response = await api.createAssetForBlueprint(data);
      dispatch(assetForBlueprintActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(assetForBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(assetForBlueprintActions.isLoading(false));
    return response;
  };
}

export function createSpotForBlueprint(
  data: FormData,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    let response = null;
    dispatch(createOrUpdateSpotForBlueprintActions.isLoading(true));
    dispatch(createOrUpdateSpotForBlueprintActions.error(null));
    try {
      response = await api.createSpotForBlueprint(data);
      dispatch(createOrUpdateSpotForBlueprintActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
    } catch (error) {
      dispatch(createOrUpdateSpotForBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(createOrUpdateSpotForBlueprintActions.isLoading(false));
    return response;
  };
}

export function updateSpotForBlueprint(
  id: number,
  data: DeepPartial<RoomBlueprint> | FormData,
  options?: OptionCallback<RoomBlueprint>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateSpotForBlueprintActions.isLoading(true));
    dispatch(createOrUpdateSpotForBlueprintActions.error(null));
    try {
      const response = await api.updateSpotForBlueprint(id, data);
      dispatch(createOrUpdateSpotForBlueprintActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(createOrUpdateSpotForBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(createOrUpdateSpotForBlueprintActions.isLoading(false));
  };
}

export function fetchSpotForBlueprint(
  data: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(spotForBlueprintActions.isLoading(true));
    dispatch(spotForBlueprintActions.error(null));
    try {
      const response = await api.fetchSpotForBlueprint(data);
      dispatch(spotForBlueprintActions.list(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(spotForBlueprintActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(spotForBlueprintActions.isLoading(false));
  };
}

export function deleteSpotType(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    try {
      await api.deleteSpotType(id);
      dispatch(deleteSpotForBlueprintActions.delete(id));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(deleteSpotForBlueprintActions.error(err));
      if (options && options.onError) options.onError();
    }
  };
}
