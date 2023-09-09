import React from 'react';
import { contractFactory } from '#libs/subscription/factory';
import { MarketplaceContractCheckoutForStorybook, Props } from '.';

const fakeContract = contractFactory();

const ContractCheckoutTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplaceContractCheckoutForStorybook {...args} />
);

export const BasicContractCheckout = ContractCheckoutTemplate.bind({});
BasicContractCheckout.args = {
  contract: fakeContract,
  addToCart: () => {},
  onOpenDetailDialog: () => {},
};

export const ContractCheckoutWithUndefinedSubscription =
  ContractCheckoutTemplate.bind({});
ContractCheckoutWithUndefinedSubscription.args = {
  contract: undefined,
  addToCart: () => {},
  onOpenDetailDialog: () => {},
};

export default {
  title: 'Components/Marketplace/PassCards/Modals/MarketplaceContractCheckout',
  component: MarketplaceContractCheckoutForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
