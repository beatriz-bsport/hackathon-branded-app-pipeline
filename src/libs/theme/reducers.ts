import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { colors } from '@bsport/common/lib/colors';
import { themeDetail, themeUpdate } from './actions';
import { ThemeState } from './types';

const storage = window.localStorage;

const initialState: Immutable.Immutable<ThemeState> = Immutable<ThemeState>({
  // @ts-ignore
  theme: {
    primary_color: colors.primary,
    secondary_color: colors.secondary,
    cover: null,
  },
  createOrUpdate: {
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
});

export default handleActions<Immutable.Immutable<ThemeState>>(
  {
    [themeDetail.success.toString()]: (state, { payload }: any) => {
      try {
        storage.setItem('bsport:stripe:pk_key', payload.stripe_pk_key);
        storage.setItem('bsport:payment:currency_code', payload.currency);
        storage.setItem('bsport:payment:currency_display', '€');
        if (payload.currency_display) {
          storage.setItem(
            'bsport:payment:currency_display',
            payload.currency_display,
          );
        }
      } catch (err) {
        console.error(err);
      }
      return state.set('theme', payload);
    },
    [themeDetail.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [themeDetail.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [themeUpdate.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [themeUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
  },
  initialState,
);
