// @flow

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { backgroundTaskDetail } from './actions';

const initialState = Immutable({
  byUuid: {},
  loading: false,
  error: null,
});

export default handleActions(
  {
    [backgroundTaskDetail.isLoading]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [backgroundTaskDetail.error]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [backgroundTaskDetail.success]: (state, { payload }) => {
      return state.merge(
        {
          byUuid: { [payload.uuid]: payload },
        },
        { deep: true },
      );
    },
  },
  initialState,
);
