// @flow

import * as Sentry from '@sentry/browser';

import { createAction } from 'redux-actions';
import type { Dispatch, ThunkAction } from '../state/types';

import api from '../api';

export const fetchAll = {
  isLoading: createAction('ACTIVITIES/LIST/IS_LOADING'),
  error: createAction('ACTIVITIES/LIST/ERROR'),
  success: createAction('ACTIVITIES/LIST/SUCCESS'),
};

export function fetchActivities(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAll.isLoading(true));
    dispatch(fetchAll.error(null));

    try {
      const response = await api.activity.fetchMinimal();
      dispatch(fetchAll.success(response.data));
    } catch (err) {
      dispatch(fetchAll.error(err));
      Sentry.captureException(err);
    }
    dispatch(fetchAll.isLoading(false));
  };
}
