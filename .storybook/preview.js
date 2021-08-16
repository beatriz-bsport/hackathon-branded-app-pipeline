import React from 'react';
import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { MuiThemeProvider } from '@material-ui/core/styles';


import _ from '../envs/local';
import Config from '../src/config.ts';
import theme from '../src/theme';

addDecorator(
  (Story) => (
    <MuiThemeProvider theme={theme}>
      <React.Suspense fallback={() => <p>text</p>}>
	<Story />
      </React.Suspense>
    </MuiThemeProvider>
  ),
);
// automatically import all files ending in *.stories.js
const req = require.context('../src/', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);

