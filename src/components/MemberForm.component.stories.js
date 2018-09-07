import React from 'react';

import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';

import FactoryBot from '../../factories';
import { storiesOf } from '../stories';

import MemberForm from './MemberForm.component';

storiesOf('Consumer/MemberForm', module).add('default', () => {
  const initial = object('Initial', FactoryBot.Member.createOne());
  return <MemberForm initial={initial} onSubmit={action('onSubmit')} />;
});
