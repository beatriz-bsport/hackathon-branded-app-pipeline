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
