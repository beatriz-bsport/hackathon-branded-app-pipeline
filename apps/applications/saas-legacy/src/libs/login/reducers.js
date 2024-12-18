// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { tempPasswordActions, checkEmailValidationActions } from './actions';

import type { LoginState } from './types';

const initialState: LoginState = Immutable({
  tempPassword: {
    password: null,
    expiration_date: null,
    loading: false,
    error: null,
  },
  emailValidation: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [tempPasswordActions.success]: (state, { payload }) =>
      state
        .setIn(['tempPassword', 'password'], payload.password)
        .setIn(['tempPassword', 'expiration_date'], payload.expiration_date),
    [tempPasswordActions.isLoading]: (state, { payload }) =>
      state.setIn(['tempPassword', 'loading'], payload),
    [tempPasswordActions.error]: (state, { payload }) =>
      state.setIn(['tempPassword', 'error'], payload),
    [checkEmailValidationActions.error]: (state, { payload }) =>
      state.setIn(['emailValidation', 'error'], payload),
    [checkEmailValidationActions.isLoading]: (state, { payload }) =>
      state.setIn(['emailValidation', 'loading'], payload),
  },
  initialState,
);
