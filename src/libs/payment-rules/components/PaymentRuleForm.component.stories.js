import React from 'react';

import { action } from '@storybook/addon-actions';
import { select, object } from '@storybook/addon-knobs';

import FactoryBot from '../../../../factories';
import { storiesOf } from '../../../stories';

import PaymentRuleForm from './PaymentRuleForm.component';

storiesOf('PaymentRules/PaymentRuleForm', module).add('default', () => {
  const initial = {
    name: 'My rate',
    base_price: 10,
    rules: [{ id: 2, threshold: 3, variable_bonus: 5 }],
  };
  return <PaymentRuleForm initial={initial} onSubmit={action('onSubmit')} />;
});
