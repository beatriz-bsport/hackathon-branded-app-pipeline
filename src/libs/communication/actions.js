// @flow

import { createAction } from 'redux-actions';
import {
  sendMailToMembers as sendMailToMembersAPI,
  fetchContactList as fetchContactListAPI,
} from './api';

import type { Dispatch, ThunkAction } from '../../state/types';
import type { MemberMailData } from './types';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

export const membersMailAction = {
  error: createAction('MEMBERS/SEND-MAIL/ERROR'),
  isloading: createAction('MEMBERS/SEND-MAIL/IS_LOADING'),
};

export function mailMembers(data: MemberMailData): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(membersMailAction.isloading(true));
    dispatch(membersMailAction.error(null));
    try {
      await sendMailToMembersAPI(data);
      dispatch(snackbarSuccess('communication:mail.success'));
    } catch (error) {
      dispatch(membersMailAction.error(error));
      dispatch(snackbarError('communication:mail.error'));
    }
    dispatch(membersMailAction.isloading(false));
  };
}

export const contactListActions = {
  error: createAction('CONTACT/LIST/ERROR'),
  isLoading: createAction('CONTACT/LIST/LOADING'),
  success: createAction('CONTACT/LIST/SUCCESS'),
};

export function fetchContactList(params: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(contactListActions.isLoading(true));
    dispatch(contactListActions.error(null));
    try {
      const response = await fetchContactListAPI(params);
      dispatch(contactListActions.success(response.data));
    } catch (error) {
      dispatch(contactListActions.error(error));
      console.error(error);
    }
    dispatch(contactListActions.isLoading(false));
  };
}
