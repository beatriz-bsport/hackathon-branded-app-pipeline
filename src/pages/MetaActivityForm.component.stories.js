import React from 'react';

import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import initStore from '../store';

import MetaActivityForm from './MetaActivityForm.component';

const { store } = initStore();

storiesOf('MetaActivity/MetaActivityForm', module)
  .addDecorator(checkA11y)
  .addDecorator((story) => (
    <Provider store={store}>
      <MemoryRouter>{story()}</MemoryRouter>
    </Provider>
  ))
  .add('default', () => {
    return <MetaActivityForm onSubmit={action('onSubmit')} />;
  });
