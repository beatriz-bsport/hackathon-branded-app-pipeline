import React from 'react';

import { ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import { paymentPackFactory } from '#libs/payment-packs/factory';

import MarketplacePaymentPackBuyableItem, {
  MarketplacePaymentPackBuyableItemForStorybook,
  type Props,
} from '.';

const fakePaymentPack = paymentPackFactory({
  isUniversalPass: true,
  isUnlimited: false,
  isHighlightedAsRecommended: true,
});

const fakeUniversalPaymentPack = paymentPackFactory({
  isUniversalPass: true,
});

const recomendedPaymentPack = paymentPackFactory({
  isHighlightedAsRecommended: true,
});

const PaymentPackBuyableItemTemplate = (args: Props) => (
  <div className="pass-card">
    {/* @ts-expect-error */}
    <MarketplacePaymentPackBuyableItemForStorybook {...args} />
  </div>
);

export const IdleBuyableItem = PaymentPackBuyableItemTemplate.bind({});
IdleBuyableItem.args = {
  paymentPack: {
    ...fakePaymentPack,
    description: faker.lorem.sentences(10),
  },
};

export const buyableItemHiddenCredits = PaymentPackBuyableItemTemplate.bind({});
buyableItemHiddenCredits.args = {
  paymentPack: {
    ...fakePaymentPack,
    description: faker.lorem.sentences(10),
  },
  hideCredits: true,
};

export const buyableItemUniversalPaymentPack =
  PaymentPackBuyableItemTemplate.bind({});
buyableItemUniversalPaymentPack.args = {
  paymentPack: fakeUniversalPaymentPack,
};

export const buyableItemSmallDescription = PaymentPackBuyableItemTemplate.bind(
  {},
);
buyableItemSmallDescription.args = {
  paymentPack: {
    ...fakePaymentPack,
    description: faker.lorem.words(6),
  },
};

export const recommendedBuyableItem = PaymentPackBuyableItemTemplate.bind({});
recommendedBuyableItem.args = {
  paymentPack: recomendedPaymentPack,
};

export const SelectedBuyableItem = PaymentPackBuyableItemTemplate.bind({});
SelectedBuyableItem.args = {
  paymentPack: {
    ...fakePaymentPack,
    description: faker.lorem.sentences(10),
  },
  isSelected: true,
};

export default {
  title: 'Components/Marketplace/PassCards/Cards/PaymentPackBuyableItem',
  component: MarketplacePaymentPackBuyableItem,
  decorators: [
    (Story) => (
      <div
        style={{
          // @ts-expect-error
          container: 'bsOfferBookingPage / inline-size',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      page: null,
    },
  },
} as ComponentMeta<typeof MarketplacePaymentPackBuyableItem>;
