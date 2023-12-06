import { createAction } from 'redux-actions';
import { snackbarError, snackbarSuccess } from '../../actions/snackbar.actions';
import {
  fetchZoomApp as fetchZoomAppAPI,
  updateZoomApp as updateZoomAppAPI,
  revokeZoomApp as revokeZoomAppAPI,
  toggleMultiZoomUserSupport as toggleMultiZoomUserSupportAPI,
  updateZoomGroupId as updateZoomGroupIdAPI,
  fetchZoomGroupMembers as fetchZoomGroupMembersAPI,
  listZoomEstablishments as listZoomEstablishmentsAPI,
  resetZoomEstablishments as resetZoomEstablishmentsAPI,
  bulkEditZoomEstablishments as bulkEditZoomEstablishmentsAPI,
} from './api';
import type {
  Dispatch,
  ThunkAction,
  OptionCallback,
  State,
} from '../../state/types';
import { UPSELL_IDENTIFIER_ZOOM_APP } from '#libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#libs/platform-billing/utils';
import { CUSTOM_ERROR_CODE } from '#libs/constants';
import type {
  ZoomApp,
  ZoomMember,
  ZoomEstablishment,
  ZoomEstablishmentBulkEditData,
} from '#libs/zoom-app/types';

export const zoomAppDetailAction = {
  success: createAction<ZoomApp>('ZOOM_APP/DETAIL/SUCCESS'),
  error: createAction<Error | null>('ZOOM_APP/DETAIL/ERROR'),
  loading: createAction<boolean>('ZOOM_APP/DETAIL/IS_LOADING'),
};

export function fetchZoomApp(
  companyId: number,
  options?: OptionCallback<ZoomApp>,
) {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(zoomAppDetailAction.error(null));
    dispatch(zoomAppDetailAction.loading(true));
    try {
      const featureList = getState().company.feature.data;
      const hasZoom = hasUpsell(featureList, UPSELL_IDENTIFIER_ZOOM_APP);
      if (!hasZoom) {
        dispatch(
          zoomAppDetailAction.success({
            id: null,
            company: companyId,
            zoom_user_id: '',
            is_disabled: true,
            is_configured: false,
            multi_zoom_user_support_enabled: false,
          }),
        );
      } else {
        const response = await fetchZoomAppAPI(companyId);
        dispatch(zoomAppDetailAction.success(response.data));
        options?.onSuccess?.(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(zoomAppDetailAction.error(error));
      options?.onError?.();
    }
    dispatch(zoomAppDetailAction.loading(false));
  };
}

export const zoomAppUpdateAction = {
  error: createAction<Error | null>('ZOOM_APP/UPDATE/ERROR'),
  loading: createAction<boolean>('ZOOM_APP/UPDATE/IS_LOADING'),
  success: createAction<ZoomApp>('ZOOM_APP/UPDATE/SUCCESS'),
};

export function updateZoomApp(
  companyId: number,
  data: any,
  options?: OptionCallback<ZoomApp>,
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
      console.error(error);
      dispatch(zoomAppUpdateAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(zoomAppUpdateAction.loading(false));
  };
}

export const revokeZoomAppActions = {
  error: createAction<Error | null>('ZOOM_APP/REVOKE/ERROR'),
  loading: createAction<boolean>('ZOOM_APP/REVOKE/IS_LOADING'),
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
      console.error(error);
      dispatch(revokeZoomAppActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(revokeZoomAppActions.loading(false));
  };
}

export const toggleMultiZoomUserSupport = (
  companyId: number,
  options?: OptionCallback<ZoomApp>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(zoomAppUpdateAction.error(null));
    dispatch(zoomAppUpdateAction.loading(true));
    try {
      const response = await toggleMultiZoomUserSupportAPI(companyId);
      dispatch(zoomAppUpdateAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(zoomAppUpdateAction.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(zoomAppUpdateAction.loading(false));
  };
};

export const updateZoomGroupId = (
  companyId: number,
  data: { zoom_group_id: string },
  options?: OptionCallback<ZoomApp>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(zoomAppUpdateAction.error(null));
    dispatch(zoomAppUpdateAction.loading(true));
    try {
      const response = await updateZoomGroupIdAPI(companyId, data);
      dispatch(zoomAppUpdateAction.success(response.data));
      dispatch(snackbarSuccess('zoom.setGroupId.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      if (
        error.response?.status === CUSTOM_ERROR_CODE &&
        error.response.data?.error_code === 'ZOOM RETRIEVE GROUP EXCEPTION'
      ) {
        dispatch(snackbarError('zoom.setGroupId.error'));
      } else {
        console.error(error);
        dispatch(zoomAppUpdateAction.error(error));
        if (options && options.onError) {
          options.onError(error);
        }
      }
    }
    dispatch(zoomAppUpdateAction.loading(false));
  };
};

export const ZoomGroupMemberActions = {
  error: createAction<Error | null>('ZOOM_APP/GROUP_MEMBERS/ERROR'),
  loading: createAction<boolean>('ZOOM_APP/GROUP_MEMBERS/IS_LOADING'),
  success: createAction<ZoomMember[]>('ZOOM_APP/GROUP_MEMBERS/SUCCESS'),
};

export const fetchZoomGroupMembers = (
  companyId: number,
  options?: OptionCallback<ZoomMember[]>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(ZoomGroupMemberActions.error(null));
    dispatch(ZoomGroupMemberActions.loading(true));
    try {
      const response = await fetchZoomGroupMembersAPI(companyId);
      dispatch(ZoomGroupMemberActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(ZoomGroupMemberActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(ZoomGroupMemberActions.loading(false));
  };
};

export const fetchZoomEstablishmentActions = {
  error: createAction<Error | null>('ZOOM_ESTABLISHMENT/LIST/ERROR'),
  loading: createAction<boolean>('ZOOM_ESTABLISHMENT/LIST/IS_LOADING'),
  success: createAction<ZoomEstablishment[]>('ZOOM_ESTABLISHMENT/LIST/SUCCESS'),
};

export const listZoomEstablishments = (
  options?: OptionCallback<ZoomEstablishment[]>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchZoomEstablishmentActions.error(null));
    dispatch(fetchZoomEstablishmentActions.loading(true));
    try {
      const response = await listZoomEstablishmentsAPI();
      dispatch(fetchZoomEstablishmentActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(fetchZoomEstablishmentActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(fetchZoomEstablishmentActions.loading(false));
  };
};

export const updateZoomEstablishmentActions = {
  error: createAction<Error | null>('ZOOM_ESTABLISHMENT/UPDATE/ERROR'),
  loading: createAction<boolean>('ZOOM_ESTABLISHMENT/UPDATE/IS_LOADING'),
  success: createAction<ZoomEstablishment[]>(
    'ZOOM_ESTABLISHMENT/UPDATE/SUCCESS',
  ),
  reset: createAction<void>('ZOOM_ESTABLISHMENT/UPDATE/RESET'),
};

export const resetZoomEstablishments = (
  options?: OptionCallback,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(updateZoomEstablishmentActions.error(null));
    dispatch(updateZoomEstablishmentActions.loading(true));
    try {
      await resetZoomEstablishmentsAPI();
      dispatch(updateZoomEstablishmentActions.reset());
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error(error);
      dispatch(updateZoomEstablishmentActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(updateZoomEstablishmentActions.loading(false));
  };
};

export const bulkEditZoomEstablishments = (
  data: ZoomEstablishmentBulkEditData,
  options?: OptionCallback<ZoomEstablishment[]>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(updateZoomEstablishmentActions.error(null));
    dispatch(updateZoomEstablishmentActions.loading(true));
    try {
      const response = await bulkEditZoomEstablishmentsAPI(data);
      dispatch(updateZoomEstablishmentActions.success(response.data));
      dispatch(snackbarSuccess('zoom.bulkEditZoomEstablishments.success'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error(error);
      dispatch(updateZoomEstablishmentActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }
    dispatch(updateZoomEstablishmentActions.loading(false));
  };
};
