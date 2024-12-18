import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type { PollState } from './types';
import {
  fetchSignUpConfigurationActions,
  updateSignUpConfigurationActions,
} from './actions';

const initialState: Immutable.Immutable<PollState> = Immutable<PollState>({
  signUpForm: {
    config: null,
    loading: false,
    error: null,
  },
  upsert: {
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
});

export default handleActions(
  {
    [fetchSignUpConfigurationActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['signUpForm', 'loading'], payload);
    },
    [fetchSignUpConfigurationActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['signUpForm', 'error'], payload);
    },
    [fetchSignUpConfigurationActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['signUpForm', 'config'], payload);
    },
    [updateSignUpConfigurationActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [updateSignUpConfigurationActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [updateSignUpConfigurationActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['signUpForm', 'config'], payload);
    },
  },
  initialState,
);
