// @flow

import { createAction } from 'redux-actions';
import {
  fetchZoomApp as fetchZoomAppAPI,
  updateZoomApp as updateZoomAppAPI,
  revokeZoomApp as revokeZoomAppAPI,
} from './api';
import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

export const zoomAppDetailAction = {
  success: createAction('ZOOM_APP/DETAIL/SUCCESS'),
  error: createAction('ZOOM_APP/DETAIL/ERROR'),
  loading: createAction('ZOOM_APP/DETAIL/IS_LOADING'),
};

export function fetchZoomApp(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(zoomAppDetailAction.error(null));
    dispatch(zoomAppDetailAction.loading(true));
    try {
      const response = await fetchZoomAppAPI(companyId);
      dispatch(zoomAppDetailAction.success(response.data));
    } catch (error) {
      dispatch(zoomAppDetailAction.error(error));
    }
    dispatch(zoomAppDetailAction.loading(false));
  };
}

export const zoomAppUpdateAction = {
  error: createAction('ZOOM_APP/UPDATE/ERROR'),
  loading: createAction('ZOOM_APP/UPDATE/IS_LOADING'),
};

export function updateZoomApp(
  companyId: number,
  data: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(zoomAppUpdateAction.error(null));
    dispatch(zoomAppUpdateAction.loading(true));
    try {
      const response = await updateZoomAppAPI(companyId, data);
      dispatch(zoomAppDetailAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(zoomAppUpdateAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(zoomAppUpdateAction.loading(false));
  };
}

export const revokeZoomAppActions = {
  error: createAction('ZOOM_APP/REVOKE/ERROR'),
  loading: createAction('ZOOM_APP/REVOKE/IS_LOADING'),
  success: createAction('ZOOM_APP/REVOKE/SUCCESS'),
};

export function revokeZoomApp(
  company_id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(revokeZoomAppActions.error(null));
    dispatch(revokeZoomAppActions.loading(true));
    try {
      const response = await revokeZoomAppAPI(company_id);
      dispatch(revokeZoomAppActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(revokeZoomAppActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(revokeZoomAppActions.loading(false));
  };
}
