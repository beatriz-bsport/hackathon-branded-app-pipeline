import React, { useState } from 'react';

import {
  SubscriptionTermsForStorybook,
  Props,
} from './SubscriptionTerms.component';

const SubscriptionTermsTemplate = (args: Props) => (
  <div
    style={{
      width: '774px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {
      // @ts-ignore
      <SubscriptionTermsForStorybook {...args} />
    }
  </div>
);

export const SubscriptionTerms = SubscriptionTermsTemplate.bind({});

SubscriptionTerms.args = {
  contractTerms:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  isContractLegalTermsAccepted: false,
};

export default {
  title: 'Subscription/CssOnly/SubscriptionTerms',
  component: SubscriptionTermsForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
