import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';

import MinimalPaymentComboCard, {
  MinimalPaymentComboCardForStorybook,
} from '.';

import type { Props } from '.';

import { paymentComboFactory } from '#src/libs/payment-combo/factory';

const paymentCombo = paymentComboFactory();

export default {
  title: 'Components/Marketplace/MinimalCards/PaymentComboMinimalCard',
  component: MinimalPaymentComboCard,
  decorators: [
    (Story) => (
      <div className="bs-booking-item__container">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof MinimalPaymentComboCardForStorybook>;

const Template: ComponentStory<typeof MinimalPaymentComboCard> = (
  args: Props,
) => <MinimalPaymentComboCardForStorybook {...args} />;

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  paymentCombo: paymentCombo,
};

export const WithoutQuantity = Template.bind({});
WithoutQuantity.args = {
  paymentCombo: paymentCombo,
};

export const WithQuantity = Template.bind({});
WithQuantity.args = {
  paymentCombo: paymentCombo,
  quantity: 3,
};
