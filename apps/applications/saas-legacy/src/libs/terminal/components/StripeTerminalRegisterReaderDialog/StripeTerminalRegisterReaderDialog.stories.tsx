import React from 'react';

import {
  StripeTerminalRegisterReaderDialogForStorybook,
  type Props,
} from '../StripeTerminalRegisterReaderDialog';

const CustomTemplate = (args: Props) => (
  <StripeTerminalRegisterReaderDialogForStorybook {...args} />
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
  title: 'Library/Terminal/RegisterReaderDialog',
  component: StripeTerminalRegisterReaderDialogForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
