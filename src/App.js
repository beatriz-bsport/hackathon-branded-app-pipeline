// @flow

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import { colors } from 'bsport-commons/lib/colors';

import withSentryErrorReporting from './hocs/error-boundary.hoc';
import { Moment } from './i18n';

import SnackbarPile from './SnackbarPile.component';

import Root from './Root';
import './App.scss';

import initStore from './store';
import { refresh as refreshActions } from './actions';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    error: {
      main: colors.orange,
    },
  },
  typography: {
    useNextVariants: true,
  },
});

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
  }

  componentDidMount() {
    if (!this.state.reloaded && window.location.search === '?storeReload') {
      this.setState({ reloaded: true });
      this.store.dispatch(refreshActions.forceRefresh());
    }
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
