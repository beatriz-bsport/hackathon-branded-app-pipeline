import React from 'react';
import ReactDOM from 'react-dom';
import './i18n';

import Root from './Root';
import '../vendor/cleanslate.css';
import { logWidgetConfigUsage } from './utils/log';
import { WidgetConfig } from './utils/widget-props';

type BsportWidgetMountParams = {
  parentElement: string,
} & WidgetConfig;

export default class BsportWidget {
  static el_list_id: string[] = [];

  static mount({ parentElement, ...initialParams }: BsportWidgetMountParams) {
    if (
      initialParams?.widgetType === 'pass' ||
      initialParams?.widgetType === 'subscription' ||
      initialParams?.widgetType === 'newsletterV2'
    ) {
      import('../vendor/reset.css');
    }
    const component = (
      <Root initialParams={{ ...initialParams, parentElement }} />
    );

    function postMessageOnRenderCompleted() {
      const messageType = 'bsport:widget:mount:done';
      const data = { ...initialParams, parentElement };

      setTimeout(() => {
        window?.postMessage({ type: messageType, data }, '*');
      }, 1000);
    }

    function doRender() {
      const el = document.createElement('div');

      const parentElementId = parentElement || 'bsport-widget';
      el.setAttribute('class', 'cleanslate');
      el.style.setProperty('height', '100%');
      el.style.setProperty('width', '100%');
      document.getElementById(parentElementId).appendChild(el);
      if (BsportWidget.el_list_id.includes(parentElementId)) {
        return;
      }

      ReactDOM.render(component, el, postMessageOnRenderCompleted);
      BsportWidget.el_list_id.push(parentElementId);

      logWidgetConfigUsage(parentElementId, initialParams);
    }
    if (document.readyState === 'complete') {
      doRender();
    } else {
      window.addEventListener('load', () => {
        doRender();
      });
    }
  }
}
