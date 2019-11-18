import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { MemoryRouter } from 'react-router';
import { storiesOf as stories } from '@storybook/react';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';

import MomentUtils from '@date-io/moment';

import { Moment } from './i18n';
import theme from './theme';

export function storiesOf(name, module) {
  return stories(name, module)
    .addDecorator(checkA11y)
    .addDecorator(withKnobs)
    .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>)
    .addDecorator((story) => (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>{story()}</CssBaseline>
      </MuiThemeProvider>
    ))
    .addDecorator((story) => (
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        moment={Moment}
        locale={Moment.locale()}
      >
        {story()}
      </MuiPickersUtilsProvider>
    ));
}
