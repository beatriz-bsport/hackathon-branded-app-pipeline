import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../factories';
import { storiesOf } from '../../stories';

import EstablishmentForm from './EstablishmentForm.component';

storiesOf('Company/EstablishmentForm', module).add('default', () => {
  const initial = object('Initial', FactoryBot.Establishment.createOne());
  return <EstablishmentForm initial={initial} onSubmit={action('onSubmit')} />;
});
