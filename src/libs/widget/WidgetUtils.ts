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
      window.opener.postMessage({ ...data, source: 'bsport' }, '*');
    }
    if (window.parent && window.parent.postMessage) {
      window.parent.postMessage({ ...data, source: 'bsport' }, '*');
    }
  }

  static sendBridgeResponse(type: WidgetMessageType, data?: any) {
    WidgetUtils.postMessage({ type, ...(data || {}) });
  }

  static paymentSuccess() {
    WidgetUtils.postMessage({ type: WidgetMessageType.PAYMENT_SUCCESS });
  }

  static closeContractModalOnError() {
    WidgetUtils.postMessage({
      type: WidgetMessageType.RESPONSE_CLOSE_SUBSCRIPTION_MODAL_ON_ERROR,
    });
  }

  static videoRegistered(videoId) {
    WidgetUtils.postMessage({
      type: WidgetMessageType.VIDEO_REGISTERED,
      videoId,
    });
  }

  static DEPRECATEDauthenticatedStatus(
    authenticated: boolean,
    username: string,
  ) {
    WidgetUtils.postMessage({
      type: WidgetMessageType.AUTHENTICATED_STATUS,
      authenticated,
      username,
    });
  }

  static DEPRECATEDbasketCount(count: number) {
    WidgetUtils.postMessage({ type: WidgetMessageType.BASKET_COUNT, count });
  }

  static DEPRECATEDbookingsCount(count: number) {
    WidgetUtils.postMessage({ type: WidgetMessageType.BOOKINGS_COUNT, count });
  }

  static DEPRECATEDonLoginSuccess(username: string) {
    WidgetUtils.postMessage({
      type: WidgetMessageType.LOGIN_SUCCESS,
      payload: { username },
    });
  }
}

export default WidgetUtils;
