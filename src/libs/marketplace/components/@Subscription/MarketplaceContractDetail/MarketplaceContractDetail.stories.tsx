import React from 'react';
import { contractFactory } from '#libs/subscription/factory';
import { MarketplaceContractDetailForStorybook, Props } from '.';

const fakeContract = contractFactory();

export default {
  title: 'Components/Marketplace/Subscriptions/MarketplaceContractDetail',
  component: MarketplaceContractDetailForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};

const ContractDetailTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplaceContractDetailForStorybook {...args} />
);

export const ContractDetail = ContractDetailTemplate.bind({});
ContractDetail.args = {
  contract: fakeContract,
  isExcludingTax: false,
};
