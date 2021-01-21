import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrievePlaylistActions,
  listPlaylistActions,
  createOrUpdatePlaylistActions,
  updatePlaylistItemActions,
} from './actions';
import { Playlist, PlaylistState } from './types';

const initialState: Immutable.Immutable<PlaylistState> = Immutable<PlaylistState>(
  {
    byId: {},
    list: {
      page: null,
      allIds: [],
      nextPage: 1,
    },
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
);

export default handleActions<Immutable.Immutable<PlaylistState>>(
  {
    [updatePlaylistItemActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['updateItem', 'loading'], payload);
    },
    [updatePlaylistItemActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['updateItem', 'error'], payload);
    },
    [updatePlaylistItemActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [createOrUpdatePlaylistActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [createOrUpdatePlaylistActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [createOrUpdatePlaylistActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [retrievePlaylistActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [listPlaylistActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listPlaylistActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [listPlaylistActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state
        .merge(
          {
            byId: payload.results.reduce(
              (acc: PlaylistState['byId'], ps: Playlist) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        )
        .setIn(
          ['list', 'allIds'],
          payload.results.map((p: Playlist) => p.id),
        )
        .setIn(['list', 'page'], payload.page)
        .setIn(['list', 'nextPage'], payload.next_page);
    },
  },
  initialState,
);
