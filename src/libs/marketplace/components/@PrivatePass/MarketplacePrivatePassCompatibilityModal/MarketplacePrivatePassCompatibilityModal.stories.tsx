import React from 'react';

import { MarketplacePrivatePassCompatibilityModalForStorybook } from '.';
import type { Props } from '.';
import { privateServiceListFactory } from '#src/libs/private-service/factory';

const fakePrivateServices = privateServiceListFactory(3);

const Template = (args: Props) => {
  // @ts-expect-error
  return <MarketplacePrivatePassCompatibilityModalForStorybook {...args} />;
};

export const privatePassWithPrivateSlots = Template.bind({});
privatePassWithPrivateSlots.args = {
  isOpen: true,
  compatiblePrivateServices: fakePrivateServices,
};

export default {
  title:
    'Components/Marketplace/PassCards/Modals/PrivatePassCompatibilityModal',
  component: MarketplacePrivatePassCompatibilityModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
