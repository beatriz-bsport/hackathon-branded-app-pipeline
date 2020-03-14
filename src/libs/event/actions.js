// @flow

import { createAction } from 'redux-actions';

import { fetchEventList as fetchEventListAPI } from './api';

export const listEventActions = {
  error: createAction('EVENT/LIST/ERROR'),
  isLoading: createAction('EVENT/LIST/IS_LOADING'),
  success: createAction('EVENT/LIST/SUCCESS'),
  setPage: createAction('EVENT/LIST/SET_PAGE'),
};

export function fetchEventList(
  identifier,
  params: { page: number, page_size: number, billing_plan?: number },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listEventActions.isLoading({ loading: true, identifier }));
    dispatch(listEventActions.error({ error: null, identifier }));
    dispatch(listEventActions.setPage({ identifier, page: params.page || 1 }));

    try {
      const response = await fetchEventListAPI(params);
      dispatch(listEventActions.success({ identifier, items: response.data }));

      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(listEventActions.error({ error, identifier }));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }

    dispatch(listEventActions.isLoading({ loading: false, identifier }));
  };
}
