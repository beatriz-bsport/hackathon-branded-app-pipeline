// @flow

import React, { Component, Suspense } from 'react';
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/fr';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

import MomentUtils from '@date-io/moment';
import withSentryErrorReporting from './hocs/error-boundary.hoc';
import { Moment } from './i18n';
import LoadingBackoffice from './components/navigation/LoadingBackoffice.component';

import SnackbarPile from './SnackbarPile.component';
import BackgroundSnackbar from './BackgroundSnackbar.component';

import Root from './Root';

import initStore from './store';

import { initLoginFromCookie } from './auth';

import theme from './theme';

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
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline>
            <ConnectedRouter history={this.history}>
              <Suspense fallback={<LoadingBackoffice />}>
                <MuiPickersUtilsProvider
                  utils={MomentUtils}
                  moment={Moment}
                  locale={Moment.locale()}
                >
                  <SnackbarPile />
                  <BackgroundSnackbar />
                  <Root />
                </MuiPickersUtilsProvider>
              </Suspense>
            </ConnectedRouter>
          </CssBaseline>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export const storage = window.localStorage;

export default withSentryErrorReporting(App);
