// @flow

import React, { Component, Suspense } from 'react';
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/fr';
import { Settings } from 'luxon';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { compose } from 'recompose';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';

import { LocalizedLuxonUtils } from './i18n/utils/luxon-picker-utils';
import withSentryErrorReporting from './hocs/error-boundary.hoc';
import LoadingBackoffice from './components/navigation/LoadingBackoffice.component';

import SnackbarPile from './SnackbarPile.component';
import BackgroundSnackbar from './libs/background-task/components/BackgroundSnackbar.component';
import BackgroundDialog from './libs/background-dialog/components/BackgroundDialog.component';
import Root from './Root';
import initStore from './store';
import { rudderInitialize } from './components/analytics/rudderstack/utils';
import theme from './theme';
import { FlagProvider } from '@unleash/proxy-client-react';
import initUnleash from './unleash';

export class App extends Component {
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

    this.unleash_config = initUnleash();
  }

  componentDidMount() {
    rudderInitialize();

    if (!this.state.reloaded && window.location.search === '?storeReload') {
      this.setState({ reloaded: true });
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <FlagProvider config={this.unleash_config}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline>
              <ConnectedRouter history={this.history}>
                <Suspense fallback={<LoadingBackoffice />}>
                  <MuiPickersUtilsProvider
                    locale={Settings.defaultLocale}
                    utils={LocalizedLuxonUtils}
                  >
                    <SnackbarPile />
                    <BackgroundSnackbar />
                    <BackgroundDialog />
                    <Root />
                  </MuiPickersUtilsProvider>
                </Suspense>
              </ConnectedRouter>
            </CssBaseline>
          </MuiThemeProvider>
        </FlagProvider>
      </Provider>
    );
  }
}
export const storage = window.localStorage;

export default compose(withSentryErrorReporting)(App);
