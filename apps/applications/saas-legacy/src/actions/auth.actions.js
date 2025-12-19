// @flow

import * as Sentry from '@sentry/react';
import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';

import { DateTime } from 'luxon';
import { rudderStackIdentify } from '#src/components/analytics/rudderstack/utils';
import { identifyAnalyticsB2BUser } from '#src/components/analytics/mixpanel';
import {
  getRelationToken as getRelationTokenAPI,
  impersonateAdmin as impersonateAdminAPI,
  checkEmailExists as checkEmailExistsAPI,
  accessLevel as accessLevelAPI,
  login as loginAPI,
  resetPassword as resetPasswordAPI,
  sendEmailForConfirmation as sendEmailForConfirmationAPI,
  confirmEmail as confirmEmailAPI,
  getEmailValidationStatus,
  toggleRevampedBackofficeAPI,
} from '../libs/login/api';
import { Dispatch, ThunkAction, OptionCallback } from '../state/types';
import WidgetUtils from '../libs/widget/WidgetUtils';
import { WidgetMessageType } from '../libs/widget/types';
import { snackbarError } from './snackbar.actions';
import { getAuthToken } from '../http';
import Config from '../config';
import { getUserSpaceUrl } from '../libs/marketplace/routing-utils';

import { urlToMarketplace } from '../libs/marketplace/utils';

import {
  MEMBERISNOTAUTHORIZEDTOACCESSACCOUNT,
  RELATIONMISSPARAMETERS,
  TOKENISUNDEFINED,
} from '../libs/relationship/constants';
import {
  STORAGE_KEY_BSPORT_I18NEXTLNG,
  STORAGE_KEY_BSPORT_I18NEXTLNG_ORIGIN,
  STORAGE_KEY_BSPORT_IMPERSONATED_LEFT_URL,
  STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
  STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_URL,
  STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN,
  STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN,
  STORAGE_KEY_BSPORT_IMPERSONATED_GOTO_URL,
  authActionTypes as types,
} from './constants';
import {
  STORAGE_KEY_BSPORT_DISPLAY_PASS_CREDIT_FACTOR,
  STORAGE_KEY_BSPORT_PAYMENT_COMPANY_COUNTRY,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE,
  STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY,
  STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION,
  STORAGE_KEY_BSPORT_STRIPE_PK_KEY,
} from '../libs/theme/constants';
import i18n from '../i18n';
import {
  getItemInStorage,
  removeItemInStorage,
  setItemInStorage,
  storageToString,
} from '../utils/storage';

import { getBaseURL } from '../utils/urlUtils';
import analyticsUtils from '../components/analytics/analytics';
import { onboardingManagerClient } from '../components/onboarding/onboardingManagerClient';

export const initiateInterface = createAction('initiate');

function networkError(error?: Error) {
  return { type: 'LOGIN/NETWORK_ERROR', error };
}

export function fetchAccessLevel(
  token: string,
  options?: {
    company: string,
    goNext?: (values: {
      is_manager: Boolean,
      is_consumer: Boolean,
      is_franchisor: Boolean,
    }) => ThunkAction,
    onDone?: () => void,
    onSuccess?: (response: unknown) => void,
  },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await accessLevelAPI(token);
      const {
        id,
        is_manager,
        is_consumer,
        is_franchisor,
        is_coach,
        role,
        franchise_role,
        franchise_role_identifier,
        coaches_selected_in_role,
        establishments_selected_in_role,
        allowed_franchisees,
        name,
        username,
        has_completed_account_configuration_on_boarding,
        email_confirmed,
        has_enabled_revamped_backoffice,
      } = response.data;
      if (!is_franchisor && !is_manager) {
        analyticsUtils.onSigninSuccess({ email: username });
      }
      if (!is_manager && !is_franchisor && is_consumer) {
        dispatch(errorLogin());
      }
      dispatch(
        setLogin(
          {
            id,
            username,
            token,
            is_manager,
            is_coach,
            is_consumer,
            is_franchisor,
            role,
            franchise_role,
            franchise_role_identifier,
            coaches_selected_in_role,
            establishments_selected_in_role,
            allowed_franchisees,
            name,
            has_completed_account_configuration_on_boarding,
            email_confirmed: email_confirmed !== false,
            has_enabled_revamped_backoffice,
          },
          { accessLevel: true },
        ),
      );
      if (options?.company && email_confirmed === false) {
        const confirmationResponseOverride = await confirmEmailAPI(
          null,
          options.company,
        );
        dispatch(emailConfirmed(confirmationResponseOverride.data));
        dispatch(push(`/c/membership-validator/${options.company}/`));
      }
      try {
        Sentry.configureScope((scope) => {
          scope.setUser({ email: username });
        });
        rudderStackIdentify({
          userId: id,
          userTraits: {
            email: username,
            manager: is_manager,
            is_franchisor,
            name,
          },
        });
        identifyAnalyticsB2BUser(id);
      } catch (err) {
        console.error(err);
      }
      WidgetUtils.DEPRECATEDonLoginSuccess(username);
      WidgetUtils.sendBridgeResponse(
        WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS,
        {
          authenticated: true,
          username,
        },
      );
      options?.onSuccess?.(response.data);
      if (options && options?.goNext) {
        options.goNext({ is_franchisor, is_manager });
      } else if (options && options.company) {
        dispatch(push(`/c/membership-validator/${options.company}/`));
      }
    } catch (err) {
      if (!err.status) {
        dispatch(networkError(err));
      } else {
        dispatch(errorLogin());
      }
    }
    if (options && options.onDone) options.onDone();
  };
}

export function fetchAccessLevelWithoutConnect(
  token: string,
  storingKey: 'previous' | 'current',
  options?: {
    next?: ThunkAction,
    onSuccess: (data: unknown) => void,
  },
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await accessLevelAPI(token);
      const {
        id,
        is_manager,
        is_consumer,
        is_franchisor,
        role,
        franchise_role,
        franchise_role_identifier,
        coaches_selected_in_role,
        establishments_selected_in_role,
        allowed_franchisees,
        name,
        username,
        has_enabled_revamped_backoffice,
      } = response.data;

      dispatch({
        type: types.CHECK_ACCESS_LEVEL,
        payload: {
          id,
          storingKey,
          is_manager,
          is_consumer,
          is_franchisor,
          role,
          franchise_role,
          franchise_role_identifier,
          coaches_selected_in_role,
          establishments_selected_in_role,
          allowed_franchisees,
          name,
          username,
          has_enabled_revamped_backoffice,
        },
      });

      if (typeof options?.onSuccess === 'function') {
        options?.onSuccess(response.data);
      }
    } catch (err) {
      if (!err.status) {
        dispatch(networkError(err));
      } else {
        dispatch(errorLogin());
      }
    }
    if (options && options.onDone) options.onDone();
  };
}

export function requestLogin(
  username: string,
  password: string,
  options?: {
    company: string,
    goNext?: (values: {
      is_manager: Boolean,
      is_consumer: Boolean,
      is_franchisor: Boolean,
    }) => ThunkAction,
    onDone?: () => void,
    onError?: () => void,
    onSuccess?: (response: unknown) => void,
  },
  noStorageClearOnError?: boolean,
) {
  return async (dispatch: Dispatch) => {
    dispatch(initiatedLogin(username));

    try {
      const response = await loginAPI(username, password);
      const { token } = response.data;

      if (!token) {
        throw new Error('No token');
      }
      dispatch(fetchAccessLevel(token, options));
      options?.onDone?.(response.data);
    } catch (err) {
      if (!noStorageClearOnError) {
        dispatch(errorLogin());
      }
      if (!err.status) {
        dispatch(networkError(err));
      }
      options?.onError?.();
      if (options && options.onDone) options.onDone();
    }
  };
}

function checkEmailExistsLoading(loading: boolean) {
  return { type: types.CHECK_EMAIL_EXISTS_LOADING, loading };
}

function checkEmailExistsError(error?: Error) {
  return { type: types.CHECK_EMAIL_EXISTS_ERROR, error };
}

function checkEmailExistsSuccess(exists: boolean) {
  return { type: types.CHECK_EMAIL_EXISTS_SUCCESS, exists };
}

export function checkEmailExists(email: string, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(checkEmailExistsLoading(true));
    try {
      const response = await checkEmailExistsAPI(email);
      dispatch(checkEmailExistsSuccess(response.data.exists));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(checkEmailExistsError(error));
      dispatch(checkEmailExistsSuccess(false));
      if (options && options.onError) options.onError();
    }
    dispatch(checkEmailExistsLoading(false));
  };
}

export const stampLastPlatformSubscriptionWarningDateSuccess = createAction(
  'STAMP_PLATFORM_SUBSCRIPTION_LAST_WARNING_DATE_SUCCESS',
);

export function stampLastPlatformSubscriptionWarningDateAction(
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(
        stampLastPlatformSubscriptionWarningDateSuccess(DateTime.now().toISO()),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      if (options && options.onError) options.onError();
    }
  };
}

export const stampLastPlatformSubscriptionDisputeWarningDateSuccess =
  createAction('STAMP_PLATFORM_SUBSCRIPTION_LAST_DISPUTE_WARNING_DATE_SUCCESS');

export function stampLastPlatformSubscriptionDisputeWarningDateAction(
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(
        stampLastPlatformSubscriptionDisputeWarningDateSuccess(
          DateTime.now().toISO(),
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      if (options && options.onError) options.onError();
    }
  };
}

export const stampLastStripeAccountConfigurationWarningDateSuccess =
  createAction('STAMP_STRIPE_CONFIGURATION_LAST_WARNING_DATE_SUCCESS');

export function stampLastStripeAccountConfigurationWarningDateAction(
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(
        stampLastStripeAccountConfigurationWarningDateSuccess(
          DateTime.now().toISO(),
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      if (options && options.onError) options.onError();
    }
  };
}

function setLogin(
  {
    id,
    username,
    token,
    is_manager,
    is_consumer,
    is_franchisor,
    is_coach,
    role,
    franchise_role,
    franchise_role_identifier,
    coaches_selected_in_role,
    establishments_selected_in_role,
    allowed_franchisees,
    name,
    has_completed_account_configuration_on_boarding,
    email_confirmed,
    has_enabled_revamped_backoffice,
  }: {
    id: number,
    username: string,
    token: string,
    is_manager: boolean,
    is_consumer: boolean,
    is_franchisor: boolean,
    is_coach: boolean,
    role: number,
    franchise_role: number,
    franchise_role_identifier: number | null,
    coaches_selected_in_role: number[],
    establishments_selected_in_role: number[],
    allowed_franchisees: number[],
    name: string,
    has_completed_account_configuration_on_boarding: boolean,
    email_confirmed: boolean,
    has_enabled_revamped_backoffice: boolean,
  },
  context?: { accessLevel?: boolean },
) {
  return {
    type: types.LOGIN_SUCCESSFUL,
    id,
    username,
    name: name || '',
    token,
    role,
    franchise_role,
    franchise_role_identifier,
    coaches_selected_in_role,
    establishments_selected_in_role,
    allowed_franchisees,
    is_manager,
    is_coach,
    is_consumer,
    is_franchisor,
    has_completed_account_configuration_on_boarding,
    context,
    email_confirmed,
    has_enabled_revamped_backoffice,
  };
}

function isLoadingResetLogin(payload) {
  return { type: types.PASSWORD_RESET_LOADING, payload };
}

function errorResetLogin(payload) {
  return { type: types.PASSWORD_RESET_ERROR, payload };
}

function resetPasswordSent(payload) {
  return { type: types.RESET_PASSWORD_SENT, payload };
}

function emailConfirmationSent(payload) {
  return { type: types.EMAIL_CONFIRMATION_SENT, payload };
}

function emailConfirmed(payload) {
  return { type: types.EMAIL_CONFIRMED, payload };
}

export function updateRevampedBackofficeEnabled(nextValue: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: types.UPDATE_HAS_ENABLED_REVAMPED_BACKOFFICE,
      payload: nextValue,
    });
  };
}

export function enableRevampedBackoffice() {
  return async (dispatch: Dispatch) => {
    try {
      const response = await toggleRevampedBackofficeAPI();
      dispatch({
        type: types.UPDATE_HAS_ENABLED_REVAMPED_BACKOFFICE,
        payload: response.data.has_enabled_revamped_backoffice,
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export function resetPassword(
  email: string,
  membership?: number,
  franchisor?: number,
  options: any,
) {
  return async (dispatch: Dispatch) => {
    dispatch(errorResetLogin(null));
    dispatch(isLoadingResetLogin(true));
    try {
      const response = await resetPasswordAPI(email, membership, franchisor);
      dispatch(resetPasswordSent(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      dispatch(errorResetLogin(err));
      if (options && options.onError) options.onError();
    }
    dispatch(isLoadingResetLogin(false));
  };
}

export function sendEmailForConfirmation(
  companyId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await sendEmailForConfirmationAPI(companyId);
      dispatch(emailConfirmationSent(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      if (options && options.onError) options.onError();
    }
  };
}

export function requestConfirmationEmail(
  uuid: string,
  company: number,
  options: any,
) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await confirmEmailAPI(uuid);
      dispatch(emailConfirmed(response.data));
      dispatch(push(`/welcome/${company}/`));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      if (options && options.onError) options.onError();
    }
  };
}

export function errorLogin() {
  return { type: types.LOGIN_FAILED };
}

export function initiatedLogin(username: string) {
  return { type: types.LOGIN_INITIATED, username };
}

export function disconnect(callback) {
  return async (dispatch: Dispatch) => {
    try {
      Sentry.configureScope((scope) => {
        scope.setUser({ email: '' });
      });
    } catch (err) {
      console.error(err);
    }
    removeItemInStorage('local', STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN);
    removeItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_URL);
    removeItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_LEFT_URL);
    onboardingManagerClient.logOutUser();
    dispatch((() => ({ type: types.DISCONNECT }))());
    if (callback && typeof callback === 'function') callback();
  };
}

export function goToLastCompanySignup() {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getEmailValidationStatus();
      dispatch(push(`/login/?membership=${response.data.membership}`));
    } catch (err) {
      console.error(err);
    }
  };
}

function impersonateManagerLoading(loading: boolean) {
  return { type: types.IMPERSONATE_MANAGER_LOADING, loading };
}

export function navigateAsCompanyAdmin(
  companyId: number,
  url?: string,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(impersonateManagerLoading(true));
      const franchiseConnexionToken = getAuthToken();

      const response = await impersonateAdminAPI({
        token: franchiseConnexionToken,
        companyId,
      });

      const newToken = response.data.token;

      if (!newToken) {
        throw new Error('No token');
      }

      const actualLanguage = getItemInStorage(
        'local',
        STORAGE_KEY_BSPORT_I18NEXTLNG,
      );
      setItemInStorage(
        'session',
        STORAGE_KEY_BSPORT_I18NEXTLNG_ORIGIN,
        actualLanguage,
      );
      setItemInStorage(
        'session',
        STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
        franchiseConnexionToken,
      );

      const { data } = await accessLevelAPI(newToken);

      dispatch((() => ({ type: types.RESET_STORE }))());

      // Set new access level
      await dispatch(
        setLogin({
          ...data,
          token: newToken,
        }),
      );

      dispatch(impersonateManagerLoading(false));
      if (url != null) {
        dispatch(push(url));
      }

      if (typeof options?.onSuccess === 'function') {
        options?.onSuccess();
      }
      return;
    } catch (err) {
      // Disconnect to avoid users stuck in a loop
      dispatch((() => ({ type: types.DISCONNECT }))());

      dispatch(snackbarError('signup.changeWorkspaceError'));
      options?.onError();
      dispatch(errorLogin());
    }
  };
}

function clearSessionStorageOnDeImpersonating() {
  removeItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_I18NEXTLNG);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_STRIPE_PK_KEY);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_CODE);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_CURRENCY_DISPLAY);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_STRIPE_REGION);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_PAYMENT_COMPANY_COUNTRY);
  removeItemInStorage('session', STORAGE_KEY_BSPORT_DISPLAY_PASS_CREDIT_FACTOR);
}

export function navigateBackToFranchise() {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(impersonateManagerLoading(true));

      const newToken = getItemInStorage(
        'session',
        STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
      );
      const originUrl = getItemInStorage(
        'session',
        STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_URL,
      );

      const { data } = await accessLevelAPI(newToken);

      clearSessionStorageOnDeImpersonating();

      dispatch((() => ({ type: types.RESET_STORE }))());

      // Set new access level
      await dispatch(
        setLogin({
          ...data,
          token: newToken,
        }),
      );
      i18n.changeLanguage(
        getItemInStorage('session', STORAGE_KEY_BSPORT_I18NEXTLNG_ORIGIN),
      );
      removeItemInStorage('session', STORAGE_KEY_BSPORT_I18NEXTLNG_ORIGIN);
      removeItemInStorage(
        'session',
        STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_URL,
      );
      removeItemInStorage('session', STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN);

      dispatch(impersonateManagerLoading(false));
      dispatch(push(originUrl));

      return;
    } catch (err) {
      // Disconnect to avoid users stuck in a loop
      dispatch((() => ({ type: types.DISCONNECT }))());

      dispatch(snackbarError('signup.changeWorkspaceError'));
      dispatch(errorLogin());
    }
  };
}

export function navigateToRelationAccount(
  params: { relatedMemberId: number, company: number, companyName?: string },
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    try {
      const masterToken = getAuthToken();

      const response = await getRelationTokenAPI({
        company: params.company,
        relatedMemberId: params.relatedMemberId,
      });

      const newToken = response.data.token;

      if (!newToken) {
        throw new Error('No token');
      }
      setItemInStorage(
        'local',
        STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN,
        masterToken,
      );

      const { data } = await accessLevelAPI(newToken);
      dispatch((() => ({ type: types.RESET_STORE }))());

      // Set new access level
      await dispatch(
        setLogin({
          ...data,
          token: newToken,
        }),
      );

      if (params.companyName) {
        const marketplaceUrl = urlToMarketplace(
          params.companyName,
          params.company,
        );
        dispatch(push('/c/'));
        dispatch(push(marketplaceUrl));
      } else {
        const marketplaceUrl = urlToMarketplace('aaa', params.company);
        dispatch(push('/c/'));
        dispatch(push(marketplaceUrl));
      }
    } catch (err) {
      // Disconnect to avoid users stuck in a loop
      dispatch((() => ({ type: types.DISCONNECT }))());
      switch (err?.response?.data?.error_code) {
        case RELATIONMISSPARAMETERS:
          dispatch(
            snackbarError(
              `relationship.error.${String(RELATIONMISSPARAMETERS)}`,
            ),
          );
          break;
        case TOKENISUNDEFINED:
          dispatch(
            snackbarError(`relationship.error.${String(TOKENISUNDEFINED)}`),
          );
          break;
        case MEMBERISNOTAUTHORIZEDTOACCESSACCOUNT:
          dispatch(
            snackbarError(
              `relationship.error.${String(
                MEMBERISNOTAUTHORIZEDTOACCESSACCOUNT,
              )}`,
            ),
          );
          break;
        default:
          dispatch(snackbarError('signup.changeWorkspaceError'));
          break;
      }

      options?.onError();
      dispatch(errorLogin());
    }
  };
}

export function navigateBackToMasterRelation(params: {
  company: number,
  companyName: string,
}) {
  return async (dispatch: Dispatch) => {
    try {
      const newToken = getItemInStorage(
        'local',
        STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN,
      );

      const originUrl = getItemInStorage(
        'session',
        STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_URL,
      );

      const { data } = await accessLevelAPI(newToken);

      removeItemInStorage('local', STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN);
      dispatch((() => ({ type: types.RESET_STORE }))());

      // Set new access level
      await dispatch(
        setLogin({
          ...data,
          token: newToken,
        }),
      );

      if (params.companyName) {
        const marketplaceUrl = urlToMarketplace(
          params.companyName,
          params.company,
        );
        dispatch(push('/c/'));
        dispatch(push(marketplaceUrl));
      } else {
        const marketplaceUrl = urlToMarketplace('aaa', params.company);
        dispatch(push('/c/'));
        dispatch(push(marketplaceUrl));
      }
    } catch (err) {
      // Disconnect to avoid users stuck in a loop
      dispatch((() => ({ type: types.DISCONNECT }))());

      dispatch(snackbarError('signup.changeWorkspaceError'));
      dispatch(errorLogin());
    }
  };
}
