import React from 'react';
import { ConsumerSubscriptionCardStorybook } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { subscriptionFactory } from '#libs/subscription/factory';
import { DateTime } from 'luxon';

ConsumerSubscriptionCardStorybook.displayName = 'ConsumerSubscriptionCard';
const SUBSCRIPTION = subscriptionFactory();

const ConsumerSubscriptionCardTemplate: ComponentStory<
  typeof ConsumerSubscriptionCardStorybook
> = (args) => {
  return <ConsumerSubscriptionCardStorybook {...args} />;
};

const defaultArgs = {
  recurrence: SUBSCRIPTION.recurrence_basis,
  subscriptionName: SUBSCRIPTION.name_without_member_name,
  subscriptionDate: DateTime.fromISO(SUBSCRIPTION.first_billing_date).toFormat(
    'D',
  ),
  price: SUBSCRIPTION.recurrent_price.toString(),
};

export const ConsumerSubscriptionCardDefault =
  ConsumerSubscriptionCardTemplate.bind({});
ConsumerSubscriptionCardDefault.args = defaultArgs;

export const ConsumerSubscriptionCardFailedPayments =
  ConsumerSubscriptionCardTemplate.bind({});
ConsumerSubscriptionCardFailedPayments.args = {
  ...defaultArgs,
  hasFailedPayments: true,
};

export const ConsumerSubscriptionCardIsPaused =
  ConsumerSubscriptionCardTemplate.bind({});
ConsumerSubscriptionCardIsPaused.args = {
  ...defaultArgs,
  isPaused: true,
};

export const ConsumerSubscriptionCardMissingPaymentMethod =
  ConsumerSubscriptionCardTemplate.bind({});
ConsumerSubscriptionCardMissingPaymentMethod.args = {
  ...defaultArgs,
  hasMissingPaymentMethod: true,
};

export const ConsumerSubscriptionCardNextPaymentDate =
  ConsumerSubscriptionCardTemplate.bind({});
ConsumerSubscriptionCardNextPaymentDate.args = {
  ...defaultArgs,
  subscriptionNextPaymentDate: DateTime.fromISO(
    SUBSCRIPTION.next_billing_date,
  ).toFormat('D'),
};

export const ConsumerSubscriptionCardLoading =
  ConsumerSubscriptionCardTemplate.bind({});
ConsumerSubscriptionCardLoading.args = { isLoading: true };

export default {
  title: 'ConsumerSpace/ConsumerSubscriptionCard',
  component: ConsumerSubscriptionCardStorybook,
  argTypes: {
    addPaymentMethodDisabled: {
      description: 'Indicate if Add payment method button is disabled',
      control: 'boolean',
      defaultValue: false,
    },
    hasFailedPayments: {
      description: 'Indicate if subscription has failed payments',
      control: 'boolean',
      defaultValue: false,
    },
    hasMissingPaymentMethod: {
      description: 'Indicate if subscription has no payment method associated',
      control: 'boolean',
      defaultValue: false,
    },
    isDetailsDisabled: {
      description: 'Indicate if See details button is disabled',
      control: 'boolean',
      defaultValue: false,
    },
    isLoading: {
      description: 'Loading state',
      control: 'boolean',
      defaultValue: false,
    },
    isPaused: {
      description: 'Indicate if subscription is currently in pause',
      control: 'boolean',
      defaultValue: false,
    },
    isSelected: {
      description: 'Indicate if subscription card is selected',
      control: 'boolean',
      defaultValue: false,
    },
    price: { description: 'Price displayed ', control: 'text' },
    recurrence: {
      description: 'Recurrence of the subscription',
      control: 'number',
    },
    subscriptionDate: {
      description: 'Date of the subscription',
      control: 'text',
      defaultValue: '',
    },
    subscriptionInterval: {
      description: 'Interval of the subscription',
      control: 'inline-radio',
      options: ['day', 'week', 'month', 'year'],
    },
    subscriptionName: {
      description: 'Name of the subscription',
      control: 'text',
      defaultValue: '',
    },
    subscriptionNextPaymentDate: {
      description: 'Next payment date',
      control: 'text',
      defaultValue: '',
    },
  },
} as ComponentMeta<typeof ConsumerSubscriptionCardStorybook>;
