// TODO : Type
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveManagerCssConfigurationActions,
  retrieveCompanyCssConfigurationActions,
  saveCssConfigurationActions,
  resetConfigurationActions,
} from './actions';
import { ExportableComponentsState } from './types';

const DEFAULT_CONFIG = {
  // @ts-expect-error
  id: null,
  // @ts-expect-error
  udpated_at: null,
  components_css: {},
  apply_on_marketplace: false,
};

const initialState: Immutable.Immutable<ExportableComponentsState> =
  Immutable<ExportableComponentsState>({
    customCss: DEFAULT_CONFIG,
    loading: false,
    error: null,
  });

export default handleActions<Immutable.Immutable<ExportableComponentsState>>(
  {
    [retrieveManagerCssConfigurationActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [retrieveManagerCssConfigurationActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('error', payload);
    },
    [retrieveManagerCssConfigurationActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.set('customCss', payload);
    },

    [retrieveCompanyCssConfigurationActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [retrieveCompanyCssConfigurationActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('error', payload);
    },
    [retrieveCompanyCssConfigurationActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.set('customCss', payload ?? DEFAULT_CONFIG);
    },

    [saveCssConfigurationActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [saveCssConfigurationActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [saveCssConfigurationActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.set('customCss', payload);
    },

    [resetConfigurationActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [resetConfigurationActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [resetConfigurationActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) => {
      return state.set('customCss', payload);
    },
  },
  initialState,
);
