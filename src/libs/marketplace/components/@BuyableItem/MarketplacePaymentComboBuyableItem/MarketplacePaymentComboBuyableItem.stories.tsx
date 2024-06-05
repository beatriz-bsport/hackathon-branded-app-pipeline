import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import { paymentComboFactory } from '#src/libs/payment-combo/factory';
import MarketplacePaymentComboBuyableItem, {
  MarketplacePaymentComboBuyableItemForStorybook,
  Props,
} from '.';

const fakePaymentCombo = paymentComboFactory({
  isHighlightedAsRecommended: true,
});

const fakeHighlightedPaymentCombo = paymentComboFactory({
  isHighlightedAsRecommended: true,
});

const PaymentComboBuyableItemTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplacePaymentComboBuyableItemForStorybook {...args} />
);

export const IdleBuyableItem = PaymentComboBuyableItemTemplate.bind({});
IdleBuyableItem.args = {
  paymentCombo: { ...fakePaymentCombo, description: faker.lorem.sentences(10) },
};

export const BuyableItemSmallDescription = PaymentComboBuyableItemTemplate.bind(
  {},
);
BuyableItemSmallDescription.args = {
  paymentCombo: { ...fakePaymentCombo, description: faker.lorem.words(5) },
};

export const RecommendedBuyableItem = PaymentComboBuyableItemTemplate.bind({});
RecommendedBuyableItem.args = {
  paymentCombo: fakeHighlightedPaymentCombo,
};

export const SelectedBuyableItem = PaymentComboBuyableItemTemplate.bind({});
SelectedBuyableItem.args = {
  paymentCombo: { ...fakePaymentCombo, description: faker.lorem.sentences(10) },
  isSelected: true,
};

export default {
  title: 'Components/Marketplace/PassCards/PaymentComboBuyableItem',
  component: MarketplacePaymentComboBuyableItem,
  parameters: {
    docs: {
      page: null,
    },
  },
} as ComponentMeta<typeof MarketplacePaymentComboBuyableItem>;
