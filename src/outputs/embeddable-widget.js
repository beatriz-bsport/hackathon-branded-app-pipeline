import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import BsportWidget from '../components/widget.core';
import '../../vendor/cleanslate.css';
import initStore from '../store';

const store = initStore();
const history = createBrowserHistory();

export default class EmbeddableWidget {
  static el;

  static mount({ parentElement, ...props } = {}) {
    const component = (
      <Provider store={store}>
        <Router history={history}>
          <BsportWidget {...props} store={store} history={history} />
        </Router>
      </Provider>
    );

    function doRender() {
      if (EmbeddableWidget.el) {
        throw new Error('EmbeddableWidget is already mounted, unmount first');
      }
      const el = document.createElement('div');
      el.setAttribute('class', 'cleanslate');
      document.getElementById(parentElement || 'bsport-widget').appendChild(el);
      ReactDOM.render(component, el);
      EmbeddableWidget.el = el;
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
    if (!EmbeddableWidget.el) {
      throw new Error('EmbeddableWidget is not mounted, mount first');
    }
    ReactDOM.unmountComponentAtNode(EmbeddableWidget.el);
    EmbeddableWidget.el.parentNode.removeChild(EmbeddableWidget.el);
    EmbeddableWidget.el = null;
  }
}
