import React from 'react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';

import initStore from './store';
import App from './App';
import { migrateOldProps } from './utils/sanitize-widget-props';

const generateClassName = createGenerateClassName({
  productionPrefix: 'widget-',
});

export default class extends React.Component {
  store: any;

  history: any;

  childProps: any;

  constructor(props: any) {
    super(props);

    this.store = initStore();
    this.history = createBrowserHistory();

    this.childProps = migrateOldProps(props.initialParams);

    if (this.childProps.config === undefined) {
      this.childProps.config = { [this.childProps.widgetType]: {} };
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <StylesProvider generateClassName={generateClassName}>
          <ConnectedRouter history={this.history}>
            <App {...this.childProps} store={this.store} />
          </ConnectedRouter>
        </StylesProvider>
      </Provider>
    );
  }
}
