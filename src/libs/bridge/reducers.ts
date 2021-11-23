import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  basketCountActions,
  bookingCountActions,
  authenticationStatusActions,
  memberTagActions,
  getVideoPlaybackUrlActions,
} from './actions';

export type BridgeState = {
  authentication: {
    authenticated: boolean,
    username: string,
    error: Error | null,
    loading: boolean,
  },
  basket: {
    count: number | null,
    loading: boolean,
    error: Error | null,
  },
  booking: {
    count: number | null,
    loading: boolean,
    error: Error | null,
  },
  tag: {
    loading: boolean,
    error: Error | null,
    tag_list: Array<number>,
  },
  video: {
    playbackUrl: {
      byId: { [id: number]: string },
      loading: boolean,
      error: Error | null,
      accessDenied: boolean,
    },
  },
};

export const initialState: Immutable.Immutable<BridgeState> = Immutable<BridgeState>(
  {
    authentication: {
      authenticated: false,
      username: '',
      error: null,
      loading: false,
    },
    basket: {
      count: null,
      loading: false,
      error: null,
    },
    booking: {
      count: null,
      loading: false,
      error: null,
    },
    tag: {
      loading: false,
      error: null,
      tag_list: [],
    },
    video: {
      playbackUrl: {
        byId: {},
        loading: false,
        error: null,
        accessDenied: false,
      },
    },
  },
);

export default handleActions<Immutable.Immutable<BridgeState>>(
  {
    /** SAAS DATA */
    [authenticationStatusActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state
        .setIn(['authentication', 'authenticated'], payload.authenticated)
        .setIn(['authentication', 'username'], payload.username);
    },
    [authenticationStatusActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['authentication', 'loading'], payload);
    },
    [authenticationStatusActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['authentication', 'error'], payload);
    },
    [basketCountActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['basket', 'count'], payload);
    },
    [basketCountActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [basketCountActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [bookingCountActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['booking', 'count'], payload);
    },
    [bookingCountActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['booking', 'loading'], payload);
    },
    [bookingCountActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['booking', 'error'], payload);
    },
    [memberTagActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['tag', 'loading'], payload);
    },
    [memberTagActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['error', 'error'], payload);
    },
    [memberTagActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(
        ['tag', 'tag_list'],
        [...payload.data.map((tag) => tag.id)],
      );
    },
    [getVideoPlaybackUrlActions.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['video', 'playbackUrl', 'error'], payload);
    },
    [getVideoPlaybackUrlActions.accessDenied.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['video', 'playbackUrl', 'accessDenied'], payload);
    },
    [getVideoPlaybackUrlActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['video', 'playbackUrl', 'loading'], payload);
    },
    [getVideoPlaybackUrlActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(
        ['video', 'playbackUrl', 'byId', payload.videoId],
        payload.playbackUrl,
      );
    },
  },
  initialState,
);
