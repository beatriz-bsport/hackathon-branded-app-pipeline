import Immutable from 'seamless-immutable';

import { setAuthToken } from '../http';
import actionTypes from '../actions/auth.types';
import {
  stampLastPlatformSubscriptionWarningDateSuccess,
  stampLastStripeAccountConfigurationWarningDateSuccess,
} from '../actions/auth.actions';

const initialState = Immutable({
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
  invalidFields: null,
  has_completed_account_configuration_on_boarding: false,
  role: null,
  franchise_role: null,
  franchise_role_identifier: null,
  coaches_selected_in_role: null,
  allowed_franchisees: [],
  loadingImpersonation: false,
  lastPlatformSubscriptionWarningDate: null,
  lastStripeConfigurationWarningDate: null,

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
    case actionTypes.LOGIN_SUCCESSFUL: {
      const {
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
        allowed_franchisees,
        name,
        has_completed_account_configuration_on_boarding,
        context,
      } = action;

      setAuthToken(token);
      let res = state;
      if (!context?.accessLevel) {
        res = state
          .set('lastStripeConfigurationWarningDate', null)
          .set('lastPlatformSubscriptionWarningDate', null);
      }
      return res
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
        .set('allowed_franchisees', allowed_franchisees)
        .set('franchise_role_identifier', franchise_role_identifier)
        .set(
          'has_completed_account_configuration_on_boarding',
          has_completed_account_configuration_on_boarding,
        );
    }

    case actionTypes.CHECK_ACCESS_LEVEL: {
      const {
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
      } = action.payload;

      return state.setIn(['doubleConnexion', storingKey], {
        username,
        is_manager,
        is_coach,
        is_consumer,
        is_franchisor,
        role,
        franchise_role,
        franchise_role_identifier,
        name,
      });
    }

    case actionTypes.LOGIN_FAILED:
      return state
        .set('username', '')
        .set('token', '')
        .set('authenticated', false)
        .set('error', true)
        .set('invalidFields', action.invalidFields)
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

    case stampLastStripeAccountConfigurationWarningDateSuccess.toString():
      return state.setIn(
        ['lastStripeConfigurationWarningDate'],
        action.payload,
      );
    case actionTypes.IMPERSONATE_MANAGER_LOADING:
      return state.set(['loadingImpersonation'], action.loading);
    default:
      return state;
  }
}
