import React from 'react';

import { MarketplaceContractCooldownModalForStorybook, Props } from '.';

const ContractCooldownModalTemplate = (args: Props) => (
  // @ts-ignore
  <MarketplaceContractCooldownModalForStorybook {...args} />
);

export const OpenDialog = ContractCooldownModalTemplate.bind({});
OpenDialog.args = {
  isOpen: true,
  onDialogClose: () => {},
};

export default {
  title:
    'Components/Marketplace/Subscriptions/Modals/MarketplaceContractCooldownModal',
  component: MarketplaceContractCooldownModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
