import { ActionFunctionAny } from 'redux-actions';
import { Action } from 'redux';
import { OptionCallback, ThunkAction } from '../../state/types';

export enum WidgetMessageType {
  IFRAME_LOGIN_SUCCESS = 'IFRAME_LOGIN_SUCCESS',
  IFRAME_LOGOUT = 'IFRAME_LOGOUT',
  API_REQUEST = 'API_REQUEST',
  API_ACKNOWLEDGE = 'API_ACKNOWLEDGE',
  API_SUCCESS = 'API_SUCCESS',
  API_ERROR = 'API_ERROR',
  REQUEST_LOGOUT = 'REQUEST_LOGOUT',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  CLOSE_MODAL = 'CLOSE_MODAL',
  REQUEST_AUTHENTICATED_STATUS = 'REQUEST_AUTHENTICATED_STATUS',
  RESPONSE_AUTHENTICATED_STATUS = 'RESPONSE_AUTHENTICATED_STATUS',
  VIDEO_REGISTERED = 'VIDEO_REGISTERED',
  REQUEST_PLAYBACK_URL = 'REQUEST_PLAYBACK_URL',
  RESPONSE_PLAYBACK_URL_ACCESS_DENIED = 'RESPONSE_PLAYBACK_URL_ACCESS_DENIED',
  RESPONSE_PLAYBACK_URL_ERROR = 'RESPONSE_PLAYBACK_URL_ERROR',
  RESPONSE_PLAYBACK_URL_SUCCESS = 'RESPONSE_PLAYBACK_URL_SUCCESS',
  RESPONSE_CLOSE_SUBSCRIPTION_MODAL_ON_ERROR = 'RESPONSE_CLOSE_SUBSCRIPTION_MODAL_ON_ERROR',
}

/**
 * @deprecated loading does not follow the boolean naming convention. Added to
 * have iso naming between widget and SaaS
 */

type LegacyApiCallActions = {
  success: ActionFunctionAny<Action<any>>;
  loading: ActionFunctionAny<Action<any>>;
  error: ActionFunctionAny<Action<any>>;
};

type CorrectApiCallActions = {
  success: ActionFunctionAny<Action<any>>;
  isLoading: ActionFunctionAny<Action<any>>;
  error: ActionFunctionAny<Action<any>>;
};

export type CallAction<A, R> = (
  args: A,
  options?: OptionCallback<R>,
) => ThunkAction;

export type ApiCallActions =
  | (CorrectApiCallActions | LegacyApiCallActions) & {
      reset?: ActionFunctionAny<Action<any>>;
      set?: ActionFunctionAny<Action<any>>;
    };
