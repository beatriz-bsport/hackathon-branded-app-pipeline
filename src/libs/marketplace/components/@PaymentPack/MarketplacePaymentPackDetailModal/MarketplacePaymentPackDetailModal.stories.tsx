import React from 'react';
import { MarketplacePaymentPackDetailsModalForStorybook, Props } from '.';

import { paymentPackFactory } from '#libs/payment-packs/factory';

const fakepaymentPackFullDetails = paymentPackFactory();

const Template = (args: Props) => {
  // @ts-expect-error
  return <MarketplacePaymentPackDetailsModalForStorybook {...args} />;
};

export const paymentPackDetailsModalFullDetails = Template.bind({});
paymentPackDetailsModalFullDetails.args = {
  isOpen: true,
  paymentPack: fakepaymentPackFullDetails,
  isCompatibleWithAll: false,
  onDialogClose: () => {},
  onAddToCart: () => {},
  onShowCompatibilityDialog: () => {},
  onShowRestrictionDialog: () => {},
};

export default {
  title: 'Components/Marketplace/PassCards/Modals/PaymentPackDetailsModal',
  component: MarketplacePaymentPackDetailsModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
