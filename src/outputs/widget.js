import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import BsportWidgetA from '../App';
import '../../vendor/cleanslate.css';
import initStore from '../store';

const store = initStore();
const history = createBrowserHistory();

export default class BsportWidget {
  constructor(props = {}) {
    this.props = props;
  }

  mount() {
    const props = Object.assign({}, this.props);
    delete props.parentElement;
    this.component = (
      <Provider store={store}>
        <Router history={history}>
          <BsportWidgetA {...props} store={store} history={history} />
        </Router>
      </Provider>
    );
    if (document.readyState === 'complete') {
      this.doRender();
    } else {
      window.addEventListener('load', () => {
        this.doRender();
      });
    }
  }

  doRender() {
    const el = document.createElement('div');
    el.setAttribute('class', 'cleanslate');
    document
      .getElementById(this.props.parentElement || 'bsport-widget')
      .appendChild(el);
    ReactDOM.render(this.component, el);
  }
}
