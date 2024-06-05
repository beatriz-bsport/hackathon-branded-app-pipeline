import { createAction } from 'redux-actions';
import { snackbarError, snackbarSuccess } from '#libs/snackbar/actions';
import type { Dispatch, ThunkAction } from '../../state/types';
import {
  fetchQuicksaleConfiguration as fetchConfigurationAPI,
  updateQuicksaleConfiguration as updateConfigurationAPI,
} from './api';
import { QuicksaleConfiguration, QuicksaleSection } from './types';

export const quicksaleActions = {
  isLoading: createAction<boolean>('QUICKSALE/FETCH/IS_LOADING'),
  error: createAction<Error>('QUICKSALE/FETCH/ERROR'),
  success: createAction<QuicksaleConfiguration>('QUICKSALE/FETCH/SUCCESS'),
};

export function fetchQuicksaleConfiguration(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(quicksaleActions.isLoading(true));
    dispatch(quicksaleActions.error(null));

    try {
      const response = await fetchConfigurationAPI();
      dispatch(quicksaleActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(quicksaleActions.error(err));
    }

    dispatch(quicksaleActions.isLoading(false));
  };
}

export const quicksaleUpdateErrorAndLoading = {
  isLoading: createAction<boolean>('QUICKSALE/UPDATE/IS_LOADING'),
  error: createAction<Error>('QUICKSALE/UPDATE/ERROR'),
  success: createAction<QuicksaleConfiguration>('QUICKSALE/UPDATE/SUCCESS'),
};

export function updateQuicksaleConfiguration(
  data: Array<QuicksaleSection>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(quicksaleUpdateErrorAndLoading.isLoading(true));
    dispatch(quicksaleUpdateErrorAndLoading.error(null));

    try {
      const response = await updateConfigurationAPI(data);
      if (response.status === 200)
        dispatch(snackbarSuccess('quicksaleConfiguration.updated'));
      dispatch(quicksaleUpdateErrorAndLoading.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(snackbarError('quicksaleConfiguration.error'));
      dispatch(quicksaleUpdateErrorAndLoading.error(err));
    }

    dispatch(quicksaleUpdateErrorAndLoading.isLoading(false));
  };
}
