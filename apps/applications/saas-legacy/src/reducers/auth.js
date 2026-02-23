import Immutable from 'seamless-immutable';
import { v4 as uuidv4 } from 'uuid';

import { validateEmailActions } from '#src/libs/login/actions';
import { removeItemInStorage } from '#src/utils/storage';
import {
  STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES,
  STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID,
} from '#src/actions/constants';
import {
  setAuthToken,
  setAccessControlBroadcastsChannelId,
  getAccessControlBroadcastsChannelId,
} from '../http';
import { authActionTypes as actionTypes } from '../actions/constants';
import {
  stampLastPlatformSubscriptionWarningDateSuccess,
  stampLastPlatformSubscriptionDisputeWarningDateSuccess,
  stampLastStripeAccountConfigurationWarningDateSuccess,
} from '../actions/auth.actions';

const initialState = Immutable({
  id: null,
  username: '',
  token: '',
  authenticated: false,
  error: false,
  loading: false,
  is_manager: false,
  is_coach: false,
  is_consumer: true,
  is_franchisor: false,
  initializating: false,
  has_completed_account_configuration_on_boarding: false,
  email_confirmed: null,
  role: null,
  franchise_role: null,
  franchise_role_identifier: null,
  coaches_selected_in_role: null,
  establishments_selected_in_role: null,
  allowed_franchisees: [],
  loadingImpersonation: false,
  lastPlatformSubscriptionWarningDate: null,
  lastPlatformSubscriptionDisputeWarningDate: null,
  lastStripeConfigurationWarningDate: null,
  has_enabled_revamped_backoffice: false,

  emailExists: {
    loading: false,
    error: null,
    exists: false,
  },
  resetPassword: {
    loading: false,
    error: null,
    last_password_reset_request: null,
  },
  emailConfirmation: {
    loading: false,
    error: null,
    last_time_sent_email_confirmation: null,
  },
  doubleConnexion: {
    previous: {
      username: '',
      is_manager: false,
      is_coach: false,
      is_consumer: false,
      is_franchisor: false,
      role: null,
      name: null,
    },
    current: {
      username: '',
      is_manager: false,
      is_coach: false,
      is_consumer: false,
      is_franchisor: false,
      role: null,
      name: null,
    },
  },
});

export default function authReducers(state = initialState, action = {}) {
  switch (action.type) {
    case 'initiate':
      return state.set('initializating', action.payload);
    case actionTypes.DISCONNECT:
      setAuthToken(null);
      setAccessControlBroadcastsChannelId(null);
      removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_MEMBER_ID);
      removeItemInStorage('local', STORAGE_KEY_LIGHT_SIGNUP_FORM_VALUES);
      return initialState;

    case actionTypes.LOGIN_INITIATED:
      return state
        .set('username', action.username)
        .set('loading', true)
        .set('error', false);

    case actionTypes.PASSWORD_RESET_LOADING:
      return state.setIn(['resetPassword', 'loading'], action.payload);

    case actionTypes.PASSWORD_RESET_ERROR:
      return state.setIn(['resetPassword', 'error'], action.payload);
    case actionTypes.RESET_PASSWORD_SENT:
      return state.setIn(
        ['resetPassword', 'last_password_reset_request'],
        action.payload.last_password_reset_request,
      );
    case actionTypes.EMAIL_CONFIRMATION_SENT:
      return state.setIn(
        ['emailConfirmation', 'last_time_sent_email_confirmation'],
        action.payload.last_time_sent_email_confirmation,
      );
    case actionTypes.EMAIL_CONFIRMED:
      return state.set('email_confirmed', action.payload.email_confirmed);

    case validateEmailActions.refresh.toString():
      return state.set('email_confirmed', action.payload.email_confirmed);

    case actionTypes.LOGIN_SUCCESSFUL: {
      const {
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
        email_confirmed,
        context,
        has_enabled_revamped_backoffice,
      } = action;

      setAuthToken(token);
      // Get or generate a new channel id for the access control broadcasts
      setAccessControlBroadcastsChannelId(
        getAccessControlBroadcastsChannelId() || uuidv4(),
      );
      let res = state;
      if (!context?.accessLevel) {
        res = state
          .set('lastStripeConfigurationWarningDate', null)
          .set('lastPlatformSubscriptionDisputeWarningDate', null)
          .set('lastPlatformSubscriptionWarningDate', null);
      }
      return res
        .set('id', id)
        .set('username', username)
        .set('token', token)
        .set('name', name || '')
        .set('is_manager', is_manager)
        .set('is_coach', is_coach)
        .set('is_consumer', is_consumer)
        .set('is_franchisor', is_franchisor)
        .set('authenticated', true)
        .set('error', false)
        .set('loading', false)
        .set('role', role)
        .set('franchise_role', franchise_role)
        .set('coaches_selected_in_role', coaches_selected_in_role)
        .set('establishments_selected_in_role', establishments_selected_in_role)
        .set('allowed_franchisees', allowed_franchisees)
        .set('franchise_role_identifier', franchise_role_identifier)
        .set(
          'has_completed_account_configuration_on_boarding',
          has_completed_account_configuration_on_boarding,
        )
        .set('has_enabled_revamped_backoffice', has_enabled_revamped_backoffice)
        .set('email_confirmed', email_confirmed)
        .set('id', id);
    }

    case actionTypes.CHECK_ACCESS_LEVEL: {
      const {
        id,
        storingKey,
        username,
        is_manager,
        is_coach,
        is_consumer,
        is_franchisor,
        role,
        franchise_role,
        franchise_role_identifier,
        name,
        has_enabled_revamped_backoffice,
      } = action.payload;

      return state.setIn(['doubleConnexion', storingKey], {
        id,
        username,
        is_manager,
        is_coach,
        is_consumer,
        is_franchisor,
        role,
        franchise_role,
        franchise_role_identifier,
        name,
        has_enabled_revamped_backoffice,
      });
    }

    case actionTypes.LOGIN_FAILED:
      return state
        .set('username', '')
        .set('token', '')
        .set('authenticated', false)
        .set('error', true)
        .set('loading', false);

    case actionTypes.CHECK_EMAIL_EXISTS_LOADING:
      return state.setIn(['emailExists', 'loading'], action.loading);
    case actionTypes.CHECK_EMAIL_EXISTS_ERROR:
      return state.setIn(['emailExists', 'error'], action.error);
    case actionTypes.CHECK_EMAIL_EXISTS_SUCCESS:
      return state.setIn(['emailExists', 'exists'], action.exists);

    case stampLastPlatformSubscriptionWarningDateSuccess.toString():
      return state.setIn(
        ['lastPlatformSubscriptionWarningDate'],
        action.payload,
      );

    case stampLastPlatformSubscriptionDisputeWarningDateSuccess.toString():
      return state.setIn(
        ['lastPlatformSubscriptionDisputeWarningDate'],
        action.payload,
      );

    case stampLastStripeAccountConfigurationWarningDateSuccess.toString():
      return state.setIn(
        ['lastStripeConfigurationWarningDate'],
        action.payload,
      );
    case actionTypes.IMPERSONATE_MANAGER_LOADING:
      return state.set(['loadingImpersonation'], action.loading);

    case actionTypes.UPDATE_HAS_ENABLED_REVAMPED_BACKOFFICE:
      return state.set(['has_enabled_revamped_backoffice'], action.payload);

    case actionTypes.RESPONSE_AUTHENTICATED_STATUS:
      return state.set('authenticated', action.authenticated);

    default:
      return state;
  }
}
