import React from 'react';
import { ConsumerPassCardStorybook, ConsumerPassCardProps } from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';
import { paymentPackFactory } from '#libs/payment-packs/factory';
import { action } from '@storybook/addon-actions';
import { DateTime } from 'luxon';
import { LUXON_ISO_SHORT_DATE } from '#src/utils/datetime';

ConsumerPassCardStorybook.displayName = 'ConsumerPassCard';

const ActionData = {
  handleSeeDetails: action('handleSeeDetails'),
};
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
  totalCredits: fakeConsumerPass.available_credits.toString(),
  creditsLeft: (
    fakeConsumerPass.available_credits - fakeConsumerPass.used_credits
  ).toString(),
  passName: fakePaymentPack.name,
  expirationDate: DateTime.fromISO(fakeConsumerPass.ending_date).toFormat(
    LUXON_ISO_SHORT_DATE,
  ),
  startDate: DateTime.fromISO(fakeConsumerPass.starting_date).toFormat(
    LUXON_ISO_SHORT_DATE,
  ),
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
  startDate: DateTime.now().minus({ days: 10 }).toFormat(LUXON_ISO_SHORT_DATE),
  expirationDate: DateTime.now()
    .minus({ day: 1 })
    .toFormat(LUXON_ISO_SHORT_DATE),
};

export const FuturePass = ConsumerPassCardTemplate.bind({});
FuturePass.args = {
  ...defaultArgs,
  startDate: DateTime.now()
    .plus({ days: daysToAdd.start })
    .toFormat(LUXON_ISO_SHORT_DATE),
  expirationDate: DateTime.now()
    .plus({ days: daysToAdd.end })
    .toFormat(LUXON_ISO_SHORT_DATE),
};

export const ExpiresSoon = ConsumerPassCardTemplate.bind({});
ExpiresSoon.args = {
  ...defaultArgs,
  startDate: DateTime.now().minus({ days: 10 }).toFormat(LUXON_ISO_SHORT_DATE),
  expirationDate: DateTime.now()
    .plus({ days: daysToAdd.soon })
    .toFormat(LUXON_ISO_SHORT_DATE),
};

export const UnlimitedPass = ConsumerPassCardTemplate.bind({});
UnlimitedPass.args = {
  ...defaultArgs,
  isUnlimited: true,
};

export const Loading = ConsumerPassCardTemplate.bind({});
Loading.args = {
  isLoading: true,
};

export default {
  title: 'Component/Consumer-space/ConsumerPassCard',
  component: ConsumerPassCardStorybook,
  argTypes: {
    creditsLeft: {
      control: 'text',
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
      control: 'text',
      description:
        'Maximum number of credits the member can spend with the pass',
    },
  },
} as ComponentMeta<typeof ConsumerPassCardStorybook>;
