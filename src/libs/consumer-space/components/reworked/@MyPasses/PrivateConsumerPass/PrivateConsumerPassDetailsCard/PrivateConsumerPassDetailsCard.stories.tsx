import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';
import moment from 'moment-timezone';

import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { privatePassFactory } from '#libs/private-service/factory';
import { generateRandomName, generateRandomNames } from '#utils/factories';

import {
  PrivateConsumerPassDetailsCardStorybook,
  PrivateConsumerPassDetailsCardProps,
} from '.';

// To avoid storybook to crash using moment.add()
const monthToAdd = 1;

const fakeEstablishments = establishmentFactoryBot.Establishment.create(2);
const fakeMemberNames = generateRandomNames(faker, { count: 2 });
const fakePrivateConsumerPass = privatePassFactory();
const fakeAppointmentCompatibilities = Array.from(
  { length: faker.number.int({ min: 1, max: 4 }) },
  () => ({
    name: generateRandomName(faker),
    sessions: faker.lorem
      .words(faker.number.int({ min: 1, max: 4 }))
      .split(' '),
  }),
);

const PrivateConsumerPassDetailsCardTemplate: ComponentStory<
  typeof PrivateConsumerPassDetailsCardStorybook
> = (args: PrivateConsumerPassDetailsCardProps) => (
  <PrivateConsumerPassDetailsCardStorybook {...args} />
);

const PrivateConsumerPassDetailsCardMobileTemplate: ComponentStory<
  typeof PrivateConsumerPassDetailsCardStorybook
> = (args: PrivateConsumerPassDetailsCardProps) => (
  <PrivateConsumerPassDetailsCardStorybook {...args} />
);

const defaultArgs: PrivateConsumerPassDetailsCardProps = {
  appointmentCompatibilities: null,
  compatibleEstablishments: null,
  creditsLeft: faker.number.int(5),
  description: fakePrivateConsumerPass.description,
  expirationDate: moment().add(monthToAdd, 'months').format('YYYY-MM-DD'),
  isSuspended: false,
  isUnlimited: false,
  name: fakePrivateConsumerPass.name,
  mobileVersion: false,
  sharedBy: null,
  sharedWith: null,
  startDate: moment().subtract(1, 'months').format('YYYY-MM-DD'),
  suspensionDate: null,
  totalCredits: faker.number.int({ min: 5, max: 10 }),
  isCompatibleWithVod: null,
};
const mobileParameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};

export const EverythingDisplayed = PrivateConsumerPassDetailsCardTemplate.bind(
  {},
);
EverythingDisplayed.args = {
  ...defaultArgs,
  appointmentCompatibilities: [
    ...fakeAppointmentCompatibilities,
    { name: 'Appointment with all sessions', sessions: [] },
  ],
  vod: true,
  compatibleEstablishments: fakeEstablishments,
  sharedBy: fakeMemberNames,
};

export const DefaultPass = PrivateConsumerPassDetailsCardTemplate.bind({});
DefaultPass.args = {
  ...defaultArgs,
};

export const WithAppointmentCompatibilities =
  PrivateConsumerPassDetailsCardTemplate.bind({});
WithAppointmentCompatibilities.args = {
  ...defaultArgs,
  appointmentCompatibilities: [
    ...fakeAppointmentCompatibilities,
    { name: 'Appointment with all sessions', sessions: [] },
  ],
};

export const WithCompatibleEstablishments =
  PrivateConsumerPassDetailsCardTemplate.bind({});
WithCompatibleEstablishments.args = {
  ...defaultArgs,
  compatibleEstablishments: fakeEstablishments,
};

export const WithSharedBy = PrivateConsumerPassDetailsCardTemplate.bind({});
WithSharedBy.args = {
  ...defaultArgs,
  sharedBy: fakeMemberNames,
};

export const WithSharedWith = PrivateConsumerPassDetailsCardTemplate.bind({});
WithSharedWith.args = {
  ...defaultArgs,
  sharedWith: fakeMemberNames,
};

export const WithVod = PrivateConsumerPassDetailsCardTemplate.bind({});
WithVod.args = {
  ...defaultArgs,
  vod: true,
};

export const isUnlimited = PrivateConsumerPassDetailsCardTemplate.bind({});
isUnlimited.args = {
  ...defaultArgs,
  isUnlimited: true,
};

export const isSuspended = PrivateConsumerPassDetailsCardTemplate.bind({});
isSuspended.args = {
  ...defaultArgs,
  isSuspended: true,
};

export const isSuspendedWithSuspensionDate =
  PrivateConsumerPassDetailsCardTemplate.bind({});
isSuspendedWithSuspensionDate.args = {
  ...defaultArgs,
  isSuspended: true,
  suspensionDate: moment().format('YYYY-MM-DD'),
};

export const isFuture = PrivateConsumerPassDetailsCardTemplate.bind({});
isFuture.args = {
  ...defaultArgs,
  startDate: moment().add(monthToAdd, 'month').format('YYYY-MM-DD'),
};

export const isExpired = PrivateConsumerPassDetailsCardTemplate.bind({});
isExpired.args = {
  ...defaultArgs,
  expirationDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
};

export const MobileVersion = PrivateConsumerPassDetailsCardMobileTemplate.bind(
  {},
);
MobileVersion.args = {
  ...defaultArgs,
  mobileVersion: true,
};
MobileVersion.parameters = mobileParameters;

export default {
  title: 'Library/Consumer-space/PrivateConsumerPassDetailsCard',
  component: PrivateConsumerPassDetailsCardStorybook,
  argTypes: {
    appointmentCompatibilities: {
      control: 'object',
      description:
        'If the pass is an appointment pass, this props indicates which appointments and/or sessions are compatible with it',
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
    totalCredits: {
      control: 'number',
      description: 'The pass total initial credits',
    },
    isCompatibleWithVod: {
      control: 'boolean',
      description: 'The pass is compatible with VOD',
    },
  },
} as ComponentMeta<typeof PrivateConsumerPassDetailsCardStorybook>;
