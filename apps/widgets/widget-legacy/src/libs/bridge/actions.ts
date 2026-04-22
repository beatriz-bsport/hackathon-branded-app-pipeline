import { WidgetMessageType } from '@bsport/saas-legacy/src/libs/widget/types';
import {
  sendBridgeMessage,
  sendBridgeMessageWithRetry,
  broadcastToAllWidgets,
} from '@bsport/saas-legacy/src/libs/widget/bridge';

import { createAction } from 'redux-actions';

import { closeUserInteractionPortal } from '../modal/actions';

import {
  responseAuthenticatedStatus,
  // @ts-expect-error: import of js file
} from '@bsport/saas-legacy/src/actions/auth.actions';
import { invalidateWidgetData } from '../widget/actions';
import { disconnectWidget } from '../../reducers/actions';

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
    broadcastToAllWidgets({ type: WidgetMessageType.DISCONNECT });
  };
}

// Internal Actions to mutate the reducer
// --------------------------------------
export const authenticationStatusActions = {
  success: createAction('BRIDGE/AUTHENTICATION/SUCCESS'),
  hasBeenReceived: createAction('BRIDGE/AUTHENTICATION/RECEIVED'),
  error: createAction('BRIDGE/AUTHENTICATION/ERROR'),
};

// Second part: how to handle messages
// -----------------------------------

type UnhandledEventData = {
  type: WidgetMessageType;
  authenticated?: unknown;
  count?: unknown;
  data?: {
    videoId: unknown;
    playbackUrl: unknown;
    accessDenied: unknown;
    closeModal?: boolean;
  };
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
        dispatch(invalidateWidgetData());
        break;

      case WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS:
        dispatch(responseAuthenticatedStatus(eventData.data?.authenticated));
        break;

      case WidgetMessageType.IFRAME_LOGOUT:
        dispatch(bridgeRequestLogout());
        break;

      case WidgetMessageType.DISCONNECT:
        dispatch(disconnectWidget());
        // `disconnectWidget` resets the whole store (theme aside), which
        // includes the `widget` slice — so `dataVersion` goes back to 0.
        // Bump it to 1 so widgets keyed/triggered on `dataVersion` detect
        // the change and refetch their (now logged-out) data.
        dispatch(invalidateWidgetData());
        break;

      case WidgetMessageType.VIDEO_REGISTERED:
        dispatch(closeUserInteractionPortal());
        dispatch(invalidateWidgetData());
        break;

      case WidgetMessageType.PAYMENT_SUCCESS:
        dispatch(invalidateWidgetData());
        break;

      case WidgetMessageType.CLOSE_MODAL:
        dispatch(closeUserInteractionPortal());
        break;
    }
  };
