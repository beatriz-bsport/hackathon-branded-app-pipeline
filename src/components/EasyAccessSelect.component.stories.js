import React from 'react';

import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';

import FactoryBot from '../../factories';
import { storiesOf } from '../stories';

import EasyAccessSelect from './EasyAccessSelect.component';

storiesOf('Forms/EasyAccessSelect', module).add('default', () => {
  const easyAccesses = FactoryBot.EasyAccess.create(100);
  return (
    <EasyAccessSelect
      easyAccesses={easyAccesses}
      onChange={action('onChange')}
    />
  );
});
