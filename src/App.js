import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { colors } from 'bsport-commons/lib/colors';

import './i18n/index';

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
              <Root />
            </BrowserRouter>
          </Provider>
        </CssBaseline>
      </MuiThemeProvider>
    );
  }
}

export const storage = window.localStorage;

export default App;
