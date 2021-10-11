// import React from 'react';
// 
// import CssBaseline from '@material-ui/core/CssBaseline';
// import { MuiThemeProvider } from '@material-ui/core/styles';
// 
// import { MemoryRouter } from 'react-router';
// import { checkA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';
// import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
// 
// import MomentUtils from '@date-io/moment';
// 
// import { Moment } from './i18n';
// import theme from './theme';
// 
// export function storiesOf(name, module) {
//   return stories(name, module)
//     .addDecorator(checkA11y)
//     .addDecorator(withKnobs)
//     .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>)
//     .addDecorator((story) => (
//       <MuiThemeProvider theme={theme}>
//         <CssBaseline>{story()}</CssBaseline>
//       </MuiThemeProvider>
//     ))
//     .addDecorator((story) => (
//       <MuiPickersUtilsProvider
//         utils={MomentUtils}
//         moment={Moment}
//         locale={Moment.locale()}
//       >
//         {story()}
//       </MuiPickersUtilsProvider>
//     ));
// }
import { configure } from '@storybook/react';

import _ from '../envs/local';
import Config from './config.ts';
import theme from './theme';

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
  Story => <React.Suspense fallback={<div/>} ><Story/></React.Suspense>,
]

// automatically import all files ending in *.stories.js
const req = require.context('./', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
