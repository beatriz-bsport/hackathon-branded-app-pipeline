import { createAction } from 'redux-actions';
import type { Dispatch } from '../../state/types';
import { OptionCallback } from '../../state/types';
import {
  fetchSignUpFormConfiguration as fetchSignUpFormConfigurationAPI,
  updateSignUpFormConfiguration as updateSignUpFormConfigurationAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';

export const fetchSignUpConfigurationActions = {
  isLoading: createAction('SIGNUPCONFIG/GET/IS_LOADING'),
  error: createAction('SIGNUPCONFIG/GET/ERROR'),
  success: createAction('SIGNUPCONFIG/GET/SUCCESS'),
};

export function fetchSignFormUpConfiguration(membership?: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSignUpConfigurationActions.isLoading(true));
    dispatch(fetchSignUpConfigurationActions.error(null));
    try {
      const response = await fetchSignUpFormConfigurationAPI(membership);
      dispatch(fetchSignUpConfigurationActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(fetchSignUpConfigurationActions.error(err));
    }
    dispatch(fetchSignUpConfigurationActions.isLoading(false));
  };
}

export const updateSignUpConfigurationActions = {
  isLoading: createAction('SIGNUPCONFIG/UPDATE/IS_LOADING'),
  error: createAction('SIGNUPCONFIG/UPDATE/ERROR'),
  success: createAction('SIGNUPCONFIG/UPDATE/SUCCESS'),
};

export function updateSignUpFormConfiguration(
  id: number,
  data: object,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateSignUpConfigurationActions.isLoading(true));
    dispatch(updateSignUpConfigurationActions.error(null));
    try {
      const response = await updateSignUpFormConfigurationAPI(id, data);
      dispatch(
        updateSignUpConfigurationActions.success({ id, data: response.data }),
      );
      dispatch(snackbarSuccess('theme:signUpForm.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(updateSignUpConfigurationActions.error(err));
      dispatch(snackbarError('theme:signUpForm.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(updateSignUpConfigurationActions.isLoading(false));
  };
}
