import { configure } from '@storybook/react';

import _ from '../envs/local';
import Config from '../src/config.ts';

// automatically import all files ending in *.stories.js
const req = require.context('../src/', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
