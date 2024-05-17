import React from 'react';

import {
  SubscriptionRecapForStorybook,
  Props,
} from './SubscriptionRecap.component';

const SubscriptionRecapTemplate = (args: Props) => (
  // @ts-expect-error
  <div
    style={{
      width: '342px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {
      // @ts-expect-error
      <SubscriptionRecapForStorybook {...args} />
    }
  </div>
);

export const SubscriptionRecapWithoutProrate = SubscriptionRecapTemplate.bind(
  {},
);
SubscriptionRecapWithoutProrate.args = {
  contract: {
    name: 'Contract name',
    recurrent_price: 30,
    tax: 20,
    payment_pack: { credits: 5 },
    recurrence_basis: 2,
    interval: 'month',
  },
  hideCredits: false,
};

export const SubscriptionRecapWithProrate = SubscriptionRecapTemplate.bind({});
SubscriptionRecapWithProrate.args = {
  contract: {
    name: 'Contract name',
    recurrent_price: 30,
    tax: 20,
    payment_pack: { credits: 5 },
    recurrence_basis: 1,
    interval: 'month',
    month_billing_day: 5,
  },
  hideCredits: false,
};

export default {
  title: 'Subscription/SubscriptionRecap',
  component: SubscriptionRecapForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
