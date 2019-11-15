// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import { membersMailAction, contactListActions } from './actions';

import type { MailState } from './types';

const initialState: MailState = Immutable({
  mail: {
    isloading: false,
    error: null,
  },
  emailContact: {
    loading: false,
    error: null,
    allIds: [],
    byId: {},
    page: null,
    count: 0,
  },
});

export default handleActions(
  {
    [membersMailAction.isloading]: (state, { payload }) => {
      return state.setIn(['mail', 'isloading'], payload);
    },
    [membersMailAction.error]: (state, { payload }) => {
      return state.setIn(['mail', 'error'], payload);
    },
    [contactListActions.error]: (state, { payload }) => {
      return state.setIn(['emailContact', 'error'], payload);
    },
    [contactListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['emailContact', 'allIds'],
          payload.results.map((foo) => foo.uuid),
        )
        .setIn(['emailContact', 'page'], payload.page)
        .setIn(['emailContact', 'count'], payload.count)
        .merge(
          {
            emailContact: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.uuid] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [contactListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['emailContact', 'loading'], payload);
    },
  },
  initialState,
);
