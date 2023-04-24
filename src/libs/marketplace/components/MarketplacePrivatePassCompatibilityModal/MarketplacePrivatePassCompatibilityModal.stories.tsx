// @ts-nocheck
import React from 'react';
import MarketplacePrivatePassCompatibilityModal, {Props} from '.';
import { private_services_factory } from '#libs/private-service/factory';

const fakePrivateServices = private_services_factory(3)

const Template = (args: Props) => {
  return <MarketplacePrivatePassCompatibilityModal {...args} />;
};

export const privatePassWithPrivateSlots = Template.bind({});
privatePassWithPrivateSlots.args = {
  isOpen: true,
  compatiblePrivateServices: fakePrivateServices,
};

export default {
  title: 'Components/Marketplace/PassCards/Modals/PrivatePassCompatibilityModal',
  component: MarketplacePrivatePassCompatibilityModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};
