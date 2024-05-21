import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SavedPaymentMethodCard, {
  SavedPaymentMethodCardStorybook,
} from '../ConsumerProfileCards/SavedPaymentMethodCard';
import type { PaymentMethodsCardProps } from '../types';
import { payment_method_list_factory } from '#src/libs/payment/factory';

export default {
  title: 'ConsumerSpace/SavedPaymentMethodCard',
  component: SavedPaymentMethodCard,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SavedPaymentMethodCardStorybook>;

const Template: ComponentStory<typeof SavedPaymentMethodCard> = (
  args: PaymentMethodsCardProps,
) => <SavedPaymentMethodCardStorybook {...args} />;

const paymentMethods = payment_method_list_factory(3, 3);

const paymentMethodsWithoutCard = payment_method_list_factory(0, 3);

const paymentMethodsWithoutDirectPayment = payment_method_list_factory(3, 0);

const defaultArgs = {
  detachPaymentMethod: () => {},
  detachPaymentMethodLoading: false,
  openAddPaymentMethodDialog: () => {},
  paymentMethodLoading: false,
};

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
  paymentMethods,
};

export const NoCard = Template.bind({});
NoCard.args = {
  ...defaultArgs,
  paymentMethods: paymentMethodsWithoutCard,
};

export const NoDirectPayment = Template.bind({});
NoDirectPayment.args = {
  ...defaultArgs,
  paymentMethods: paymentMethodsWithoutDirectPayment,
};

export const NoPaymentMethod = Template.bind({});
NoPaymentMethod.args = {
  ...defaultArgs,
  paymentMethods: [],
};
