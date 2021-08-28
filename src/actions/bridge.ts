import { WidgetMessageType } from 'bsport-saas/src/libs/widget/types';

import { snackbarSuccess } from 'bsport-saas/src/actions/snackbar.actions';

import {
  setSaasAuthenticated,
  setSaasBookingsCount,
  setSaasBasketCount,
  refreshVODRequestAccessFlagAction,
} from './widget';

import { closeUserInteractionPortal } from './modal';

// First part: how to send message
// ---------------------------------

const sendBridgeMessage = (type: WidgetMessageType, data?: any) => {
  const iframe = document.getElementById('@bsport-bridge-iframe');
  // @ts-ignore
  if (iframe && iframe.contentWindow) {
    console.log('send bridge request: ', type);
    // @ts-ignore
    try {
      iframe.contentWindow.postMessage({ type, data }, '*');
    } catch (err) {
      console.log('fuck');
      console.error(err);
    }
  }
};

export const bridgeRequestAuthenticationStatus = () =>
  sendBridgeMessage(WidgetMessageType.REQUEST_AUTHENTICATED_STATUS);

export const bridgetRequestBasketCount = () =>
  sendBridgeMessage(WidgetMessageType.REQUEST_BASKET_COUNT);

export const bridgetRequestBookingCount = () =>
  sendBridgeMessage(WidgetMessageType.REQUEST_BOOKINGS_COUNT);

export const bridgeRequestLogout = () =>
  sendBridgeMessage(WidgetMessageType.REQUEST_LOGOUT);

// Second part: how to handle messages
// -----------------------------------

export const handleBridgeMessage = (eventData: any) => (dispatch: any) => {
  if (eventData.source === 'bsport') {
    console.log('received bridge response: ', eventData.type, eventData);
  }
  switch (eventData.type) {
    case WidgetMessageType.RESPONSE_LOGIN_SUCCESS:
      dispatch(closeUserInteractionPortal());
      break;

    case WidgetMessageType.RESPONSE_AUTHENTICATED_STATUS:
      dispatch(
        setSaasAuthenticated({
          authenticated: eventData.authenticated,
          username: eventData && eventData.username,
        }),
      );
      if (!eventData.authenticated) {
        dispatch(setSaasBookingsCount(null));
        dispatch(setSaasBasketCount(null));
      }
      break;

    case WidgetMessageType.RESPONSE_BASKET_COUNT:
      dispatch(setSaasBasketCount(eventData.count));
      break;

    case WidgetMessageType.RESPONSE_BOOKINGS_COUNT:
      dispatch(setSaasBookingsCount(eventData.count));
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
