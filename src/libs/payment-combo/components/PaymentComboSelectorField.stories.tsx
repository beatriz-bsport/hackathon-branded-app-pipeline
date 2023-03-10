import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
import PaymentComboSelectorField from './PaymentComboSelectorField.component';
import PaymentComboFactoryBot from '../factory';

const basicChoices = PaymentComboFactoryBot.PaymentCombo.create(10);

export default {
  title: 'Library/PaymentCombo/Selector Field',
  component: PaymentComboSelectorField,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: { payment_combo: null },
    },
  },
} as ComponentMeta<typeof PaymentComboSelectorField>;

const PaymentComboSelectorFieldTemplate: ComponentStory<
  typeof PaymentComboSelectorField
> = (args) => <PaymentComboSelectorField {...args} />;

export const BasicPaymentComboSelectorField =
  PaymentComboSelectorFieldTemplate.bind({});
BasicPaymentComboSelectorField.args = {
  fullWidth: true,
  required: false,
  choices: basicChoices,
  name: 'payment_combo',
};
