import React from 'react'
import AccountConfigurationStepper, { OwnProps } from './AccountConfigurationStepper.component';

const CustomTemplate = (args: OwnProps) => (
    <AccountConfigurationStepper {...args} />
);

export const AllVisited = CustomTemplate.bind({});

AllVisited.args = {
  steps: [{ step: 'stripeStep', visited: true },
    { step: 'bankAccountStep', visited: true },
    { step: 'paymentMethodStep', visited: true },
  ]
} as OwnProps;

export const NoVisited = CustomTemplate.bind({});

NoVisited.args = {
  steps: [{ step: 'stripeStep', visited: false },
    { step: 'bankAccountStep', visited: false },
    { step: 'paymentMethodStep', visited: false },
  ]
} as OwnProps;

export default {
    title: 'Components/Login/AccountConfigurationStepper',
    component: AccountConfigurationStepper,
    parameters: {
        docs: {
            page: null
        }
    },
};
