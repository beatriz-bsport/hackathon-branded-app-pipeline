// @flow

import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';
import {
  fetchVideoList as fetchVideoListAPI,
  createOrUpdateVideo as createOrUpdateVideoAPI,
  deleteVideo as deleteVideoAPI,
  retrieveVideo as retrieveVideoAPI,
  registerVideo as registerVideoAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

import type { Dispatch } from '../../state/types';

export const retrieveVideoActions = {
  isLoading: createAction('VIDEO/RETRIEVE/IS_LOADING'),
  error: createAction('VIDEO/RETRIEVE/ERROR'),
  success: createAction('VIDEO/RETRIEVE/SUCCESS'),
};

export function retrieveVideo(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveVideoActions.isLoading(true));
    dispatch(retrieveVideoActions.error(null));
    try {
      const response = await retrieveVideoAPI(id);
      dispatch(retrieveVideoActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);

      dispatch(retrieveVideoActions.error(err));

      if (options && options.onError) options.onError();
    }
    dispatch(retrieveVideoActions.isLoading(false));
  };
}

export const bulkVideoActions = {
  isLoading: createAction('VIDEO/BULK/IS_LOADING'),
  error: createAction('VIDEO/BULK/ERROR'),
  success: createAction('VIDEO/BULK/SUCCESS'),
};

export function fetchVideoBulk(ids: Array<number>, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    const ids_uniq = uniq(ids);
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(bulkVideoActions.isLoading(true));
    dispatch(bulkVideoActions.error(null));
    try {
      const response = await fetchVideoListAPI({
        id__in: ids_uniq,
        page_size: ids_uniq.length,
      });
      dispatch(bulkVideoActions.success(response.data.results));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);
      dispatch(bulkVideoActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(bulkVideoActions.isLoading(false));
  };
}

export const searchVideoActions = {
  isLoading: createAction('VIDEO/SEARCH/IS_LOADING'),
  error: createAction('VIDEO/SEARCH/ERROR'),
  success: createAction('VIDEO/SEARCH/SUCCESS'),
};

export function searchVideo(
  params: any = {},
  page: number = 1,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(searchVideoActions.isLoading(true));
    dispatch(searchVideoActions.error(null));
    try {
      const response = await fetchVideoListAPI({ ...params, page });
      dispatch(searchVideoActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);
      dispatch(searchVideoActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(searchVideoActions.isLoading(false));
  };
}

export const listVideoActions = {
  isLoading: createAction('VIDEO/LIST/IS_LOADING'),
  error: createAction('VIDEO/LIST/ERROR'),
  success: createAction('VIDEO/LIST/SUCCESS'),
  reset: createAction('VIDEO/LIST/RESET'),
};

export function fetchMoreVideo(params: any = {}, options: OptionCallback) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { nextPage } = getState().video.list;
    if (nextPage) {
      dispatch(fetchVideoList(params, nextPage, options));
    }
  };
}

export function fetchVideoList(
  params: any = {},
  page: number = 1,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listVideoActions.isLoading(true));
    dispatch(listVideoActions.error(null));
    if (page === 1) {
      dispatch(listVideoActions.reset());
    }
    try {
      const response = await fetchVideoListAPI({ ...params, page });
      dispatch(listVideoActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (err) {
      console.error(err);

      dispatch(listVideoActions.error(err));

      if (options && options.onError) options.onError();
    }
    dispatch(listVideoActions.isLoading(false));
  };
}

export const createOrUpdateVideoActions = {
  isLoading: createAction('VIDEO/CREATE_OR_UPDATE/IS_LOADING'),
  error: createAction('VIDEO/CREATE_OR_UPDATE/ERROR'),
  success: createAction('VIDEO/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateVideo(data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateVideoActions.isLoading(true));
    dispatch(createOrUpdateVideoActions.error(null));
    try {
      const response = await createOrUpdateVideoAPI(data);
      dispatch(createOrUpdateVideoActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(snackbarSuccess('video.createOrUpdate.success'));
    } catch (err) {
      console.error(err);
      dispatch(createOrUpdateVideoActions.error(err));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('video.createOrUpdate.error'));
    }
    dispatch(createOrUpdateVideoActions.isLoading(false));
  };
}

export const deleteVideoActions = {
  isLoading: createAction('VIDEO/DELETE/IS_LOADING'),
  error: createAction('VIDEO/DELETE/ERROR'),
  success: createAction('VIDEO/DELETE/SUCCESS'),
};
export function deleteVideo(id: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteVideoActions.isLoading(true));
    dispatch(deleteVideoActions.error(null));
    try {
      await deleteVideoAPI(id);
      dispatch(deleteVideoActions.success(id));
      if (options && options.onSuccess) {
        options.onSuccess(id);
      }
      dispatch(snackbarSuccess('video.delete.success'));
    } catch (err) {
      console.error(err);
      dispatch(deleteVideoActions.error(err));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('video.delete.error'));
    }
    dispatch(deleteVideoActions.isLoading(false));
  };
}

export const registerVideoActions = {
  isLoading: createAction('VIDEO/REGISTER/IS_LOADING'),
  error: createAction('VIDEO/REGISTER/ERROR'),
  success: createAction('VIDEO/REGISTER/SUCCESS'),
};
export function registerVideo(id: number, data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(registerVideoActions.isLoading(true));
    dispatch(registerVideoActions.error(null));
    try {
      await registerVideoAPI(id, data);
      dispatch(registerVideoActions.success(id));
      if (options && options.onSuccess) {
        options.onSuccess(id);
      }
      dispatch(snackbarSuccess('video.register.success'));
    } catch (err) {
      console.error(err);
      dispatch(registerVideoActions.error(err));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('video.register.error'));
    }
    dispatch(registerVideoActions.isLoading(false));
  };
}
