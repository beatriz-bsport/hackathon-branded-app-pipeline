import React from 'react';
import { ConsumerPassCardStorybook, ConsumerPassCardProps } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';
import { paymentPackFactory } from '#libs/payment-packs/factory';
import { action } from '@storybook/addon-actions';
import moment from 'moment';

ConsumerPassCardStorybook.displayName = 'ConsumerPassCard';

const ActionData = {
  handleSeeDetails: action('handleSeeDetails'),
};
// To avoid storybook to crash using moment.add()
const daysToAdd = {
  start: 3,
  end: 10,
  soon: 1,
};

const fakeConsumerPass = consumerPaymentPackFactory();
const fakePaymentPack = paymentPackFactory();

const ConsumerPassCardTemplate: ComponentStory<
  typeof ConsumerPassCardStorybook
> = (args: ConsumerPassCardProps) => {
  return <ConsumerPassCardStorybook {...args} />;
};

const defaultArgs = {
  handleSeeDetails: ActionData.handleSeeDetails,
  totalCredits: fakeConsumerPass.available_credits,
  creditsLeft:
    fakeConsumerPass.available_credits - fakeConsumerPass.used_credits,
  passName: fakePaymentPack.name,
  expirationDate: moment(fakeConsumerPass.ending_date).format('YYYY-MM-DD'),
  startDate: moment(fakeConsumerPass.starting_date).format('YYYY-MM-DD'),
  isShared: false,
  isSuspended: false,
  isUnlimited: false,
};

export const EverythingDisplayed = ConsumerPassCardTemplate.bind({});
EverythingDisplayed.args = {
  ...defaultArgs,
  isMultistudio: true,
  isShared: true,
  isSuspended: true,
};

export const ExpiredPass = ConsumerPassCardTemplate.bind({});
ExpiredPass.args = {
  ...defaultArgs,
  startDate: moment().subtract(10, 'days').format('YYYY-MM-DD'),
  expirationDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
};

export const FuturePass = ConsumerPassCardTemplate.bind({});
FuturePass.args = {
  ...defaultArgs,
  startDate: moment().add(daysToAdd.start, 'days').format('YYYY-MM-DD'),
  expirationDate: moment().add(daysToAdd.end, 'days').format('YYYY-MM-DD'),
};

export const ExpiresSoon = ConsumerPassCardTemplate.bind({});
ExpiresSoon.args = {
  ...defaultArgs,
  startDate: moment().subtract(10, 'days').format('YYYY-MM-DD'),
  expirationDate: moment().add(daysToAdd.soon, 'days').format('YYYY-MM-DD'),
};

export const UnlimitedPass = ConsumerPassCardTemplate.bind({});
UnlimitedPass.args = {
  ...defaultArgs,
  isUnlimited: true,
};

export default {
  title: 'Component/Consumer-space/ConsumerPassCard',
  component: ConsumerPassCardStorybook,
  argTypes: {
    creditsLeft: {
      control: 'number',
      description: 'Number of credits the member can still use',
    },
    expirationDate: {
      control: 'date',
      description: 'End date for the validity of the pass',
    },
    handleSeeDetails: {
      action: 'clicked',
      description: 'Callback called when clicking on "See details" button',
    },
    isMultistudio: {
      control: 'boolean',
      description: 'Indicates if the pass has a multi-studio scope',
    },
    isShared: {
      control: 'boolean',
      description: 'Indicates if the pack is shared with another member',
    },
    isSuspended: {
      control: 'boolean',
      description: 'Indicates if the pass has been suspended by a manager',
    },
    isUnlimited: {
      control: 'boolean',
      description:
        'Indicates if the pass is unlimited. If true, creditsLeft and totalCredits are unused',
    },
    passName: {
      control: 'text',
      description: 'Name of the pass',
    },
    startDate: {
      control: 'date',
      description: 'Start date for the validity of the pass',
    },
    totalCredits: {
      control: 'number',
      description:
        'Maximum number of credits the member can spend with the pass',
    },
  },
} as ComponentMeta<typeof ConsumerPassCardStorybook>;
