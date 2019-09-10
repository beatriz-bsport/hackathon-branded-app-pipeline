// @flow

import { createAction } from 'redux-actions';
import { sendMailToMembers } from './api';

import type { Dispatch, ThunkAction } from '../../state/types';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

export const membersMailAction = {
  error: createAction('MEMBERS/SEND-MAIL/ERROR'),
  isloading: createAction('MEMBERS/SEND-MAIL/IS_LOADING'),
};

export function mailMembers(data: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(membersMailAction.isloading(true));
    dispatch(membersMailAction.error(null));
    try {
      await sendMailToMembers(data);
      dispatch(snackbarSuccess('communication:mail.success'));
    } catch (error) {
      dispatch(membersMailAction.error(error));
      dispatch(snackbarError('communication:mail.error'));
    }
    dispatch(membersMailAction.isloading(false));
  };
}
