import React from 'react';
import type { OptionCallback } from '../../../../state/types';

import { STRIPE_ERROR_CODE } from '#src/libs/constants';
import StripeTerminalProcessing, { Props } from '../StripeTerminalProcessing';

const mockStripeAPIException = (code: string) => {
  return {
    response: {
      status: STRIPE_ERROR_CODE,
      data: {
        code,
      },
    },
  } as unknown as Error;
};

const StripeTerminalProcessingTemplate = (args: Props) => (
  <div style={{ maxWidth: '50vw' }}>
    <StripeTerminalProcessing {...args} />
  </div>
);

export const TerminalPaymentProcessing = StripeTerminalProcessingTemplate.bind(
  {},
);

TerminalPaymentProcessing.args = {
  onlySavePaymentMethod: false,
  cancelReaderActionProcessing: false,
  onCancelReaderAction: () => {},
  shouldDisplayInactivityWarning: false,
};

export const TerminalPaymentBeingCancelled =
  StripeTerminalProcessingTemplate.bind({});

TerminalPaymentBeingCancelled.args = {
  onlySavePaymentMethod: false,
  cancelReaderActionProcessing: true,
  onCancelReaderAction: () => {},
  shouldDisplayInactivityWarning: false,
};

export const TerminalSavePaymentMethodProcessing =
  StripeTerminalProcessingTemplate.bind({});

TerminalSavePaymentMethodProcessing.args = {
  onlySavePaymentMethod: true,
  cancelReaderActionProcessing: false,
  onCancelReaderAction: () => {},
  shouldDisplayInactivityWarning: false,
};

export const TerminalTooLateToCancel = StripeTerminalProcessingTemplate.bind(
  {},
);

TerminalTooLateToCancel.args = {
  onlySavePaymentMethod: false,
  cancelReaderActionProcessing: false,
  onCancelReaderAction: (options: OptionCallback) => {
    options.onError?.(mockStripeAPIException('terminal_reader_busy'));
  },
};

export const TerminalCancelUnknownError = StripeTerminalProcessingTemplate.bind(
  {},
);

TerminalCancelUnknownError.args = {
  onlySavePaymentMethod: false,
  cancelReaderActionProcessing: false,
  onCancelReaderAction: (options: OptionCallback) => {
    options.onError?.(mockStripeAPIException('foo'));
  },
  shouldDisplayInactivityWarning: false,
};

export const TerminalInactivityReminder = StripeTerminalProcessingTemplate.bind(
  {},
);

TerminalInactivityReminder.args = {
  onlySavePaymentMethod: false,
  shouldDisplayInactivityWarning: true,
  cancelReaderActionProcessing: false,
  onCancelReaderAction: (options: OptionCallback) => {
    options.onError?.(mockStripeAPIException('foo'));
  },
};

export default {
  title: 'Library/Terminal/StripeTerminalProcessing',
  component: StripeTerminalProcessing,
  parameters: {
    docs: {
      page: null,
    },
  },
};
