// @flow

import { createAction } from 'redux-actions';

import {
  fetchPlaylistList as fetchPlaylistListAPI,
  createOrUpdatePlaylist as createOrUpdatePlaylistAPI,
  deletePlaylist as deletePlaylistAPI,
  retrievePlaylist as retrievePlaylistAPI,
  addVideoToPlaylist as addVideoToPlaylistAPI,
  delVideoToPlaylist as delVideoToPlaylistAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import type { Dispatch } from '../../state/types';

export const retrievePlaylistActions = {
  isLoading: createAction('PLAYLIST/RETRIEVE/IS_LOADING'),
  error: createAction('PLAYLIST/RETRIEVE/ERROR'),
  success: createAction('PLAYLIST/RETRIEVE/SUCCESS'),
};

export function retrievePlaylist(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrievePlaylistActions.isLoading(true));
    dispatch(retrievePlaylistActions.error(null));
    try {
      const response = await retrievePlaylistAPI(id);
      dispatch(retrievePlaylistActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(retrievePlaylistActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(retrievePlaylistActions.isLoading(false));
  };
}

export const updatePlaylistItemActions = {
  isLoading: createAction('PLAYLIST/UPDATE_ITEM/IS_LOADING'),
  error: createAction('PLAYLIST/UPDATE_ITEM/ERROR'),
  success: createAction('PLAYLIST/UPDATE_ITEM/SUCCESS'),
};

export function updateVideoToPaylist(
  playlist: number,
  video: number,
  method: 'add' | 'del',
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updatePlaylistItemActions.isLoading(true));
    dispatch(updatePlaylistItemActions.error(null));
    try {
      let response = null;
      if (method === 'add') {
        response = await addVideoToPlaylistAPI(playlist, video);
      } else if (method === 'del') {
        response = await delVideoToPlaylistAPI(playlist, video);
      } else {
        throw new Error('bad paylist item method');
      }
      dispatch(updatePlaylistItemActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
      dispatch(snackbarSuccess(`playlist.video.${method}.success`));
    } catch (err) {
      console.error(err);
      dispatch(updatePlaylistItemActions.error(err));
      if (options && options.onError) options.onError();
      dispatch(snackbarError(`playlist.video.${method}.error`));
    }
    dispatch(updatePlaylistItemActions.isLoading(false));
  };
}

export const addVideoToPlaylist = (
  playlist: number,
  video: number,
  options: OptionCallback,
) => updateVideoToPaylist(playlist, video, 'add', options);

export const subVideoToPlaylist = (
  playlist: number,
  video: number,
  options: OptionCallback,
) => updateVideoToPaylist(playlist, video, 'del', options);

export const listPlaylistActions = {
  isLoading: createAction('PLAYLIST/LIST/IS_LOADING'),
  error: createAction('PLAYLIST/LIST/ERROR'),
  success: createAction('PLAYLIST/LIST/SUCCESS'),
};

export function fetchPlaylistList(
  params: any = {},
  page: number = 1,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listPlaylistActions.isLoading(true));
    dispatch(listPlaylistActions.error(null));
    try {
      const response = await fetchPlaylistListAPI(params);
      dispatch(listPlaylistActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);

      dispatch(listPlaylistActions.error(err));

      if (options && options.onError) options.onError();
    }
    dispatch(listPlaylistActions.isLoading(false));
  };
}
export const createOrUpdatePlaylistActions = {
  isLoading: createAction('PLAYLIST/CREATE_OR_UPDATE/IS_LOADING'),
  error: createAction('PLAYLIST/CREATE_OR_UPDATE/ERROR'),
  success: createAction('PLAYLIST/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdatePlaylist(data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdatePlaylistActions.isLoading(true));
    dispatch(createOrUpdatePlaylistActions.error(null));
    try {
      const response = await createOrUpdatePlaylistAPI(data);
      dispatch(createOrUpdatePlaylistActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(snackbarSuccess('playlist.createOrUpdate.success'));
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdatePlaylistActions.error(err));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('playlist.createOrUpdate.error'));
    }
    dispatch(createOrUpdatePlaylistActions.isLoading(false));
  };
}

export const deletePlaylistActions = {
  isLoading: createAction('PLAYLIST/DELETE/IS_LOADING'),
  error: createAction('PLAYLIST/DELETE/ERROR'),
  success: createAction('PLAYLIST/DELETE/SUCCESS'),
};
export function deletePlaylist(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(deletePlaylistActions.isLoading(true));
    dispatch(deletePlaylistActions.error(null));
    try {
      await deletePlaylistAPI(id);
      dispatch(deletePlaylistActions.success(id));
      if (options && options.onSuccess) {
        options.onSuccess(id);
      }
      dispatch(snackbarSuccess('playlist.delete.success'));
    } catch (err) {
      console.error(err);
      dispatch(deletePlaylistActions.error(err));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('playlist.delete.error'));
    }
    dispatch(deletePlaylistActions.isLoading(false));
  };
}
