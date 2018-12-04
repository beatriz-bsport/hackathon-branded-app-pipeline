import React from 'react';

import { MemoryRouter } from 'react-router';
import { storiesOf as stories } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

import MomentUtils from 'material-ui-pickers/utils/moment-utils';

import { Moment } from './i18n';

export function storiesOf(name, module) {
  return stories(name, module)
    .addDecorator(checkA11y)
    .addDecorator(withKnobs)
    .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>);
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
