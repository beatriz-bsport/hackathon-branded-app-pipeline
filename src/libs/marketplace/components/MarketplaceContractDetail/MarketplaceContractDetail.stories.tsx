import React from 'react';
import FactoryBotContract from '#libs/subscription/factory';
import { MarketplaceContractDetailForStorybook, Props } from '.';

const fakeContract = FactoryBotContract.Contract.create();

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
  // @ts-ignore
  <MarketplaceContractDetailForStorybook {...args} />
);

export const ContractDetail = ContractDetailTemplate.bind({});
ContractDetail.args = {
  contract: fakeContract,
  isExcludingTax: false,
};