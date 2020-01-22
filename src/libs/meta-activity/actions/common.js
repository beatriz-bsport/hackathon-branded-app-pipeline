// @flow

import * as Sentry from '@sentry/browser';
import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';
import type { Dispatch, ThunkAction } from '../../../state/types';

import {
  fetchAllActivities as fetchMetaActivityListAPI,
  fetchMetaActivityFavorite as fetchMetaActivityFavoriteAPI,
} from '../api/common';
import { getFreshMetaActivityList } from '../selectors';

export const metaActivityBulkActions = {
  isLoading: createAction('META_ACTIVITIES/BULK/IS_LOADING'),
  error: createAction('META_ACTIVITIES/BULK/ERROR'),
  success: createAction('META_ACTIVITIES/BULK/SUCCESS'),
};

export function fetchMetaActivityBulk(
  ids: Array<number>,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
    const freshIdList = getFreshMetaActivityList(getState());

    const ids_uniq = uniq(ids).filter((id) => !freshIdList.includes(id));
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(metaActivityBulkActions.isLoading(true));
    dispatch(metaActivityBulkActions.error(null));

    try {
      const response = await fetchMetaActivityListAPI({
        id__in: ids_uniq,
        page_size: null,
      });
      dispatch(metaActivityBulkActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(metaActivityBulkActions.error(err));
      Sentry.captureException(err);
      if (options && options.onError) options.onError();
    }
    dispatch(metaActivityBulkActions.isLoading(false));
  };
}

export const favoriteActions = {
  isLoading: createAction('META_ACTIVITIES/FAVORITE/IS_LOADING'),
  error: createAction('META_ACTIVITIES/FAVORITE/ERROR'),
  success: createAction('META_ACTIVITIES/FAVORITE/SUCCESS'),
};

export function fetchMetaActivityFavorite(
  company: number,
  options: ?{ onSuccess: ?() => void, onError: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(favoriteActions.isLoading(true));
    dispatch(favoriteActions.error(null));

    try {
      const response = await fetchMetaActivityFavoriteAPI(company);
      dispatch(favoriteActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        dispatch(favoriteActions.success(null));
      } else {
        dispatch(favoriteActions.error(err));
        if (options && options.onError) options.onError();
      }
    }
    dispatch(favoriteActions.isLoading(false));
  };
}
