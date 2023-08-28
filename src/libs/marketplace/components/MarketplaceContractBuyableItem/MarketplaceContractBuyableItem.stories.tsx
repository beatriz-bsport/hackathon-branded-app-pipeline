import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import { contractFactory } from '#libs/subscription/factory';
import MarketplaceContractBuyableItem, {
  MarketplaceContractBuyableItemForStorybook,
  Props,
} from '.';

const fakeContract = contractFactory();
const fakeRecommendedContract = contractFactory({
  isHighlightedAsRecommended: true,
});

const SubscriptionTemplate: ComponentStory<
  typeof MarketplaceContractBuyableItem
  // @ts-expect-error
> = (args: Props) => <MarketplaceContractBuyableItemForStorybook {...args} />;

export const IdleBuyableItem = SubscriptionTemplate.bind({});
IdleBuyableItem.args = {
  contract: {
    ...fakeContract,
    description: faker.lorem.sentences(20),
  },
};

export const buyableItemSmallDescription = SubscriptionTemplate.bind({});
buyableItemSmallDescription.args = {
  contract: {
    ...fakeContract,
    description: faker.lorem.words(6),
  },
};

export const recommendedBuyableItem = SubscriptionTemplate.bind({});
recommendedBuyableItem.args = {
  contract: {
    ...fakeRecommendedContract,
    description: faker.lorem.sentences(20),
  },
};

export const SelectedBuyableItem = SubscriptionTemplate.bind({});
SelectedBuyableItem.args = {
  contract: {
    ...fakeContract,
    description: faker.lorem.sentences(10),
  },
  isSelected: true,
};

export default {
  title: 'Components/Marketplace/Subscriptions/MarketplaceContractBuyableItem',
  component: MarketplaceContractBuyableItem,
  parameters: {
    docs: {
      page: null,
    },
  },
} as ComponentMeta<typeof MarketplaceContractBuyableItem>;
