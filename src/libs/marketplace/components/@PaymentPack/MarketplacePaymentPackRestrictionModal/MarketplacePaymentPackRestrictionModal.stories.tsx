import React from 'react';
import { MarketplacePaymentPackRestrictionModalForStorybook, Props } from '.';
import { paymentPackFactory } from '#src/libs/payment-packs/factory';

const fakePaymentPack = paymentPackFactory();

const Template = (args: Props) => {
  //@ts-expect-error
  return <MarketplacePaymentPackRestrictionModalForStorybook {...args} />;
};

export const restrictionsModal = Template.bind({});
restrictionsModal.args = {
  paymentPack: fakePaymentPack,
  onDialogClose: () => {},
  isOpen: true,
};

export default {
  title: 'Components/Marketplace/PassCards/Modals/RestrictionModal',
  component: MarketplacePaymentPackRestrictionModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
