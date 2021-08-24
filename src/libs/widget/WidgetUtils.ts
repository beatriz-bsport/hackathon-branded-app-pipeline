import { WidgetMessageType } from './types';

export class WidgetUtils {
  static setWidgetContext() {
    // @ts-ignore
    window.env.APP_CONTEXT = 'widget';
  }

  static isWidget() {
    // @ts-ignore
    return window && window.env && window.env.APP_CONTEXT === 'widget';
  }

  private static postMessage(data: any) {
    if (window.opener && window.opener.postMessage) {
      window.opener.postMessage({ ...data }, '*');
    }
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({ ...data }, '*');
    }
  }

  static paymentSuccess() {
    WidgetUtils.postMessage({ type: WidgetMessageType.PAYMENT_SUCCESS });
  }

  static authenticatedStatusReady() {
    WidgetUtils.postMessage({
      type: WidgetMessageType.AUTHENTICATED_STATUS_READY,
    });
  }

  static basketCountReady() {
    WidgetUtils.postMessage({ type: WidgetMessageType.BASKET_COUNT_READY });
  }

  static bookingsCountReady() {
    WidgetUtils.postMessage({ type: WidgetMessageType.BOOKINGS_COUNT_READY });
  }

  static authenticatedStatus(authenticated: boolean, username: string) {
    WidgetUtils.postMessage({
      type: WidgetMessageType.AUTHENTICATED_STATUS,
      authenticated,
      username,
    });
  }

  static basketCount(count: number) {
    WidgetUtils.postMessage({ type: WidgetMessageType.BASKET_COUNT, count });
  }

  static bookingsCount(count: number) {
    WidgetUtils.postMessage({ type: WidgetMessageType.BOOKINGS_COUNT, count });
  }

  static onLoginSuccess(username: string) {
    WidgetUtils.postMessage({
      type: WidgetMessageType.LOGIN_SUCCESS,
      payload: { username },
    });
  }
}

export default WidgetUtils;
