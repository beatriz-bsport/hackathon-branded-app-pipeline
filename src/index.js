import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import BsportWidgetA from './App';
import '../vendor/cleanslate.css';
import initStore from './store/store';

const store = initStore();
const history = createBrowserHistory();

export default class BsportWidget {
  static el;

  static mount({ parentElement, ...props } = {}) {
    const component = (
      <Provider store={store}>
        <Router history={history}>
          <BsportWidgetA {...props} history={history} store={store} />
        </Router>
      </Provider>
    );

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
