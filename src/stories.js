import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { storiesOf as stories } from '@storybook/react';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

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
   (Story) => (
   <MemoryRouter>
     <Story/>
   </MemoryRouter>
   ),
]

export function storiesOf(name, module) {
  return stories(name, module)
  // .addDecorator(checkA11y)
  //    .addDecorator(withKnobs)
  //    .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>)
  //    .addDecorator((story) => (
  //      <MuiThemeProvider theme={theme}>
  //        <CssBaseline>{story()}</CssBaseline>
  //      </MuiThemeProvider>
  //    ))
  //    .addDecorator((story) => (
  //      <MuiPickersUtilsProvider
  //        utils={MomentUtils}
  //        moment={Moment}
  //        locale={Moment.locale()}
  //      >
  //        {story()}
  //      </MuiPickersUtilsProvider>
  //    ));
}

