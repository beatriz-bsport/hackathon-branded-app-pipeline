import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
import PaymentPackSelectorField from './PaymentPackSelectorField.component';
import PaymentPackFactoryBot from '../factory';

const basicChoices = PaymentPackFactoryBot.PaymentPack.create(10);

export default {
  title: 'Library/PaymentPack/Selector Field',
  component: PaymentPackSelectorField,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: { payment_pack: null },
    },
  },
} as ComponentMeta<typeof PaymentPackSelectorField>;

const PaymentPackSelectorFieldTemplate: ComponentStory<
  typeof PaymentPackSelectorField
> = (args) => <PaymentPackSelectorField {...args} />;

export const BasicPaymentPackSelectorField =
  PaymentPackSelectorFieldTemplate.bind({});
BasicPaymentPackSelectorField.args = {
  fullWidth: true,
  required: false,
  choices: basicChoices,
  name: 'payment_pack',
};
