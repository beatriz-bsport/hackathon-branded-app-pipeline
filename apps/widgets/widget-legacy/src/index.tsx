import React from 'react';
import ReactDOM from 'react-dom';
import './i18n';

import '../vendor/cleanslate.css';
import { logWidgetConfigUsage } from './utils/log';
import { WidgetConfig } from './utils/widget-props';
import Config from '@bsport/saas-legacy/src/config';

// __webpack_public_path__ is the output.publicPath set in webpack.config.js.
// Using it (instead of document.currentScript.src) works regardless of whether
// widget.js was loaded via a static <script> tag or dynamically injected.
declare const __webpack_public_path__: string;

const loadEnvFile = (): Promise<void> => new Promise(resolve => {
  const envUrl = __webpack_public_path__ + 'env.js';
  const script = document.createElement('script');
  script.src = envUrl;
  script.onload = resolve;
  script.onerror = () => {
    console.warn('[BsportWidget] Failed to load env.js from', envUrl, '— rendering without runtime config.');
    resolve();
  };
  document.head.appendChild(script);
})

// Maybe already exist in src/config
const refreshConfig = () => {
  const env = (window.runtime?.env || {}) as Record<string, string>;
  Object.keys(env).forEach((k) => { (Config as any)[k] = env[k]; });
}

const _envReady: Promise<{ default: typeof import('./Root').default }> = (async () => {
  await loadEnvFile();
  refreshConfig();
  return import('./Root');
})();

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

    function postMessageOnRenderCompleted() {
      const messageType = 'bsport:widget:mount:done';
      const data = { ...initialParams, parentElement };

      setTimeout(() => {
        window?.postMessage({ type: messageType, data }, '*');
      }, 1000);
    }

    _envReady.then(({ default: Root }) => {
      const component = (
        <Root initialParams={{ ...initialParams, parentElement }} />
      );

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
    });
  }
}
