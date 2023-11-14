import React from 'react';

import StripeTerminalError, { Props } from '../StripeTerminalError';

const StripeTerminalErrorTemplate = (args: Props) => (
  <div style={{ maxWidth: '50vw' }}>
    <StripeTerminalError {...args} />
  </div>
);

export const ExpiredCardPaymentError = StripeTerminalErrorTemplate.bind({});

ExpiredCardPaymentError.args = {
  onClose: () => {},
  isSetupIntent: false,
  error: { code: 'expired_card' },
};

export const ExpiredCardSaveError = StripeTerminalErrorTemplate.bind({});

ExpiredCardSaveError.args = {
  onClose: () => {},
  isSetupIntent: true,
  error: { code: 'expired_card' },
};

export const GenericPaymentError = StripeTerminalErrorTemplate.bind({});

GenericPaymentError.args = {
  onClose: () => {},
  isSetupIntent: false,
};

export default {
  title: 'Library/Terminal/StripeTerminalError',
  component: StripeTerminalError,
  parameters: {
    docs: {
      page: null,
    },
  },
};
