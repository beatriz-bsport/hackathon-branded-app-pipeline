// @flow
import { createAction } from 'redux-actions';

import { fetchCompanyList as fetchCompanyListAPI } from './api';
import type { Dispatch, OptionCallback } from '../../state/types';

export const searchActions = {
  success: createAction('COMPANY/SEARCH/SUCCESS'),
  isLoading: createAction('COMPANY/SEARCH/IS_LOADING'),
  error: createAction('COMPANY/SEARCH/ERROR'),
};

export function searchCompany(text: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(searchActions.isLoading(true));
    dispatch(searchActions.error(null));

    try {
      const response = await fetchCompanyListAPI({
        search: text,
      });
      dispatch(searchActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(searchActions.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(searchActions.isLoading(false));
  };
}
