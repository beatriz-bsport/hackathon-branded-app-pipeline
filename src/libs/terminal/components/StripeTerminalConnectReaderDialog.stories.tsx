import React from 'react';

import {
  StripeTerminalConnectReaderDialog,
  Props,
} from './StripeTerminalConnectReaderDialog.component';

const CustomTemplate = (args: Props) => (
  <StripeTerminalConnectReaderDialog {...args} />
);

export const LoadingScreen = CustomTemplate.bind({});

LoadingScreen.args = {
  displayForm: false,
  displaySuccess: false,
  displayError: false,
  isSubmitting: true,
};

export const SuccessScreen = CustomTemplate.bind({});

SuccessScreen.args = {
  displayForm: false,
  displaySuccess: true,
  displayError: false,
  isSubmitting: false,
};

export const ErrorScreen = CustomTemplate.bind({});

ErrorScreen.args = {
  displayForm: false,
  displaySuccess: false,
  displayError: true,
  isSubmitting: false,
};

export default {
  title: 'Library/Terminal/ConnectReaderDialog',
  component: StripeTerminalConnectReaderDialog,
  parameters: {
    docs: {
      page: null,
    },
  },
};
