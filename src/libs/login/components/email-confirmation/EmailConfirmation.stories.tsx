import React from 'react';
import { EmailConfirmationForStorybook } from './EmailConfirmation.component';

const EmailConfirmationTemplate = (args: {}) => (
  // @ts-expect-error
  <EmailConfirmationForStorybook {...args} />
);

export const Validation = EmailConfirmationTemplate.bind({});
Validation.args = {
  // color: 'red',
  goBackToLogin: () => {
    console.log('oui');
  },
  canBeResent: true,
  resendEmailForConfirmation: () => {
    console.log('oui');
  },
};

export default {
  title: 'Components/Login/EmailConfirmation',
  parameters: {
    docs: {
      page: null,
    },
  },
};
