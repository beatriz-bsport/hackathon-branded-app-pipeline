import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { colors } from '@bsport/common/lib/colors';
// @ts-ignore
import { themeDetail, themeUpdate } from './actions';
// @ts-ignore
import { ThemeState } from './types';

const storage = window.localStorage;

const initialState: ThemeState = Immutable<ThemeState>({
  theme: {
    primary_color: colors.primary,
    secondary_color: colors.secondary,
    cover: null,
    website: null,
  },
  createOrUpdate: {
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
});

export default handleActions(
  {
    [themeDetail.success]: (state, { payload }) => {
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
    [themeDetail.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [themeDetail.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [themeUpdate.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [themeUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
  },
  initialState,
) as () => ThemeState;
