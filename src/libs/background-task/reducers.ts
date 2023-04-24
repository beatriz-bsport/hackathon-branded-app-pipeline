// @ts-nocheck
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { backgroundTaskDetail } from './actions';
import { BackgroundTaskState } from './types';

const initialState: Immutable.Immutable<BackgroundTaskState> =
  Immutable<BackgroundTaskState>({
    byUuid: {},
    loading: false,
    error: null,
  });

export default handleActions(
  {
    [backgroundTaskDetail.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [backgroundTaskDetail.error.toString()]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [backgroundTaskDetail.success.toString()]: (state, { payload }) => {
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
