// @flow
import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  dashboardSettings,
  managerFiltersSettings,
  managerRessourcesFilters,
} from './actions';

const initialState = Immutable({
  loading: false,
  error: null,
  data: {},
  managerFiltersSettings: {
    loading: false,
    error: null,
    data: {},
  },
  managerRessourcesFilters: {
    loading: false,
    error: null,
    data: {},
  },
});

export default handleActions(
  {
    [dashboardSettings.isLoading]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [dashboardSettings.error]: (state, { payload }) => {
      return state.setIn(['error', payload]);
    },
    [dashboardSettings.success]: (state, { payload }) => {
      return state.setIn(['data'], payload);
    },
    [managerFiltersSettings.isLoading]: (state, { payload }) => {
      return state.setIn(['managerFiltersSettings', 'loading'], payload);
    },
    [managerFiltersSettings.error]: (state, { payload }) => {
      return state.setIn(['managerFiltersSettings', 'error'], payload);
    },
    [managerFiltersSettings.success]: (state, { payload }) => {
      return state.setIn(['managerFiltersSettings', 'data'], payload);
    },
    [managerRessourcesFilters.isLoading]: (state, { payload }) => {
      return state.setIn(['managerRessourcesFilters', 'loading'], payload);
    },
    [managerRessourcesFilters.error]: (state, { payload }) => {
      return state.setIn(['managerRessourcesFilters', 'error'], payload);
    },
    [managerRessourcesFilters.success]: (state, { payload }) => {
      return state.setIn(['managerRessourcesFilters', 'data'], payload);
    },
  },
  initialState,
);
