import type { AxiosResponse } from 'axios';
import { createAction } from 'redux-actions';

import { displayAccessControlSnackbar } from '#libs/snackbar/actions';

import {
  approveUserPhotoUpdate as approvePhotoUpdateAPI,
  checkMemberInEstablishment as checkMemberInEstablishmentAPI,
  getAccessControlPolicy as getAccessControlPolicyAPI,
  getMemberVisitList as getMemberVisitListAPI,
  getUserPhotoUpdates as getUserPhotoUpdatesAPI,
  patchAccessControlPolicy as patchAccessControlPolicyAPI,
  refreshMemberVisitAccessStatus as refreshMemberVisitAccessStatusAPI,
  retrieveMemberNextBookingOrPrivateBooking as retrieveMemberNextBookingOrPrivateBookingAPI,
  retrieveMemberVisit as retrieveMemberVisitAPI,
  setMemberVisitEntryStatus as setMemberVisitEntryStatusAPI,
} from './api';

import type {
  ThunkAction,
  OptionCallback,
  PaginatedResponse,
} from '../../state/types';
import type {
  AccessControlBookingOrPrivateBooking,
  AccessControlPolicy,
  MemberVisitQueryParams,
  MemberVisitREST,
  UserPhotoUpdate,
} from './types';
import {
  EntryStatus,
  FETCH_MEMBER_VISIT_PAGE_SIZE,
  MAX_PHOTOS_IN_HISTORY,
} from './constants';

export const globalMemberVisitActions = {
  update: createAction<MemberVisitREST>('ACCESS_CONTROL/MEMBER_VISIT/UPDATE'),
  create: createAction<MemberVisitREST>('ACCESS_CONTROL/MEMBER_VISIT/CREATE'),
};

export const checkMemberInEstablishmentActions = {
  loading: createAction<boolean>(
    'ACCESS_CONTROL/CHECK_MEMBER_IN_ESTABLISHMENT/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/CHECK_MEMBER_IN_ESTABLISHMENT/ERROR',
  ),
};

/**
 * `checkMemberInEstablishment` is a Redux thunk action that checks-in a member in an establishment.
 *
 * @function
 * @param {number} params.memberId - The ID of the member.
 * @param {string} params.memberBarcode - The barcode of the member.
 * @param {number} params.establishmentId - The ID of the establishment.
 * @param {OptionCallback<MemberVisitREST>} options - Optional callbacks for success and error cases.
 * @returns {ThunkAction} A Redux thunk action.
 *
 * This function dispatches the loading action, makes an API call to check-in the member in the establishment,
 * and then dispatches either the success or error action based on the result.
 * It also calls the provided callbacks in case of success or error.
 */
export const checkMemberInEstablishment = (
  {
    memberId,
    memberBarcode,
    establishmentIds,
    displaySnackbar = true,
  }: {
    memberId: number;
    memberBarcode?: string;
    establishmentIds?: number[];
    displaySnackbar?: boolean;
  },
  options?: OptionCallback<MemberVisitREST>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(checkMemberInEstablishmentActions.loading(true));
    dispatch(checkMemberInEstablishmentActions.error(null));
    try {
      const response = await checkMemberInEstablishmentAPI({
        memberId,
        memberBarcode,
        establishmentIds,
      });
      const { data } = response;
      dispatch(globalMemberVisitActions.create(data));
      if (displaySnackbar) {
        dispatch(
          displayAccessControlSnackbar(
            data.id,
            data.member,
            data.access_status,
          ),
        );
      }
      options?.onSuccess?.(data);
    } catch (error) {
      dispatch(checkMemberInEstablishmentActions.error(error));
      options?.onError?.(error);
    }
    dispatch(checkMemberInEstablishmentActions.loading(false));
  };
};

export const setMemberVisitEntryStatusActions = {
  loading: createAction<boolean>(
    'ACCESS_CONTROL/SET_MEMBER_VISIT_ENTRY_STATUS/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/SET_MEMBER_VISIT_ENTRY_STATUS/ERROR',
  ),
};

export const setMemberVisitEntryStatus = (
  memberVisitId: number,
  entryStatus: EntryStatus,
  options?: OptionCallback<MemberVisitREST>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(setMemberVisitEntryStatusActions.loading(true));
    dispatch(setMemberVisitEntryStatusActions.error(null));
    try {
      const response = await setMemberVisitEntryStatusAPI(
        memberVisitId,
        entryStatus,
      );
      dispatch(globalMemberVisitActions.update(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(setMemberVisitEntryStatusActions.error(error));
      options?.onError?.(error);
    }
    dispatch(setMemberVisitEntryStatusActions.loading(false));
  };
};

export const refreshMemberVisitAccessStatusActions = {
  loading: createAction<boolean>(
    'ACCESS_CONTROL/REFRESH_MEMBER_VISIT_ACCESS_STATUS/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/REFRESH_MEMBER_VISIT_ACCESS_STATUS/ERROR',
  ),
};

export const refreshMemberVisitAccessStatus = (
  memberVisitId: number,
  options?: OptionCallback<MemberVisitREST>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(refreshMemberVisitAccessStatusActions.loading(true));
    dispatch(refreshMemberVisitAccessStatusActions.error(null));
    try {
      const response = await refreshMemberVisitAccessStatusAPI(memberVisitId);
      dispatch(globalMemberVisitActions.update(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(refreshMemberVisitAccessStatusActions.error(error));
      options?.onError?.(error);
    }
    dispatch(refreshMemberVisitAccessStatusActions.loading(false));
  };
};

export const getMemberVisitListActions = {
  success: createAction<PaginatedResponse<MemberVisitREST>>(
    'ACCESS_CONTROL/FETCH_MEMBER_VISIT/SUCCESS',
  ),
  loading: createAction<boolean>('ACCESS_CONTROL/FETCH_MEMBER_VISIT/LOADING'),
  error: createAction<Error | null>('ACCESS_CONTROL/FETCH_MEMBER_VISIT/ERROR'),
};

/**
 * Fetch the list of member visits.
 *
 * The backend always filter the member visits by the user's company
 */
export const getMemberVisitList = (
  params: Omit<MemberVisitQueryParams, 'page_size'>,
  options?: OptionCallback<MemberVisitREST[]>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(getMemberVisitListActions.loading(true));
    dispatch(getMemberVisitListActions.error(null));

    try {
      const response = await getMemberVisitListAPI({
        ...params,
        page_size: FETCH_MEMBER_VISIT_PAGE_SIZE,
      });
      dispatch(getMemberVisitListActions.success(response.data));
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(getMemberVisitListActions.error(error));
      options?.onError?.(error);
    }
    dispatch(getMemberVisitListActions.loading(false));
  };
};

export const retrieveMemberVisitActions = {
  loading: createAction<boolean>(
    'ACCESS_CONTROL/RETRIEVE_MEMBER_VISIT/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/RETRIEVE_MEMBER_VISIT/ERROR',
  ),
};

export const retrieveMemberVisit = (
  memberVisitId: number,
  options?: OptionCallback<MemberVisitREST>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(retrieveMemberVisitActions.loading(true));
    dispatch(retrieveMemberVisitActions.error(null));
    try {
      const response = await retrieveMemberVisitAPI(memberVisitId);
      dispatch(globalMemberVisitActions.update(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(retrieveMemberVisitActions.error(error));
      options?.onError?.(error);
    }
    dispatch(retrieveMemberVisitActions.loading(false));
  };
};

export const getAccessControlPolicyActions = {
  success: createAction<AxiosResponse<AccessControlPolicy>>(
    'ACCESS_CONTROL/GET_ACCESS_CONTROL_POLICY/SUCCESS',
  ),
  loading: createAction<boolean>(
    'ACCESS_CONTROL/GET_ACCESS_CONTROL_POLICY/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/GET_ACCESS_CONTROL_POLICY/ERROR',
  ),
};

export const getAccessControlPolicy = (
  companyId: number,
  options?: OptionCallback<AccessControlPolicy>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(getAccessControlPolicyActions.loading(true));
    dispatch(getAccessControlPolicyActions.error(null));
    try {
      const response = await getAccessControlPolicyAPI(companyId);
      dispatch(getAccessControlPolicyActions.success(response));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(getAccessControlPolicyActions.error(error));
      options?.onError?.(error);
    }
    dispatch(getAccessControlPolicyActions.loading(false));
  };
};

export const patchAccessControlPolicyActions = {
  success: createAction<AxiosResponse<AccessControlPolicy>>(
    'ACCESS_CONTROL/PATCH_ACCESS_CONTROL_POLICY/SUCCESS',
  ),
  loading: createAction<boolean>(
    'ACCESS_CONTROL/PATCH_ACCESS_CONTROL_POLICY/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/PATCH_ACCESS_CONTROL_POLICY/ERROR',
  ),
};

export const patchAccessControlPolicy = (
  companyId: number,
  data: AccessControlPolicy,
  options?: OptionCallback<AccessControlPolicy>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(patchAccessControlPolicyActions.loading(true));
    dispatch(patchAccessControlPolicyActions.error(null));
    try {
      const response = await patchAccessControlPolicyAPI(companyId, data);
      dispatch(patchAccessControlPolicyActions.success(response));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(patchAccessControlPolicyActions.error(error));
      options?.onError?.(error);
    }
    dispatch(patchAccessControlPolicyActions.loading(false));
  };
};

export const retrieveMemberNextBookingOrPrivateBookingActions = {
  success: createAction<AxiosResponse<AccessControlBookingOrPrivateBooking>>(
    'ACCESS_CONTROL/GET_MEMBER_NEXT_BOOKING_OR_PRIVATE_BOOKING/SUCCESS',
  ),
  loading: createAction<boolean>(
    'ACCESS_CONTROL/GET_MEMBER_NEXT_BOOKING_OR_PRIVATE_BOOKING/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/GET_MEMBER_NEXT_BOOKING_OR_PRIVATE_BOOKING/ERROR',
  ),
};

export const retrieveMemberNextBookingOrPrivateBooking = (
  memberId: number,
  options?: OptionCallback<AccessControlBookingOrPrivateBooking>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(retrieveMemberNextBookingOrPrivateBookingActions.loading(true));
    dispatch(retrieveMemberNextBookingOrPrivateBookingActions.error(null));
    try {
      const response = await retrieveMemberNextBookingOrPrivateBookingAPI(
        memberId,
      );
      dispatch(
        retrieveMemberNextBookingOrPrivateBookingActions.success(response),
      );
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(retrieveMemberNextBookingOrPrivateBookingActions.error(error));
      options?.onError?.(error);
    }
    dispatch(retrieveMemberNextBookingOrPrivateBookingActions.loading(false));
  };
};

export const getUserPhotoUpdatesActions = {
  success: createAction<PaginatedResponse<UserPhotoUpdate>>(
    'ACCESS_CONTROL/GET_USER_PHOTO_UPDATE/SUCCESS',
  ),
  loading: createAction<boolean>(
    'ACCESS_CONTROL/GET_USER_PHOTO_UPDATE/LOADING',
  ),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/GET_USER_PHOTO_UPDATE/ERROR',
  ),
};

export const getUserPhotoUpdates = (
  memberId: number,
  options?: OptionCallback<PaginatedResponse<UserPhotoUpdate>>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(getUserPhotoUpdatesActions.loading(true));
    dispatch(getUserPhotoUpdatesActions.error(null));
    try {
      const response = await getUserPhotoUpdatesAPI({
        member: memberId,
        page_size: MAX_PHOTOS_IN_HISTORY,
      });
      dispatch(getUserPhotoUpdatesActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(getUserPhotoUpdatesActions.error(error));
      options?.onError?.(error);
    }
    dispatch(getUserPhotoUpdatesActions.loading(false));
  };
};

export const approvePhotoUpdateActions = {
  success: createAction<AxiosResponse<UserPhotoUpdate>>(
    'ACCESS_CONTROL/APPROVE_PHOTO_UPDATE/SUCCESS',
  ),
  loading: createAction<boolean>('ACCESS_CONTROL/APPROVE_PHOTO_UPDATE/LOADING'),
  error: createAction<Error | null>(
    'ACCESS_CONTROL/APPROVE_PHOTO_UPDATE/ERROR',
  ),
};

export const approvePhotoUpdate = (
  userPhotoUpdateUuid: string,
  options?: OptionCallback<UserPhotoUpdate>,
): ThunkAction => {
  return async (dispatch) => {
    dispatch(approvePhotoUpdateActions.loading(true));
    dispatch(approvePhotoUpdateActions.error(null));
    try {
      const response = await approvePhotoUpdateAPI(userPhotoUpdateUuid);
      dispatch(approvePhotoUpdateActions.success(response));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(approvePhotoUpdateActions.error(error));
      options?.onError?.(error);
    }
    dispatch(approvePhotoUpdateActions.loading(false));
  };
};
