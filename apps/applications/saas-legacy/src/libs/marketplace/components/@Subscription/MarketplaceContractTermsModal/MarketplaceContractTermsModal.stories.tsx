import React from 'react';
import { Props, MarketplaceContractTermsModalForStorybook } from '.';

const MarketplaceContractTermsModalTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplaceContractTermsModalForStorybook {...args} />
);

export const OpenDialog = MarketplaceContractTermsModalTemplate.bind({});
OpenDialog.args = {
  isOpen: true,
  contractTerms: 'contract terms',
  contractTermsLink: null,
  onDialogClose: () => {},
  onDownloadTerms: () => {},
};

export default {
  title:
    'Components/Marketplace/Subscriptions/Modals/MarketplaceContractTermsModal',
  component: MarketplaceContractTermsModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
