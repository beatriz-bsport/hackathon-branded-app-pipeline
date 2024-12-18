import React from 'react';

import StripeTerminalSuccess, { Props } from '../StripeTerminalSuccess';

const StripeTerminalSuccessTemplate = (args: Props) => (
  <div style={{ maxWidth: '50vw' }}>
    <StripeTerminalSuccess {...args} />
  </div>
);

export const PaymentSuccess = StripeTerminalSuccessTemplate.bind({});

PaymentSuccess.args = {
  isSetupIntent: false,
  onlySavePaymentMethod: false,
};

export const SubscriptionSuccess = StripeTerminalSuccessTemplate.bind({});

SubscriptionSuccess.args = {
  isSetupIntent: true,
  onlySavePaymentMethod: false,
};

export const SavePaymentMethodSuccess = StripeTerminalSuccessTemplate.bind({});

SavePaymentMethodSuccess.args = {
  isSetupIntent: true,
  onlySavePaymentMethod: true,
};

export default {
  title: 'Library/Terminal/StripeTerminalSuccess',
  component: StripeTerminalSuccess,
  parameters: {
    docs: {
      page: null,
    },
  },
};
