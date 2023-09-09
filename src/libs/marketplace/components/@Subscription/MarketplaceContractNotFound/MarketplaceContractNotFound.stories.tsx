import React from 'react';

import { MarketplaceContractNotFoundForStorybook } from '.';

const ConbtractNotFoundTemplate = () => (
  // @ts-ignore
  <MarketplaceContractNotFoundForStorybook />
);

export const ContractNotFound = ConbtractNotFoundTemplate.bind({});

export default {
  title: 'Components/Marketplace/Subscriptions/MarketplaceContractNotFound',
  component: MarketplaceContractNotFoundForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
