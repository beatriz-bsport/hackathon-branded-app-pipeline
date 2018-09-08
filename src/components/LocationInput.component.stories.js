import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../factories';
import { storiesOf } from '../stories';

import LocationInput from './LocationInput.component';

storiesOf('Forms/LocationInput', module).add('default', () => {
  const initial = FactoryBot.Location.createOne();
  return <LocationInput initial={initial} onChange={action('onChange')} />;
});
