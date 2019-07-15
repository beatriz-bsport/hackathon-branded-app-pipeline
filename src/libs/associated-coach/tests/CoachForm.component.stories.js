import React from 'react';

import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { checkA11y } from '@storybook/addon-a11y';
import {
  withKnobs,
  text,
  boolean,
  number,
  object,
} from '@storybook/addon-knobs';

import CoachForm from '../components/CoachForm.component';

storiesOf('Coach/CoachForm', module)
  .addDecorator(checkA11y)
  .addDecorator(withKnobs)
  .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>)
  .add('default', () => {
    const initialData = object('Initial', {
      firstname: text('First name', 'John'),
      lastname: text('Last name', 'Doe'),
      email: text('Email', 'john.doe@example.com'),
    });
    return <CoachForm initial={initialData} onSubmit={action('onSubmit')} />;
  });
