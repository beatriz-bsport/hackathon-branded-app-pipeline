import React from 'react';
import {
  MarketplacePaymentPackOffPeakRestrictionModalForStorybook,
  Props,
} from '.';
import { paymentPackFactory } from '#libs/payment-packs/factory';

const fakePaymentPack = paymentPackFactory();

const Template = (args: Props) => {
  return (
    // @ts-expect-error
    <MarketplacePaymentPackOffPeakRestrictionModalForStorybook {...args} />
  );
};

export const offPeakModal = Template.bind({});
offPeakModal.args = {
  paymentPack: fakePaymentPack,
  isOpen: true,
};

export default {
  title: 'Components/Marketplace/PassCards/Modals/PaymentPackOffPeakModal',
  component: MarketplacePaymentPackOffPeakRestrictionModalForStorybook,
  argTypes: {
    onDialogClose: { action: 'onDialogClose' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
