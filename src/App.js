import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Root from './Root';
import './App.scss';
import { colors } from 'bsport-commons/lib/colors';

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

class App extends Component {
  constructor(props) {
    super(props);

    const { store } = initStore();
    this.store = store;
  }

  render() {
    return (
      <Provider store={this.store}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Root />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
