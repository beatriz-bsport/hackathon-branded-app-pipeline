// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import { membersMailAction } from './actions';

import type { MailState } from './types';

const initialState: MailState = Immutable({
  mail: {
    isloading: false,
    error: null,
  },
});

export default handleActions(
  {
    [membersMailAction.isloading]: (state, { payload }) => {
      return state.setIn(['mail', 'isloading'], payload);
    },
    [membersMailAction.success]: (state, { payload }) => {
      return state.setIn(['mail', 'error'], payload);
    },
  },
  initialState,
);
