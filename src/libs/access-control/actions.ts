import type { AxiosResponse } from 'axios';
import { createAction } from 'redux-actions';

import { displayAccessControlSnackbar } from '#libs/snackbar/actions';

import {
  checkMemberInEstablishment as checkMemberInEstablishmentAPI,
  setMemberVisitEntryStatus as setMemberVisitEntryStatusAPI,
  refreshMemberVisitAccessStatus as refreshMemberVisitAccessStatusAPI,
  getMemberVisitList as getMemberVisitListAPI,
} from './api';

import type {
  ThunkAction,
  OptionCallback,
  PaginatedResponse,
} from '../../state/types';
import type { MemberVisitQueryParams, MemberVisitREST } from './types';
import { EntryStatus, FETCH_MEMBER_VISIT_PAGE_SIZE } from './constants';

export const globalMemberVisitActions = {
  clear: createAction('ACCESS_CONTROL/CLEAR_MEMBER_VISIT'),
};

export const checkMemberInEstablishmentActions = {
  success: createAction<AxiosResponse<MemberVisitREST>>(
    'ACCESS_CONTROL/CHECK_MEMBER_IN_ESTABLISHMENT/SUCCESS',
  ),
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
  }: {
    memberId: number;
    memberBarcode?: string;
    establishmentIds?: number[];
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
      dispatch(checkMemberInEstablishmentActions.success(response));
      const { data } = response;
      dispatch(
        displayAccessControlSnackbar(data.id, data.member, data.access_status),
      );
      options?.onSuccess?.(data);
    } catch (error) {
      dispatch(checkMemberInEstablishmentActions.error(error));
      options?.onError?.(error);
    }
    dispatch(checkMemberInEstablishmentActions.loading(false));
  };
};

export const setMemberVisitEntryStatusActions = {
  success: createAction<AxiosResponse<MemberVisitREST>>(
    'ACCESS_CONTROL/SET_MEMBER_VISIT_ENTRY_STATUS/SUCCESS',
  ),
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
      dispatch(setMemberVisitEntryStatusActions.success(response));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(setMemberVisitEntryStatusActions.error(error));
      options?.onError?.(error);
    }
    dispatch(setMemberVisitEntryStatusActions.loading(false));
  };
};

export const refreshMemberVisitAccessStatusActions = {
  success: createAction<AxiosResponse<MemberVisitREST>>(
    'ACCESS_CONTROL/REFRESH_MEMBER_VISIT_ACCESS_STATUS/SUCCESS',
  ),
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
      dispatch(refreshMemberVisitAccessStatusActions.success(response));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(refreshMemberVisitAccessStatusActions.error(error));
      options?.onError?.(error);
    }
    dispatch(refreshMemberVisitAccessStatusActions.loading(false));
  };
};

export const getMemberVisitListActions = {
  success: createAction<AxiosResponse<PaginatedResponse<MemberVisitREST>>>(
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
  return async (dispatch, getState) => {
    dispatch(getMemberVisitListActions.loading(true));
    dispatch(getMemberVisitListActions.error(null));

    const currentState = getState().accessControl.memberVisit;
    const nextPage = currentState.next_page ?? 1;

    // TODO: Fix member visit live list pagination
    dispatch(globalMemberVisitActions.clear());

    try {
      const response = await getMemberVisitListAPI({
        page: nextPage,
        ...params,
        page_size: FETCH_MEMBER_VISIT_PAGE_SIZE,
      });
      dispatch(getMemberVisitListActions.success(response));
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(getMemberVisitListActions.error(error));
      options?.onError?.(error);
    }
    dispatch(getMemberVisitListActions.loading(false));
  };
};
