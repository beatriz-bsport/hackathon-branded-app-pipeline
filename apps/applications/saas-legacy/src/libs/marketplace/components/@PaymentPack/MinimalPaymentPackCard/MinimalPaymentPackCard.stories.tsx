import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import MinimalPaymentPackCard, { MinimalPaymentPackCardForStorybook } from '.';

import type { Props } from '.';
import { paymentPackFactory } from '#src/libs/payment-packs/factory';

const paymentPack = paymentPackFactory();

export default {
  title: 'Components/Marketplace/MinimalCards/PaymentPackMinimalCard',
  component: MinimalPaymentPackCard,
  decorators: [
    (Story) => (
      <div className="bs-booking-item__container">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MinimalPaymentPackCardForStorybook>;

const Template: ComponentStory<typeof MinimalPaymentPackCard> = (
  args: Props,
) => <MinimalPaymentPackCardForStorybook {...args} />;

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  paymentPack: paymentPack,
};

export const WithoutQuantity = Template.bind({});
WithoutQuantity.args = {
  paymentPack: paymentPack,
};

export const WithQuantity = Template.bind({});
WithQuantity.args = {
  paymentPack: paymentPack,
  quantity: 3,
};
