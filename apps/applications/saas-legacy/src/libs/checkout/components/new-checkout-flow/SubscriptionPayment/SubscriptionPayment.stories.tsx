import React from 'react';

import {
  MarketplaceSubscriptionPaymentForStorybook,
  Props,
} from './SubscriptionPayment.component';

const SubscriptionPaymentTemplate = (args: Props) => (
  <div
    style={{
      width: '774px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {
      // @ts-expect-error
      <MarketplaceSubscriptionPaymentForStorybook {...args} />
    }
  </div>
);

export const SubscriptionPayment = SubscriptionPaymentTemplate.bind({});
SubscriptionPayment.args = {
  isContractLegalTermsAccepted: false,
  enabledPaymentMethodsIds: [1, 2, 3],
  enabledPaymentGroupMethodIdentifierIds: [0, 1, 16],
  savedPaymentMethodList: [
    {
      type: 'card',
      id: '123',
      readable_identifier: '4242',
      brand: 'visa',
      payment_backend_identifier: 123456,
      additional_info: '04/24',
    },
  ],
  sepaDefaultName: 'Bob',
  sepaDefaultEmail: 'bob@alice.fr',
  onlinePaymentEnabled: true,
  isExcludingTax: false,
  requestSetupIntentSecret: () => ({
    data: {
      client_secret: 'stripeSecretKey',
    },
  }),
};

export default {
  title: 'Subscription/SubscriptionPayment',
  component: MarketplaceSubscriptionPaymentForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
  argTypes: {},
};
