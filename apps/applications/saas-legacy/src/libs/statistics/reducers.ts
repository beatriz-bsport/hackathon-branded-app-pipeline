import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  statIsLoading,
  statLoaded,
  statError,
  fetchDataSourceDashboardStatisticsActions,
} from './actions';

const initialState = Immutable({
  stats: {},
  dataSourceDashboard: {
    byUuid: {},
  },
});

export default handleActions(
  {
    // @ts-expect-error
    [statIsLoading]: (state, { payload: { identifier, loading } }) => {
      return state.setIn(['stats', identifier, 'isLoading'], loading);
    },
    // @ts-expect-error
    [statLoaded]: (state, { payload: { identifier, data } }) => {
      return state.setIn(['stats', identifier, 'data'], data);
    },
    // @ts-expect-error
    [statError]: (state, { payload: { identifier, error } }) => {
      return state.setIn(['stats', identifier, 'error'], error);
    },
    [fetchDataSourceDashboardStatisticsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['dataSourceDashboard', 'byUuid', payload.uuid, 'loading'],
        // @ts-expect-error
        payload.loading,
      );
    },
    [fetchDataSourceDashboardStatisticsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['dataSourceDashboard', 'byUuid', payload.uuid, 'data'],
        // @ts-expect-error
        payload.data,
      );
    },
  },
  initialState,
);
