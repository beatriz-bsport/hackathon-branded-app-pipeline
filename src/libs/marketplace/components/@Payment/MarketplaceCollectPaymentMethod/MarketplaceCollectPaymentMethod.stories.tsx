import React from 'react';

import { MarketplaceCollectPaymentMethodForStorybook, Props } from '.';
import { MarketplacePaymentMethods } from '#src/libs/marketplace/types';

const CollectPaymentMethodTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplaceCollectPaymentMethodForStorybook {...args} />
);

export const CardCollect = CollectPaymentMethodTemplate.bind({});
CardCollect.args = {
  type: MarketplacePaymentMethods.card,
  isOpen: true,
  requestSetupIntentSecret: () => ({
    data: {
      client_secret: 'stripeSecretKey',
    },
  }),
  onSuccess: () => {},
  onCancel: () => {},
};

export const SepaCollect = CollectPaymentMethodTemplate.bind({});
SepaCollect.args = {
  type: MarketplacePaymentMethods.sepa,
  isOpen: true,
  sepaDefaultName: 'John Doe',
  sepaDefaultEmail: 'john.doe@gmail.com',
  requestSetupIntentSecret: () => ({
    data: {
      client_secret: 'stripeSecretKey',
    },
  }),
  onSuccess: () => {},
  onCancel: () => {},
};

export const BacsCollect = CollectPaymentMethodTemplate.bind({});
BacsCollect.args = {
  type: MarketplacePaymentMethods.bacs,
  isOpen: true,
  sepaDefaultName: 'John Doe',
  sepaDefaultEmail: 'john.doe@gmail.com',
  requestSetupIntentSecret: () => ({
    data: {
      client_secret: 'stripeSecretKey',
    },
  }),
  onSuccess: () => {},
  onCancel: () => {},
};

export default {
  title: 'Components/Marketplace/Subscriptions/MarketplaceCollectPaymentMethod',
  component: MarketplaceCollectPaymentMethodForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
