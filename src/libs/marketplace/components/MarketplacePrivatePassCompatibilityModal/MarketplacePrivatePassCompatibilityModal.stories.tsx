// @ts-nocheck
import React from 'react';
import { MarketplacePrivatePassCompatibilityModalForStorybook, Props } from '.';
import { private_services_factory } from '#libs/private-service/factory';

const fakePrivateServices = private_services_factory(3)

const Template = (args: Props) => {
  return <MarketplacePrivatePassCompatibilityModalForStorybook {...args} />;
};

export const privatePassWithPrivateSlots = Template.bind({});
privatePassWithPrivateSlots.args = {
  isOpen: true,
  compatiblePrivateServices: fakePrivateServices,
};

export default {
  title: 'Components/Marketplace/PassCards/Modals/PrivatePassCompatibilityModal',
  component: MarketplacePrivatePassCompatibilityModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
