import { createAction } from 'redux-actions';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import {
  createStripeReader as createStripeReaderAPI,
  deleteStripeReader as deleteStripeReaderAPI,
  fetchStripeReaders as fetchStripeReadersAPI,
  editStripeReader as editStripeReaderAPI,
} from './api';

import { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

export const createStripeReaderActions = {
  error: createAction('TERMINAL/READER/CREATE/ERROR'),
  isLoading: createAction('TERMINAL/READER/CREATE/IS_LOADING'),
  success: createAction('TERMINAL/READER/CREATE/SUCCESS'),
};
export function createStripeReader(
  data: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createStripeReaderActions.isLoading(true));
    dispatch(createStripeReaderActions.error(null));

    try {
      await createStripeReaderAPI(data);
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(createStripeReaderActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(createStripeReaderActions.isLoading(false));
  };
}

export const editStripeReaderActions = {
  error: createAction('TERMINAL/READER/EDIT/ERROR'),
  isLoading: createAction('TERMINAL/READER/EDIT/IS_LOADING'),
  success: createAction('TERMINAL/READER/EDIT/SUCCESS'),
};
export function editStripeReader(
  readerId: string,
  label: string,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(editStripeReaderActions.isLoading(true));
    dispatch(editStripeReaderActions.error(null));

    try {
      await editStripeReaderAPI(readerId, label);
      dispatch(snackbarSuccess('companyTheme.update.success'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(editStripeReaderActions.error(error));
      dispatch(snackbarError('companyTheme.update.success'));
      if (options && options.onError) options.onError();
    }
    dispatch(editStripeReaderActions.isLoading(false));
  };
}

export const fetchStripeReadersActions = {
  error: createAction('TERMINAL/READER/LIST/ERROR'),
  isLoading: createAction('TERMINAL/READER/LIST/IS_LOADING'),
  success: createAction('TERMINAL/READER/LIST/SUCCESS'),
};
export function fetchStripeReaders(options?: OptionCallback): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchStripeReadersActions.isLoading(true));
    dispatch(fetchStripeReadersActions.error(null));

    try {
      const response = await fetchStripeReadersAPI();
      dispatch(
        fetchStripeReadersActions.success(
          // @ts-expect-error
          response.data.data ? response.data.data : [],
        ),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(fetchStripeReadersActions.error(error));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchStripeReadersActions.isLoading(false));
  };
}

export const deleteStripeReaderActions = {
  error: createAction('TERMINAL/READER/DELETE/ERROR'),
  isLoading: createAction('TERMINAL/READER/DELETE/IS_LOADING'),
  success: createAction('TERMINAL/READER/DELETE/SUCCESS'),
};
export function deleteStripeReader(
  readerId: string,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteStripeReaderActions.isLoading(true));
    dispatch(deleteStripeReaderActions.error(null));

    try {
      await deleteStripeReaderAPI(readerId);
      dispatch(snackbarSuccess('stripeTerminal.deleteReader.success'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(deleteStripeReaderActions.error(error));
      dispatch(snackbarError('stripeTerminal.deleteReader.errror'));
      if (options && options.onError) options.onError();
    }
    dispatch(deleteStripeReaderActions.isLoading(false));
  };
}
