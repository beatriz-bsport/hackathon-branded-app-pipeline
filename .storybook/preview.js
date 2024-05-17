import React from 'react';
import { configure } from '@storybook/react';
import {
  INITIAL_VIEWPORTS,
  MINIMAL_VIEWPORTS,
} from '@storybook/addon-viewport';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

import { MemoryRouter } from 'react-router';

import CssBaseline from '@material-ui/core/CssBaseline';
import { Settings } from 'luxon';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { LocalizedLuxonUtils } from '../src/i18n/utils/luxon-picker-utils';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ConnectedRouter } from 'connected-react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n/index';
import initStore from '../src/store';

import _ from '../envs/local';

import Config from '../src/config.ts';
import theme from '../src/theme';

const { store } = initStore();

export const decorators = [
  (Story) => (
    <MuiThemeProvider theme={theme}>
      <CssBaseline>
        <Story />
      </CssBaseline>
    </MuiThemeProvider>
  ),
  (Story) => (
    <MuiPickersUtilsProvider
      utils={LocalizedLuxonUtils}
      locale={Settings.defaultLocale}
    >
      <Story />
    </MuiPickersUtilsProvider>
  ),
  (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
  (Story) => (
    <React.Suspense fallback={<LinearProgress />}>
      <Story />
    </React.Suspense>
  ),
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  ),
  (Story) => (
    <I18nextProvider i18n={i18n}>
      <Story />
    </I18nextProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'white',
    values: [
      { name: 'white', value: '#ffffff' },
      { name: 'lightGrey', value: '#949494' },
      { name: 'grey', value: '#666666' },
      { name: 'black', value: '#000000' },
    ],
  },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...MINIMAL_VIEWPORTS,
    },
  },
};
