import React from 'react';
import { contractFactory } from '#src/libs/subscription/factory';
import { MarketplaceContractDetailModalForStorybook, Props } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const fakeContract = contractFactory();

export default {
  title: 'Components/Marketplace/PassCards/Modals/Contracts',
  component: MarketplaceContractDetailModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
} as ComponentMeta<typeof MarketplaceContractDetailModalForStorybook>;

const ContractModalTemplate: ComponentStory<
  typeof MarketplaceContractDetailModalForStorybook
  // @ts-expect-error
> = (args: Props) => <MarketplaceContractDetailModalForStorybook {...args} />;

export const ContractModal = ContractModalTemplate.bind({});
ContractModal.args = {
  contract: fakeContract,
  isOpen: true,
  addToCart: () => {},
  onDialogClose: () => {},
};

export const ContractModalUndefinedSubscription = ContractModalTemplate.bind(
  {},
);
ContractModalUndefinedSubscription.args = {
  contract: undefined,
  isOpen: true,
  addToCart: () => {},
  onDialogClose: () => {},
};
