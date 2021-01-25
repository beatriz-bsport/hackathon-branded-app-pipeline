import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';
import '../vendor/cleanslate.css';

export default class BsportWidget {
  static el;

  static mount({ parentElement, ...initialParams } = {}) {
    const component = <Root initialParams={initialParams} />;

    function doRender() {
      if (BsportWidget.el) {
        throw new Error('BsportWidget is already mounted, unmount first');
      }
      const el = document.createElement('div');
      el.setAttribute('class', 'cleanslate');
      document.getElementById(parentElement || 'bsport-widget').appendChild(el);
      ReactDOM.render(component, el);
      BsportWidget.el = el;
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
