import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import { colors } from 'bsport-commons/lib/colors';

import { Moment } from './i18n';

import Root from './Root';
import './App.scss';

import initStore from './store';

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
});

export class App extends Component {
  constructor(props) {
    super(props);

    const { store } = initStore();
    this.store = store;
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <Provider store={this.store}>
            <BrowserRouter>
              <MuiPickersUtilsProvider
                utils={MomentUtils}
                moment={Moment}
                locale={Moment.locale()}
              >
                <Root />
              </MuiPickersUtilsProvider>
            </BrowserRouter>
          </Provider>
        </CssBaseline>
      </MuiThemeProvider>
    );
  }
}

export const storage = window.localStorage;

export default App;
