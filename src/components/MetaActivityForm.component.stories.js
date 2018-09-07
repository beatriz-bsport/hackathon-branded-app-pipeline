import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../factories';
import { storiesOf } from '../stories';

import MetaActivityForm from './MetaActivityForm.component';

storiesOf('Activity/MetaActivityForm', module).add('default', () => {
  const SCTs = FactoryBot.SCT.create(4);
  const coaches = FactoryBot.Coach.create(5);
  const establishments = FactoryBot.Establishment.create(2);

  const initial = object(
    'Initial',
    FactoryBot.MetaActivity.createOne({
      SCT: SCTs[0].id,
      establishment: establishments[0].id,
      coach: coaches[0].id,
    }),
  );
  return (
    <MetaActivityForm
      initial={initial}
      coaches={coaches}
      establishments={establishments}
      SCTs={SCTs}
      onSubmit={action('onSubmit')}
    />
  );
});
