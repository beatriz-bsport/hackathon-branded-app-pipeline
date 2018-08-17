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
  object,
  number,
  select,
} from '@storybook/addon-knobs';

import MetaActivityForm from './MetaActivityForm.component';

storiesOf('Activity/MetaActivityForm', module)
  .addDecorator(checkA11y)
  .addDecorator(withKnobs)
  .addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>)
  .add('default', () => {
    const SCTs = {
      sport_1: {
        SCS: { id: 3 },
        name: 'Sport',
        id: 1,
      },
    };
    const coaches = {
      john: {
        id: 1,
        name: 'Hello',
      },
    };
    const establishments = {
      home: {
        id: 1,
        title: 'Test',
      },
    };
    const initial = object('Initial', {
      name: text('Name', 'Aquaponey'),
      SCT: select('SCT', { sport_1: 1 }, 'sport_1'),
      description: text('Description', 'Awesome sport'),
      coach: select('Coach', { john: 1 }, 'john'),
      establishment: select('Establishment', { home: 1 }, 'home'),
      default_price: number('Default price', 10),
      default_credits: number('Default credits', 2),
      default_last_booking_minutes: number('Default last booking (min)', 60),
      default_last_discard_minutes: number('Default last discard (min)', 60),
      default_duration_minutes: number('Default duration (min)', 60),
      customer_enabled: boolean('Customer enabled', false),
    });
    return (
      <MetaActivityForm
        initial={initial}
        coaches={Object.values(coaches)}
        establishments={Object.values(establishments)}
        SCTs={Object.values(SCTs)}
        onSubmit={action('onSubmit')}
      />
    );
  });
