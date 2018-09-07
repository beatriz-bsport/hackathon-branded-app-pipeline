import React from 'react';

import { action } from '@storybook/addon-actions';
import { text, boolean, object, number, select } from '@storybook/addon-knobs';

import FactoryBot from '../../factories';
import { storiesOf } from '../stories';

import MetaActivityForm from './MetaActivityForm.component';

storiesOf('Activity/MetaActivityForm', module).add('default', () => {
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
  const establishments = FactoryBot.Establishment.create(2);

  const initial = object('Initial', FactoryBot.MetaActivity.createOne());
  return (
    <MetaActivityForm
      initial={initial}
      coaches={Object.values(coaches)}
      establishments={establishments}
      SCTs={Object.values(SCTs)}
      onSubmit={action('onSubmit')}
    />
  );
});
