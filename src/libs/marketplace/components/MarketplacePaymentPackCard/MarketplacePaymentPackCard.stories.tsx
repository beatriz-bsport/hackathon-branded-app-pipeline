import React from 'react';
import { paymentPackFactory } from '#libs/payment-packs/factory';

import { MarketplacePaymentPackCardForStorybook } from '.';

import type { Props } from '.';

const fakepaymentPackWithDateRange = paymentPackFactory({
  validityDaterange: {
    lower: '2023-04-27',
    upper: '2023-06-10',
  },
});

const fakepaymentPackWithoutDateRange = paymentPackFactory();

const Template = (args: Props) => {
  return (
    <div className="pass-card">
      {/* @ts-expect-error */}
      <MarketplacePaymentPackCardForStorybook {...args} />
    </div>
  );
};

export const paymentPackCardWithoutDateRange = Template.bind({});
paymentPackCardWithoutDateRange.args = {
  paymentPack: fakepaymentPackWithoutDateRange,
  addToCart: () => {},
  onOpenDetailDialog: () => {},
};

export const paymentPackCardWithDateRange = Template.bind({});
paymentPackCardWithDateRange.args = {
  paymentPack: fakepaymentPackWithDateRange,
  addToCart: () => {},
  onOpenDetailDialog: () => {},
};

export const paymentPackCardPricingPage = Template.bind({});
paymentPackCardPricingPage.args = {
  paymentPack: fakepaymentPackWithDateRange,
  variant: 'pricing_page',
};

export default {
  title: 'Components/Marketplace/PassCards/Cards/PaymentPackCard',
  component: MarketplacePaymentPackCardForStorybook,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
  },
};
