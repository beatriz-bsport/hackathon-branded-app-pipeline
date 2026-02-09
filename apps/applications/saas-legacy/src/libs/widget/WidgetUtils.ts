import {
  DIALOG_MODE_POPUP,
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_TAB,
  DIALOG_MODE_DEACTIVATED,
} from '@bsport/common/lib/master-data/widget-dialog-mode.js';

import type { Persistor } from 'redux-persist';

import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';
import { WIDGET_PARENT_DOMAIN_STORAGE_KEY } from './constants';
import { WidgetMessageType } from './types';

let _persistor: Persistor | null = null;

export function setPersistorForWidgetUtils(persistor: Persistor) {
  _persistor = persistor;
}

class WidgetUtils {
  static setWidgetContext(parentUrl?: string) {
    // @ts-expect-error
    window.env.APP_CONTEXT = 'widget';

    // Store parent domain early to use as fallback when document.referrer is empty
    // This happens when referrer policy blocks it or after navigation
    const urlToStore = parentUrl ?? document.referrer ?? '';
    if (urlToStore && sessionStorage) {
      try {
        const url = new URL(urlToStore);
        // Store only the origin (domain) to avoid storing unnecessary path/query params
        sessionStorage.setItem(WIDGET_PARENT_DOMAIN_STORAGE_KEY, url.origin);
      } catch (_e) {
        // If URL parsing fails, silently skip storing (malformed URL)
      }
    }
  }

  static isWidget() {
    // @ts-expect-error
    return window && window.env && window.env.APP_CONTEXT === 'widget';
  }

  static setDialogMode(dialogMode: number) {
    // @ts-expect-error
    window.env = {
      // @ts-expect-error
      ...(window.env || {}),
      WIDGET_DIALOG_MODE: dialogMode,
    };
  }

  static getDialogMode() {
    // @ts-expect-error
    return window?.env?.WIDGET_DIALOG_MODE ?? null;
  }

  static setWidgetType(widgetType: number) {
    // @ts-expect-error
    window.env = {
      // @ts-expect-error
      ...(window.env || {}),
      WIDGET_TYPE: widgetType,
    };
  }

  static getWidgetType() {
    // @ts-expect-error
    return window?.env?.WIDGET_TYPE ?? null;
  }

  static setConsumerSpaceContext(context: ConsumerSpaceContextEnum) {
    // @ts-expect-error
    window.env = {
      // @ts-expect-error
      ...(window.env || {}),
      CONSUMER_SPACE_CONTEXT: context,
    };
  }

  static getConsumerSpaceContext(): ConsumerSpaceContextEnum | null {
    // @ts-expect-error
    return window?.env?.CONSUMER_SPACE_CONTEXT ?? null;
  }

  static setParentElementId(parentElementId: string) {
    // @ts-expect-error
    window.env = {
      // @ts-expect-error
      ...(window.env || {}),
      WIDGET_PARENT_ELEMENT_ID: parentElementId,
    };
  }

  static getParentElementId() {
    // @ts-expect-error
    return window?.env?.WIDGET_PARENT_ELEMENT_ID ?? null;
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

  static sendScrollUpPostMessageToWidget() {
    // Check if the current environment is within a widget and the widget is in deactivated dialog mode
    if (
      WidgetUtils.isWidget() &&
      WidgetUtils.getDialogMode() === DIALOG_MODE_DEACTIVATED
    ) {
      // Create a message object to be sent via postMessage
      const message = {
        type: 'bsport-widget-scrollup',
        data: {
          parentElementId: WidgetUtils.getParentElementId(),
        },
      };
      // Send the message to the parent window using postMessage
      window?.parent?.postMessage(message, '*');
    }
  }

  private static async postMessage(data: any) {
    if (_persistor) await _persistor.flush();

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

  static sendBridgeLoginSuccess() {
    WidgetUtils.postMessage({
      type: WidgetMessageType.IFRAME_LOGIN_SUCCESS,
    });
  }
  static sendBridgeLogout() {
    WidgetUtils.postMessage({ type: WidgetMessageType.IFRAME_LOGOUT });
  }

  static paymentSuccess() {
    WidgetUtils.postMessage({ type: WidgetMessageType.PAYMENT_SUCCESS });
  }

  static closeContractModalOnError() {
    WidgetUtils.closeModal();
  }

  static closeModal() {
    WidgetUtils.postMessage({
      type: WidgetMessageType.CLOSE_MODAL,
    });
  }

  // @ts-expect-error
  static videoRegistered(videoId) {
    WidgetUtils.postMessage({
      type: WidgetMessageType.VIDEO_REGISTERED,
      videoId,
    });
  }
}

export default WidgetUtils;
