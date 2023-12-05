import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  zoomAppDetailAction,
  zoomAppUpdateAction,
  revokeZoomAppActions,
  ZoomGroupMemberActions,
  fetchZoomEstablishmentActions,
  updateZoomEstablishmentActions,
} from './actions';
import type {
  ZoomAppState,
  ZoomApp,
  ZoomMember,
  ZoomEstablishment,
} from './types';

const zoomAppDetailDefaultState: ZoomApp = {
  id: null,
  company: null,
  zoom_user_id: '',
  is_disabled: true,
  is_configured: false,
  multi_zoom_user_support_enabled: false,
};

const initialState: Immutable.Immutable<ZoomAppState> = Immutable<ZoomAppState>(
  {
    loading: false,
    error: null,
    detail: zoomAppDetailDefaultState,
    update: {
      loading: false,
      error: null,
    },
    zoomMembers: {
      data: [],
      loading: false,
      error: null,
    },
    zoomEstablishments: {
      data: [],
      loading: false,
      error: null,
      update: {
        error: null,
        loading: false,
      },
    },
  },
);

export default handleActions<Immutable.Immutable<ZoomAppState>, any>(
  {
    [revokeZoomAppActions.success.toString()]: (state) => {
      return state.set('detail', zoomAppDetailDefaultState);
    },
    [zoomAppDetailAction.success.toString()]: (
      state,
      { payload }: { payload: ZoomApp },
    ) => {
      return state.set('detail', payload);
    },
    [zoomAppDetailAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [zoomAppDetailAction.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [zoomAppUpdateAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['update', 'error'], payload);
    },
    [zoomAppUpdateAction.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['update', 'loading'], payload);
    },
    [zoomAppUpdateAction.success.toString()]: (
      state,
      { payload }: { payload: ZoomApp },
    ) => {
      return state.set('detail', payload);
    },
    [ZoomGroupMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['zoomMembers', 'error'], payload);
    },
    [ZoomGroupMemberActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['zoomMembers', 'loading'], payload);
    },
    [ZoomGroupMemberActions.success.toString()]: (
      state,
      { payload }: { payload: ZoomMember[] },
    ) => {
      return state.setIn(['zoomMembers', 'data'], payload);
    },
    [fetchZoomEstablishmentActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['zoomEstablishments', 'error'], payload);
    },
    [fetchZoomEstablishmentActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['zoomEstablishments', 'loading'], payload);
    },
    [fetchZoomEstablishmentActions.success.toString()]: (
      state,
      { payload }: { payload: ZoomEstablishment[] },
    ) => {
      return state.setIn(['zoomEstablishments', 'data'], payload);
    },
    [updateZoomEstablishmentActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['zoomEstablishments', 'update', 'error'], payload);
    },
    [updateZoomEstablishmentActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['zoomEstablishments', 'update', 'loading'], payload);
    },
    [updateZoomEstablishmentActions.reset.toString()]: (state) => {
      return state.setIn(['zoomEstablishments', 'data'], []);
    },
    [updateZoomEstablishmentActions.success.toString()]: (
      state,
      { payload }: { payload: ZoomEstablishment[] },
    ) => {
      return state.setIn(['zoomEstablishments', 'data'], payload);
    },
  },
  initialState,
);
