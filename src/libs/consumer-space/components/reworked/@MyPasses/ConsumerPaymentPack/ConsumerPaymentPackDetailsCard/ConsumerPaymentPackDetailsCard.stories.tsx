import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';
import { generateRandomName, generateRandomNames } from '#utils/factories';

import {
  ConsumerPaymentPackDetailsCardStorybook,
  ConsumerPaymentPackDetailsCardProps,
} from '.';

// To avoid storybook to crash using moment.add()
const monthToAdd = 1;

const fakeEstablishments = establishmentFactoryBot.Establishment.create(2);
const fakeMemberNames = generateRandomNames(faker, { count: 2 });
const fakeConsumerPaymentPack = consumerPaymentPackFactory({
  availableCredits: faker.number.int({ min: 5, max: 10 }),
  usedCredits: faker.number.int(5),
});
const fakeActivityCompatibilities = Array.from(
  { length: faker.number.int({ min: 1, max: 4 }) },
  () => ({
    type: 'activity',
    label: generateRandomName(faker),
  }),
);
const fakeCategoryCompatibilities = Array.from(
  { length: faker.number.int({ min: 1, max: 4 }) },
  () => ({
    type: 'category',
    label: generateRandomName(faker),
  }),
);
const fakeRoomCompatibilities = Array.from(
  { length: faker.number.int({ min: 1, max: 4 }) },
  () => ({
    type: 'room',
    label: generateRandomName(faker),
  }),
);
const fakeTimeSlots = Array.from(
  { length: faker.number.int({ min: 1, max: 8 }) },
  () => ({
    dayOfWeek: faker.number.int(6),
    from: `${faker.number.int(23)}:${faker.number.int(59)}`,
    to: `${faker.number.int(23)}:${faker.number.int(59)}`,
  }),
);
const fakeRestriction = {
  frequency: ['month', 'day', 'week'][faker.number.int({ min: 0, max: 2 })],
  amount: faker.number.int(5),
};

const ConsumerPaymentPackDetailsCardTemplate: ComponentStory<
  typeof ConsumerPaymentPackDetailsCardStorybook
> = (args: ConsumerPaymentPackDetailsCardProps) => (
  <ConsumerPaymentPackDetailsCardStorybook {...args} />
);

const ConsumerPaymentPackDetailsCardMobileTemplate: ComponentStory<
  typeof ConsumerPaymentPackDetailsCardStorybook
> = (args: ConsumerPaymentPackDetailsCardProps) => (
  <ConsumerPaymentPackDetailsCardStorybook {...args} />
);

const defaultArgs: ConsumerPaymentPackDetailsCardProps = {
  activityCompatibilities: null,
  isCompatibleWithBookingForGuest: false,
  compatibleEstablishments: null,
  creditsLeft:
    fakeConsumerPaymentPack.available_credits -
    fakeConsumerPaymentPack.used_credits,
  description: fakeConsumerPaymentPack.payment_pack.description,
  expirationDate: fakeConsumerPaymentPack.ending_date,
  isSuspended: false,
  isUnlimited: false,
  name: fakeConsumerPaymentPack.payment_pack.name,
  mobileVersion: false,
  restriction: null,
  sharedBy: null,
  sharedWith: null,
  startDate: fakeConsumerPaymentPack.starting_date,
  suspensionDate: null,
  timeSlots: null,
  totalCredits: fakeConsumerPaymentPack.available_credits,
  isCompatibleWithVod: null,
};
const mobileParameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};

export const EverythingDisplayed = ConsumerPaymentPackDetailsCardTemplate.bind(
  {},
);
EverythingDisplayed.args = {
  ...defaultArgs,
  activityCompatibilities: [
    ...fakeActivityCompatibilities,
    ...fakeRoomCompatibilities,
    ...fakeCategoryCompatibilities,
  ],
  timeSlots: fakeTimeSlots,
  bookingForGuest: true,
  vod: true,
  compatibleEstablishments: fakeEstablishments,
  restriction: fakeRestriction,
  sharedBy: fakeMemberNames,
};

export const DefaultPass = ConsumerPaymentPackDetailsCardTemplate.bind({});
DefaultPass.args = {
  ...defaultArgs,
};

export const WithActivityCompatibilities =
  ConsumerPaymentPackDetailsCardTemplate.bind({});
WithActivityCompatibilities.args = {
  ...defaultArgs,
  activityCompatibilities: [
    ...fakeActivityCompatibilities,
    ...fakeRoomCompatibilities,
    ...fakeCategoryCompatibilities,
  ],
};

export const WithTimeSlotCompatibilities =
  ConsumerPaymentPackDetailsCardTemplate.bind({});
WithTimeSlotCompatibilities.args = {
  ...defaultArgs,
  timeSlots: fakeTimeSlots,
};

export const WithCompatibleEstablishments =
  ConsumerPaymentPackDetailsCardTemplate.bind({});
WithCompatibleEstablishments.args = {
  ...defaultArgs,
  compatibleEstablishments: fakeEstablishments,
};

export const WithSharedBy = ConsumerPaymentPackDetailsCardTemplate.bind({});
WithSharedBy.args = {
  ...defaultArgs,
  sharedBy: fakeMemberNames,
};

export const WithSharedWith = ConsumerPaymentPackDetailsCardTemplate.bind({});
WithSharedWith.args = {
  ...defaultArgs,
  sharedWith: fakeMemberNames,
};

export const WithBookingForGuest = ConsumerPaymentPackDetailsCardTemplate.bind(
  {},
);
WithBookingForGuest.args = {
  ...defaultArgs,
  bookingForGuest: true,
};

export const WithVod = ConsumerPaymentPackDetailsCardTemplate.bind({});
WithVod.args = {
  ...defaultArgs,
  vod: true,
};

export const WithRestrictions = ConsumerPaymentPackDetailsCardTemplate.bind({});
WithRestrictions.args = {
  ...defaultArgs,
  restriction: fakeRestriction,
};

export const isUnlimited = ConsumerPaymentPackDetailsCardTemplate.bind({});
isUnlimited.args = {
  ...defaultArgs,
  isUnlimited: true,
};

export const isSuspended = ConsumerPaymentPackDetailsCardTemplate.bind({});
isSuspended.args = {
  ...defaultArgs,
  isSuspended: true,
};

export const isSuspendedWithSuspensionDate =
  ConsumerPaymentPackDetailsCardTemplate.bind({});
isSuspendedWithSuspensionDate.args = {
  ...defaultArgs,
  isSuspended: true,
  suspensionDate: moment().format('YYYY-MM-DD'),
};

export const isFuture = ConsumerPaymentPackDetailsCardTemplate.bind({});
isFuture.args = {
  ...defaultArgs,
  startDate: moment().add(monthToAdd, 'month').format('YYYY-MM-DD'),
};

export const isExpired = ConsumerPaymentPackDetailsCardTemplate.bind({});
isExpired.args = {
  ...defaultArgs,
  expirationDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
};

export const MobileVersion = ConsumerPaymentPackDetailsCardMobileTemplate.bind(
  {},
);
MobileVersion.args = {
  ...defaultArgs,
  mobileVersion: true,
};
MobileVersion.parameters = mobileParameters;

export default {
  title: 'Library/Consumer-space/ConsumerPaymentPackDetailsCard',
  component: ConsumerPaymentPackDetailsCardStorybook,
  argTypes: {
    activityCompatibilities: {
      control: 'object',
      description:
        'If the pass is an activity pass, this props indicates which categories, activities or rooms are compatible with it',
    },
    isCompatibleWithBookingForGuest: {
      control: 'boolean',
      description:
        'The pass is compatible with booking for guests (activity passes only)',
    },
    compatibleEstablishments: {
      control: 'object',
      description: 'List of the studios the pass is compatible with',
    },
    creditsLeft: {
      control: 'number',
      description: 'Number of credits available left',
    },
    description: {
      control: 'text',
      description: 'The pass description',
    },
    expirationDate: {
      control: 'date',
      description: 'The pass expiration date',
    },
    isSuspended: {
      control: 'boolean',
      description: 'The pass is suspended',
    },
    isUnlimited: {
      control: 'boolean',
      description: 'The pass has unlimited credits',
    },
    name: {
      control: 'text',
      description: 'The pass name',
    },
    mobileVersion: {
      control: 'boolean',
      description:
        'Should wrap the component in a card. Set it true in mobile version',
    },
    restriction: {
      control: 'object',
      description: 'The pass restrictions data',
    },
    sharedBy: {
      control: 'object',
      description: 'The pass is shared by these members',
    },
    sharedWith: {
      control: 'object',
      description: 'The pass is shared with these members',
    },
    startDate: {
      control: 'date',
      description: 'The pass start date',
    },
    suspensionDate: {
      control: 'date',
      description: 'The pass suspension date',
    },
    timeSlots: {
      control: 'object',
      description:
        'The pass is compatible with these time slots (activity passes only)',
    },
    totalCredits: {
      control: 'number',
      description: 'The pass total initial credits',
    },
    isCompatibleWithVod: {
      control: 'boolean',
      description: 'The pass is compatible with VOD',
    },
  },
} as ComponentMeta<typeof ConsumerPaymentPackDetailsCardStorybook>;
