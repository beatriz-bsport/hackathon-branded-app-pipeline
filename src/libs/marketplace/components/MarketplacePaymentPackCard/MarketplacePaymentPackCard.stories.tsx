import React from 'react';
import FactoryBotPaymentPack from '#libs/payment-packs/factory';

import { MarketplacePaymentPackCardForStorybook } from '.';

import type { Props } from '.';

const fakepaymentPackWithDateRange =
  FactoryBotPaymentPack.PaymentPackWithDateRange.create();

const fakepaymentPackWithoutDateRange =
  FactoryBotPaymentPack.PaymentPack.create();

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
  description: 'Test micro un, deux',
  isUniversalPass: false,
  addToCart: () => {},
  onOpenDetailDialog: () => {},
};

export const paymentPackCardWithDateRange = Template.bind({});
paymentPackCardWithDateRange.args = {
  paymentPack: fakepaymentPackWithDateRange,
  description: 'Test micro un, deux',
  isUniversalPass: false,
  addToCart: () => {},
  onOpenDetailDialog: () => {},
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
