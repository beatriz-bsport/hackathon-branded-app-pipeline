// @flow

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import withSentryErrorReporting from './hocs/error-boundary.hoc';
import { Moment } from './i18n';

import SnackbarPile from './SnackbarPile.component';

import Root from './Root';
import './App.scss';

import initStore from './store';

import theme from './theme';

export class App extends Component<{}, {}> {
  store: *;

  history: *;

  constructor(props: {}) {
    super(props);

    const { store, history } = initStore();
    this.store = store;
    this.history = history;
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <Provider store={this.store}>
            <ConnectedRouter history={this.history}>
              <MuiPickersUtilsProvider
                utils={MomentUtils}
                moment={Moment}
                locale={Moment.locale()}
              >
                <SnackbarPile />
                <Root />
              </MuiPickersUtilsProvider>
            </ConnectedRouter>
          </Provider>
        </CssBaseline>
      </MuiThemeProvider>
    );
  }
}

export const storage = window.localStorage;

export default withSentryErrorReporting(App);
