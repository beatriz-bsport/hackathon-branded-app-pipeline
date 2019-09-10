// @flow

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';

import withSentryErrorReporting from './hocs/error-boundary.hoc';
import { Moment } from './i18n';

import SnackbarPile from './SnackbarPile.component';

import Root from './Root';
import './App.scss';

import initStore from './store';
import { refresh as refreshActions } from './actions';

import { initLoginFromCookie } from './auth';

import theme from './theme';
import { DrawerContextProvider } from './hocs/with-drawer.hoc';
import { ListViewContextProvider } from './hocs/inject-bottom-buttons';

export class App extends Component<{}, {}> {
  state = {
    reloaded: false,
  };

  store: *;

  history: *;

  constructor(props: {}) {
    super(props);

    const { store, history } = initStore();
    this.store = store;
    this.history = history;

    initLoginFromCookie(this.store);
  }

  componentDidMount() {
    if (!this.state.reloaded && window.location.search === '?storeReload') {
      this.setState({ reloaded: true });
      this.store.dispatch(refreshActions.forceRefresh());
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline>
            <ConnectedRouter history={this.history}>
              <DrawerContextProvider>
                <ListViewContextProvider>
                  <MuiPickersUtilsProvider
                    utils={MomentUtils}
                    moment={Moment}
                    locale={Moment.locale()}
                  >
                    <SnackbarPile />
                    <Root />
                  </MuiPickersUtilsProvider>
                </ListViewContextProvider>
              </DrawerContextProvider>
            </ConnectedRouter>
          </CssBaseline>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export const storage = window.localStorage;

export default withSentryErrorReporting(App);
