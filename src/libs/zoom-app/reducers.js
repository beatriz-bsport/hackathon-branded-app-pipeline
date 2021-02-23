// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  zoomAppDetailAction,
  zoomAppUpdateAction,
  revokeZoomAppActions,
} from './actions';
import type { zoom_app_state } from './types';

const initialState: zoom_app_state = Immutable({
  loading: false,
  error: null,
  detail: {},
  update: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [revokeZoomAppActions.success]: (state) => {
      return state.set('detail', {});
    },
    [zoomAppDetailAction.success]: (state, { payload }) => {
      return state.set('detail', payload);
    },
    [zoomAppDetailAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [zoomAppDetailAction.loading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [zoomAppUpdateAction.error]: (state, { payload }) => {
      return state.setIn(['update', 'error'], payload);
    },
    [zoomAppUpdateAction.loading]: (state, { payload }) => {
      return state.setIn(['update', 'loading'], payload);
    },
  },
  initialState,
);
