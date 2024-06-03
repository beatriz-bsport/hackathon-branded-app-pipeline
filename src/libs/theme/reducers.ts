import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { colors } from '@bsport/common/lib/colors';
import { themeDetail, themeUpdate } from './actions';
import { ThemeState } from './types';
import {
  STORAGE_KEY_BSPORT_DISPLAY_PASS_CREDIT_FACTOR,
  STORAGE_KEY_BSPORT_PAYMENT_COMPANY_COUNTRY,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY,
  STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION,
  STORAGE_KEY_BSPORT_STRIPE_PK_KEY,
} from './constants';
import { STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN } from '#src/actions/constants';

export const initialState: Immutable.Immutable<ThemeState> =
  Immutable<ThemeState>({
    // @ts-expect-error
    theme: {
      primary_color: colors.primary,
      secondary_color: colors.secondary,
      cover: null,
      is_two_way_email_activated: true,
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
        // If the user is impersonating a studio then we want to retrieve/set those data in the sessionStorage and not in the local storage where it is stored firstly
        const isImpersonatingStudio =
          window.sessionStorage.getItem(
            STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN,
          ) !== null;
        const storage = isImpersonatingStudio
          ? window.sessionStorage
          : window.localStorage;

        storage.setItem(
          STORAGE_KEY_BSPORT_STRIPE_PK_KEY,
          payload.stripe_pk_key,
        );
        storage.setItem(
          STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE,
          payload.currency,
        );
        storage.setItem(STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY, '€');
        storage.setItem(STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION, 'Europe');
        if (payload.currency_display) {
          storage.setItem(
            STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY,
            payload.currency_display,
          );
        }
        if (payload.stripe_region) {
          storage.setItem(
            STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION,
            payload.stripe_region,
          );
        }
        if (payload.locale) {
          storage.setItem(
            STORAGE_KEY_BSPORT_PAYMENT_COMPANY_COUNTRY,
            payload.locale.split('_')[1],
          );
        }
        if (payload.pass_credit_factor) {
          storage.setItem(
            STORAGE_KEY_BSPORT_DISPLAY_PASS_CREDIT_FACTOR,
            payload.pass_credit_factor,
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
