import React from 'react';
import { MarketplacePrivatePassDetailsModalForStorybook } from '.';
import { Props } from '.';

import { privatePassFactory } from '#src/libs/private-service/factory';

const fakePrivatePassDetails = privatePassFactory();

const Template = (args: Props) => {
  // @ts-expect-error
  return <MarketplacePrivatePassDetailsModalForStorybook {...args} />;
};

export const privatePassDetailsModal = Template.bind({});
privatePassDetailsModal.args = {
  privatePass: fakePrivatePassDetails,
  isOpen: true,
  onDialogClose: () => {},
  onAddToCart: () => {},
  onShowCompatibilityDialog: () => {},
};

export default {
  title: 'Components/Marketplace/PassCards/Modals/PrivatePassDetailsModal',
  component: MarketplacePrivatePassDetailsModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
