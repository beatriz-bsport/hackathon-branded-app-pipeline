import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import establishmentFactoryBot from '#libs/establishment/factories/Establishments';
import { privatePassFactory } from '#libs/private-service/factory';
import { generateRandomName, generateRandomNames } from '#utils/factories';

import {
  PrivateConsumerPassDetailsCardStorybook,
  PrivateConsumerPassDetailsCardProps,
} from '.';
import { DateTime } from 'luxon';

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
  expirationDate: DateTime.now().plus({ months: monthToAdd }).toISODate(),
  isSuspended: false,
  isUnlimited: false,
  name: fakePrivateConsumerPass.name,
  isMobile: false,
  sharedBy: null,
  sharedWith: null,
  startDate: DateTime.now().minus({ month: 1 }).toISODate(),
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
  suspensionDate: DateTime.now().toISODate(),
};

export const isFuture = PrivateConsumerPassDetailsCardTemplate.bind({});
isFuture.args = {
  ...defaultArgs,
  startDate: DateTime.now().plus({ months: monthToAdd }).toISODate(),
};

export const isExpired = PrivateConsumerPassDetailsCardTemplate.bind({});
isExpired.args = {
  ...defaultArgs,
  expirationDate: DateTime.now().minus({ month: 1 }).toISODate(),
};

export const MobileVersion = PrivateConsumerPassDetailsCardMobileTemplate.bind(
  {},
);
MobileVersion.args = {
  ...defaultArgs,
  isMobile: true,
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
    isMobile: {
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
