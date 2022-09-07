import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  zoomAppDetailAction,
  zoomAppUpdateAction,
  revokeZoomAppActions,
} from './actions';
import type { ZoomAppState } from './types';

const initialState: Immutable.Immutable<ZoomAppState> = Immutable<ZoomAppState>(
  {
    loading: false,
    error: null,
    detail: {
      id: null,
      company: null,
      zoom_user_id: '',
      is_disabled: true,
      is_configured: false,
    },
    update: {
      loading: false,
      error: null,
    },
  },
);

export default handleActions<Immutable.Immutable<ZoomAppState>>(
  {
    [revokeZoomAppActions.success.toString()]: (state) => {
      return state.set('detail', {});
    },
    [zoomAppDetailAction.success.toString()]: (state, { payload }) => {
      return state.set('detail', payload);
    },
    [zoomAppDetailAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [zoomAppDetailAction.loading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [zoomAppUpdateAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['update', 'error'], payload);
    },
    [zoomAppUpdateAction.loading.toString()]: (state, { payload }) => {
      return state.setIn(['update', 'loading'], payload);
    },
  },
  initialState,
);
