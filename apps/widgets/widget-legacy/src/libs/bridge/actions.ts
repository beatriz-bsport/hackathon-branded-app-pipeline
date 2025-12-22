import { WidgetMessageType } from '@bsport/saas-legacy/src/libs/widget/types';
import {
  sendBridgeMessage,
  sendBridgeMessageWithRetry,
} from '@bsport/saas-legacy/src/libs/widget/bridge';

import { createAction } from 'redux-actions';

import { closeUserInteractionPortal } from '../modal/actions';

import {
  disconnect,
  responseAuthenticatedStatus,
  // @ts-expect-error: import of js file
} from '@bsport/saas-legacy/src/actions/auth.actions';

// First part: how to send message
// ---------------------------------

export function bridgeRequestAuthenticationStatus() {
  return async (dispatch: any) => {
    dispatch(authenticationStatusActions.error(null));
    sendBridgeMessageWithRetry({
      type: WidgetMessageType.REQUEST_AUTHENTICATED_STATUS,
    });
  };
}

export function bridgeRequestLogout() {
  return async (dispatch: any) => {
    sendBridgeMessage({ type: WidgetMessageType.REQUEST_LOGOUT });
    dispatch(disconnect());
  };
}

export function bridgeRequestVideoPlaybackUrl(videoId: number) {
  return async (dispatch: any) => {
    dispatch(getVideoPlaybackUrlActions.isLoading(true));
    dispatch(getVideoPlaybackUrlActions.error(null));
    dispatch(getVideoPlaybackUrlActions.accessDenied(false));
    sendBridgeMessage({
      type: WidgetMessageType.REQUEST_PLAYBACK_URL,
      data: { videoId },
    });
  };
}

// Internal Actions to mutate the reducer
// --------------------------------------
export const authenticationStatusActions = {
  success: createAction('BRIDGE/AUTHENTICATION/SUCCESS'),
  hasBeenReceived: createAction('BRIDGE/AUTHENTICATION/RECEIVED'),
  error: createAction('BRIDGE/AUTHENTICATION/ERROR'),
};

export const getVideoPlaybackUrlActions = {
  success: createAction('VIDEO/PLAYBACK_URL/SUCCESS'),
  isLoading: createAction('VIDEO/PLAYBACK_URL/LOADING'),
  error: createAction('VIDEO/PLAYBACK_URL/ERROR'),
  accessDenied: createAction('VIDEO/PLAYBACK_URL/ACCESS_DENIED'),
};

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

type EventData = UnhandledEventData;

export const handleBridgeMessage =
  (eventData: EventData) => (dispatch: any) => {
    switch (eventData.type) {
      case WidgetMessageType.IFRAME_LOGIN_SUCCESS:
        dispatch(responseAuthenticatedStatus(true));
        dispatch(closeUserInteractionPortal());
        break;

      case WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS:
        dispatch(responseAuthenticatedStatus(eventData.data?.authenticated));
        break;

      case WidgetMessageType.IFRAME_LOGOUT:
        dispatch(disconnect());
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
    }
  };
