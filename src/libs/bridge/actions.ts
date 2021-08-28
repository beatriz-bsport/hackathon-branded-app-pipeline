import { WidgetMessageType } from 'bsport-saas/src/libs/widget/types';

import { snackbarSuccess } from 'bsport-saas/src/actions/snackbar.actions';
import { createAction } from 'redux-actions';

import { refreshVODRequestAccessFlagAction } from '../../actions/widget';

import { closeUserInteractionPortal } from '../modal/actions';

import { RootState } from '../../reducers';

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
    if (getState().bridge.authentication.loading) return;
    dispatch(authenticationStatusActions.isLoading(true));
    dispatch(authenticationStatusActions.error(null));
    sendBridgeMessage(WidgetMessageType.REQUEST_AUTHENTICATED_STATUS);
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
    if (getState().bridge.authentication.loading) return;
    sendBridgeMessage(WidgetMessageType.REQUEST_LOGOUT);
  };
}

// Internal Actions to mutate the reducer
// --------------------------------------
export const authenticationStatusActions = {
  success: createAction('BRIDGE/AUTHENTICATION/SUCCESS'),
  isLoading: createAction('BRIDGE/AUTHENTICATION/LOADING'),
  error: createAction('BRIDGE/AUTHENTICATION/ERROR'),
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

// Second part: how to handle messages
// -----------------------------------

export const handleBridgeMessage = (eventData: any) => (dispatch: any) => {
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

      dispatch(authenticationStatusActions.isLoading(false));

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

    case WidgetMessageType.RESPONSE_BOOKINGS_COUNT:
      dispatch(bookingCountActions.success(eventData.count));
      dispatch(bookingCountActions.isLoading(false));
      dispatch(bookingCountActions.error(null));
      break;

    case WidgetMessageType.RESPONSE_PAYMENT_SUCCESS:
      dispatch(closeUserInteractionPortal());
      dispatch(refreshVODRequestAccessFlagAction());
      dispatch(snackbarSuccess('snackbar:consumerPass.success'));
      break;

    default:
      break;
  }
};
