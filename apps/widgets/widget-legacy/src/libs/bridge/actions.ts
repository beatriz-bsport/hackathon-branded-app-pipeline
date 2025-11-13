import {
  WidgetApiMessageType,
  WidgetMessageType,
  widgetApiMessageTypes,
} from '@bsport/saas-legacy/src/libs/widget/types';

import { snackbarSuccess } from '@bsport/saas-legacy/src/actions/snackbar.actions';
import { createAction } from 'redux-actions';

import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import type { OptionCallback } from '@bsport/saas-legacy/src/state/types';

import { closeUserInteractionPortal } from '../modal/actions';

import { RootState } from '../../reducers';
import { apiCallHandler } from './callHandler';

import { actionsBinder } from './actionsBinder';

// First part: how to send message
// ---------------------------------

const sendBridgeMessage = (type: WidgetMessageType, data?: any) => {
  const iframe = document.getElementById('@bsport-bridge-iframe');

  // @ts-ignore
  if (iframe && iframe.contentWindow) {
    try {
      // @ts-ignore
      iframe.contentWindow.postMessage({ type, data }, '*');
    } catch (err) {
      console.error(err);
    }
  }
};

export function bridgeRequestAuthenticationStatus() {
  return async (dispatch: any, getState: () => RootState) => {
    if (getState().bridge.authentication.hasBeenReceived) return;
    dispatch(authenticationStatusActions.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_AUTHENTICATED_STATUS);
  };
}

export function bridgeRequestRegisteredOfferIdList() {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.authenticated) return;
    dispatch(listRegisteredIds.isLoading(true));
    dispatch(listRegisteredIds.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_REGISTERED_OFFER_IDS);
  };
}

export function bridgeRequestBasketCount() {
  return async (dispatch: any, getState: () => RootState) => {
    if (getState().bridge.basket.loading) return;
    dispatch(basketCountActions.isLoading(true));
    dispatch(basketCountActions.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_BASKET_COUNT);
  };
}

export function bridgeRequestBookingCount() {
  return async (dispatch: any, getState: () => RootState) => {
    if (getState().bridge.booking.loading) return;
    dispatch(bookingCountActions.isLoading(true));
    dispatch(bookingCountActions.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_BOOKINGS_COUNT);
  };
}

export function bridgeRequestLogout() {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    sendBridgeMessage(WidgetMessageType.REQUEST_LOGOUT);
  };
}

export function bridgeRequestMemberTag() {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    dispatch(memberTagActions.isLoading(true));
    dispatch(memberTagActions.error(null));
    setTimeout(
      () => sendBridgeMessage(WidgetMessageType.REQUEST_MEMBER_TAG),
      3000,
    );
  };
}

export function bridgeRequestVideoPlaybackUrl(videoId: number) {
  return async (dispatch: any, getState: () => RootState) => {
    if (!getState().bridge.authentication.hasBeenReceived) return;
    dispatch(getVideoPlaybackUrlActions.isLoading(true));
    dispatch(getVideoPlaybackUrlActions.error(null));
    dispatch(getVideoPlaybackUrlActions.accessDenied(false));
    sendBridgeMessage(WidgetMessageType.REQUEST_PLAYBACK_URL, { videoId });
  };
}

// ----- Universal actions using the new queryClient (callHandler) -----

/**
 * This function is used to create a bridge action that requires authentication
 * @param type action type, used to identify the action in the bridge
 */

export const createAuthenticatedBridgeAction =
  <T, R>(type: WidgetApiMessageType) =>
  (args: T, options?: OptionCallback<R>) => {
    return async (
      dispatch: ThunkDispatch<RootState, unknown, Action<unknown>>,
      getState: () => RootState,
    ) => {
      if (!getState().bridge.authentication.hasBeenReceived) return;

      apiCallHandler.sendRequest({
        payload: { args, options },
        dispatch,
        type,
      });
    };
  };

/**
 * This function is used to create a bridge action that does not require authentication
 * @param type action type, used to identify the action in the bridge
 */

export const createFreeBridgeAction =
  <T, R>(type: WidgetApiMessageType) =>
  (args: T, options?: OptionCallback<R>) => {
    return async (
      dispatch: ThunkDispatch<RootState, unknown, Action<unknown>>,
    ) => {
      apiCallHandler.sendRequest({
        payload: { args, options },
        dispatch,
        type,
      });
    };
  };

// Internal Actions to mutate the reducer
// --------------------------------------
export const authenticationStatusActions = {
  success: createAction('BRIDGE/AUTHENTICATION/SUCCESS'),
  hasBeenReceived: createAction('BRIDGE/AUTHENTICATION/RECEIVED'),
  error: createAction('BRIDGE/AUTHENTICATION/ERROR'),
};

export const listRegisteredIds = {
  success: createAction('BRIDGE/LIST_REGISTERED/SUCCESS'),
  error: createAction('BRIDGE/LIST_REGISTERED/ERROR'),
  isLoading: createAction('BRIDGE/LIST_REGISTERED/IS_LOADING'),
};

export const bookingCountActions = {
  success: createAction('BRIDGE/BOOKING_COUNT/SUCCESS'),
  isLoading: createAction('BRIDGE/BOOKING_COUNT/LOADING'),
  error: createAction('BRIDGE/BOOKING_COUNT/ERROR'),
};

export const basketCountActions = {
  success: createAction('BRIDGE/BASKET_COUNT/SUCCESS'),
  isLoading: createAction('BRIDGE/BASKET_COUNT/LOADING'),
  error: createAction('BRIDGE/BASKET_COUNT/ERROR'),
};

export const memberTagActions = {
  success: createAction('MEMBER_TAG/GET/SUCCESS'),
  isLoading: createAction('MEMBER_TAG/GET/LOADING'),
  error: createAction('MEMBER_TAG/GET/ERROR'),
};
export const getVideoPlaybackUrlActions = {
  success: createAction('VIDEO/PLAYBACK_URL/SUCCESS'),
  isLoading: createAction('VIDEO/PLAYBACK_URL/LOADING'),
  error: createAction('VIDEO/PLAYBACK_URL/ERROR'),
  accessDenied: createAction('VIDEO/PLAYBACK_URL/ACCESS_DENIED'),
};

actionsBinder();

// Second part: how to handle messages
// -----------------------------------

type UnhandledEventData = {
  type: WidgetMessageType;
  authenticated?: unknown;
  count?: unknown;
  data?: { videoId: unknown; playbackUrl: unknown; accessDenied: unknown };
  offer_ids?: unknown;
  username?: unknown;
  videoId?: number;
};

export type HandledEventData = {
  type: WidgetApiMessageType;
  data: unknown;
  error?: Error;
};

type EventData = HandledEventData | UnhandledEventData;

export const handleBridgeMessage =
  (eventData: EventData) => (dispatch: any) => {
    switch (eventData.type) {
      case WidgetMessageType.RESPONSE_LOGIN_SUCCESS:
        dispatch(closeUserInteractionPortal());
        break;

      case WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS:
        dispatch(
          authenticationStatusActions.success({
            authenticated: eventData.authenticated,
            username: eventData && eventData.username,
          }),
        );

        dispatch(authenticationStatusActions.hasBeenReceived(true));

        if (!eventData.authenticated) {
          dispatch(basketCountActions.success(null));
          dispatch(bookingCountActions.success(null));
        }
        break;

      case WidgetMessageType.RESPONSE_BASKET_COUNT:
        dispatch(basketCountActions.success(eventData.count));
        dispatch(basketCountActions.isLoading(false));
        dispatch(basketCountActions.error(null));
        break;

      case WidgetMessageType.RESPONSE_REGISTERED_OFFER_IDS:
        dispatch(listRegisteredIds.success(eventData.offer_ids));
        dispatch(listRegisteredIds.isLoading(false));
        dispatch(listRegisteredIds.error(null));
        break;

      case WidgetMessageType.RESPONSE_BOOKINGS_COUNT:
        dispatch(bookingCountActions.success(eventData.count));
        dispatch(bookingCountActions.isLoading(false));
        dispatch(bookingCountActions.error(null));
        break;

      case WidgetMessageType.RESPONSE_PAYMENT_SUCCESS:
      case WidgetMessageType.PAYMENT_SUCCESS:
        dispatch(closeUserInteractionPortal());
        dispatch(snackbarSuccess('snackbar:consumerPass.success'));
        dispatch(bridgeRequestRegisteredOfferIdList());
        break;

      case WidgetMessageType.REQUEST_MEMBER_TAG:
        dispatch(memberTagActions.success(eventData));
        dispatch(memberTagActions.isLoading(false));
        dispatch(memberTagActions.error(null));
        break;

      case WidgetMessageType.VIDEO_REGISTERED:
        dispatch(closeUserInteractionPortal());
        dispatch(bridgeRequestVideoPlaybackUrl(eventData.videoId));
        break;
      case WidgetMessageType.RESPONSE_PLAYBACK_URL_ACCESS_DENIED:
        if (
          eventData.data?.accessDenied === false ||
          eventData.data?.accessDenied === true
        ) {
          dispatch(
            getVideoPlaybackUrlActions.accessDenied(
              eventData.data.accessDenied,
            ),
          );
        }
        break;
      case WidgetMessageType.RESPONSE_PLAYBACK_URL_ERROR:
        dispatch(
          getVideoPlaybackUrlActions.success({
            videoId: eventData.data.videoId,
            playbackUrl: '',
          }),
        );
        dispatch(getVideoPlaybackUrlActions.isLoading(false));
        dispatch(getVideoPlaybackUrlActions.error(null));
        break;

      case WidgetMessageType.RESPONSE_PLAYBACK_URL_SUCCESS:
        if (eventData.data?.playbackUrl) {
          dispatch(
            getVideoPlaybackUrlActions.success({
              videoId: eventData.data.videoId,
              playbackUrl: eventData.data.playbackUrl,
            }),
          );
          dispatch(closeUserInteractionPortal());
        }
        dispatch(getVideoPlaybackUrlActions.isLoading(false));
        dispatch(getVideoPlaybackUrlActions.error(null));
        break;

      case WidgetMessageType.RESPONSE_CLOSE_SUBSCRIPTION_MODAL_ON_ERROR:
        dispatch(closeUserInteractionPortal());
        break;

      case WidgetMessageType.CLOSE_MODAL:
        dispatch(closeUserInteractionPortal());
        break;

      default:
        // @ts-expect-error type narrowing issues that will be fixed once refactor complete
        if (widgetApiMessageTypes.includes(eventData.type)) {
          apiCallHandler.handleResponse({
            // @ts-expect-error same
            type: eventData.type,
            dispatch,
            // @ts-expect-error same
            response: { data: eventData.data, error: eventData.error },
          });
        }
        break;
    }
  };
