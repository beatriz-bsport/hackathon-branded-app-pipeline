import { createAction } from 'redux-actions';
import type { Dispatch, OptionCallback, ThunkAction } from '../../state/types';

import * as api from './api';
import { DeepPartial } from '../../utils/types';
import { RoomBlueprint } from './types';

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

export function fetchRoomBlueprints(
  data?: any,
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
