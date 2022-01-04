import React from 'react';
import ReactDOM from 'react-dom';
import './i18n';

import Root from './Root';
import '../vendor/cleanslate.css';

export default class BsportWidget {
  static el_list_id = [];

  static mount({ parentElement, ...initialParams } = {}) {
    const component = <Root initialParams={initialParams} />;

    function doRender() {
      const el = document.createElement('div');
      const parentElementId = parentElement || 'bsport-widget';
      el.setAttribute('class', 'cleanslate');
      document.getElementById(parentElementId).appendChild(el);
      if (BsportWidget.el_list_id.includes(parentElementId)) {
        return;
      }
      ReactDOM.render(component, el);
      BsportWidget.el_list_id.push(parentElementId);
    }
    if (document.readyState === 'complete') {
      doRender();
    } else {
      window.addEventListener('load', () => {
        doRender();
      });
    }
  }

  static unmount() {
    if (!BsportWidget.el) {
      throw new Error('BsportWidget is not mounted, mount first');
    }
    ReactDOM.unmountComponentAtNode(BsportWidget.el);
    BsportWidget.el.parentNode.removeChild(BsportWidget.el);
    BsportWidget.el = null;
  }
}
