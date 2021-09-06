import React from 'react';
import { configure } from '@storybook/react';
import { MuiThemeProvider } from '@material-ui/core/styles';


import { MemoryRouter } from 'react-router';

import CssBaseline from '@material-ui/core/CssBaseline';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ConnectedRouter } from 'connected-react-router';
import { Moment } from '../src/i18n';


import _ from '../envs/local';

import Config from '../src/config.ts';
import theme from '../src/theme';

export const decorators = [
  (Story) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline><Story/></CssBaseline>
  </MuiThemeProvider>
  ),
  (Story) => (
    <MuiPickersUtilsProvider
      utils={MomentUtils}
      moment={Moment}
      locale={Moment.locale()}
    >
      <Story/>
    </MuiPickersUtilsProvider>
  ),
  Story => <MemoryRouter><Story/></MemoryRouter>,
  Story => <React.Suspense fallback={<LinearProgress />}><Story/></React.Suspense>,
]


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
