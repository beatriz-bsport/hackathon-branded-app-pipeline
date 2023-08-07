import React from 'react';

import { paymentComboFactory } from '#libs/payment-combo/factory';
import { MarketplacePaymentComboCardForStorybook, Props } from '.';

const fakePaymentCombo = paymentComboFactory();

const PackCardTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplacePaymentComboCardForStorybook {...args} />
);

export const BasicPackCard = PackCardTemplate.bind({});
BasicPackCard.args = {
  paymentCombo: fakePaymentCombo,
};

export const PricingPagePackCard = PackCardTemplate.bind({});
PricingPagePackCard.args = {
  paymentCombo: fakePaymentCombo,
  variant: 'pricing_page',
};

export default {
  title: 'Components/Marketplace/PassCards/PaymentComboCard',
  component: MarketplacePaymentComboCardForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
