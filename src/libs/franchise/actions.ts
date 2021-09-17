// @flow
import { Dispatch } from 'redux';
import { createAction } from 'redux-actions';
import { OptionCallback } from '../../state/types';

import { fetchFranchise as fetchFranchiseAPI } from './api';

export const fetchFranchiseActions = {
  error: createAction('FRANCHISE/ME/ERROR'),
  isLoading: createAction('FRANCHISE/ME/IS_LOADING'),
  success: createAction('FRANCHISE/ME/SUCCESS'),
};

export function fetchFranchise(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchFranchiseActions.isLoading(true));
    dispatch(fetchFranchiseActions.error({ error: null }));

    try {
      const response = await fetchFranchiseAPI();
      dispatch(fetchFranchiseActions.success({ franchisor: response.data }));

      options?.onSuccess();
    } catch (error) {
      dispatch(fetchFranchiseActions.error(error));
      options?.onError(error);
    }

    dispatch(fetchFranchiseActions.isLoading(false));
  };
}
