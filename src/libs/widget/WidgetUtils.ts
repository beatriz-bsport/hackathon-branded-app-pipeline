// @ts-nocheck
import {
  DIALOG_MODE_POPUP,
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_TAB,
  DIALOG_MODE_DEACTIVATED,
} from '@bsport/common/lib/master-data/widget-dialog-mode';
import { WidgetMessageType } from './types';

export class WidgetUtils {
  static setWidgetContext() {
    window.env.APP_CONTEXT = 'widget';
  }

  static isWidget() {
    return window && window.env && window.env.APP_CONTEXT === 'widget';
  }

  static setDialogMode(dialogMode: number) {
    window.env = {
      ...(window.env || {}),
      WIDGET_DIALOG_MODE: dialogMode,
    };
  }

  static getDialogMode() {
    return window?.env?.WIDGET_DIALOG_MODE ?? null;
  }

  static setWidgetType(widgetType: number) {
    window.env = {
      ...(window.env || {}),
      WIDGET_TYPE: widgetType,
    };
  }

  static getWidgetType() {
    return window?.env?.WIDGET_TYPE ?? null;
  }

  static handleGoBackNavigation() {
    // 0 DIALOG_MODE_TAB : This mode opens a new tab. We are losing the context on the widget.
    // 1 DIALOG_MODE_IFRAME : we should close
    // 2 DIALOG_MODE_POPUP : This mode actually opens a new windows and cannot be properly handled.
    // 3 DIALOG_MODE_DEACTIVATED : This mode open a portal contains within the current widget, this portal must be closed.
    const dialogMode = this.getDialogMode();
    if (this.isWidget()) {
      switch (dialogMode) {
        case DIALOG_MODE_IFRAME:
        case DIALOG_MODE_DEACTIVATED:
          this.closeModal();
          break;
        case DIALOG_MODE_POPUP:
        case DIALOG_MODE_TAB:
          window.close();
          break;
        default:
          break;
      }
    }
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

  static closeModal() {
    WidgetUtils.postMessage({
      type: WidgetMessageType.CLOSE_MODAL,
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
