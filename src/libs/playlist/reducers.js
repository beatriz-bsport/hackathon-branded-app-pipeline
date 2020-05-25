// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrievePlaylistActions,
  listPlaylistActions,
  createOrUpdatePlaylistActions,
  updatePlaylistItemActions,
} from './actions';

const initialState = Immutable({
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
});

export default handleActions(
  {
    [updatePlaylistItemActions.isLoading]: (state, { payload }) => {
      return state.setIn(['updateItem', 'loading'], payload);
    },
    [updatePlaylistItemActions.error]: (state, { payload }) => {
      return state.setIn(['updateItem', 'error'], payload);
    },
    [updatePlaylistItemActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [createOrUpdatePlaylistActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [createOrUpdatePlaylistActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [createOrUpdatePlaylistActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [retrievePlaylistActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [listPlaylistActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listPlaylistActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [listPlaylistActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(['list', 'allIds'], payload.results.map((v) => v.id))
        .setIn(['list', 'page'], payload.page)
        .setIn(['list', 'nextPage'], payload.next_page);
    },
  },
  initialState,
);
