import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MemberVisitDetailsCard, {
  Props,
} from './MemberVisitDetailsCard.component';
import { AccessStatus } from '#libs/access-control/constants';

import MemberVisitFactoryBot, {
  generateFakeAccessStatusData,
} from '#libs/access-control/factories';
import { consumerBookingFactory } from '#libs/booking/factories';

const booking = consumerBookingFactory();

const actionsData = {
  onMemberProfileClick: action('onMemberProfileClick'),
  onMemberBillClick: action('onMemberBillClick'),
  onAllowManualEntry: action('onAllowManualEntry'),
  onRefuseManualEntry: action('onRefuseManualEntry'),
};

export default {
  title: 'Libs/AccessControl/MemberVisitDetailsCard',
  component: MemberVisitDetailsCard,
  argTypes: {
    memberVisit: {
      control: 'object',
      description: 'The member visit information, coming from the backend',
    },
    locationInformation: {
      control: 'text',
      description:
        'The location information where the check-in has been performed',
    },
    nextBooking: {
      control: 'object',
      description: "The member's next booking, coming from the backend",
    },
    isLoading: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof MemberVisitDetailsCard>;

const MemberVisitDetailsCardTemplate: ComponentStory<
  typeof MemberVisitDetailsCard
> = (args: Props) => <MemberVisitDetailsCard {...actionsData} {...args} />;

const everythingDisplayedAccessStatusData = generateFakeAccessStatusData({
  checkOnBookingsIsValid: true,
  checkOnPassesIsValid: true,
  withMostRelevantConsumerPaymentPack: true,
});

const everythingDisplayedMemberVisit =
  MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status: AccessStatus.ORANGE,
    access_status_data: everythingDisplayedAccessStatusData,
    initial_access_status: AccessStatus.RED,
  });

const validAccessStatusData = generateFakeAccessStatusData({
  checkOnBookingsIsValid: true,
  checkOnPassesIsValid: true,
});

const validMemberVisit = MemberVisitFactoryBot.MemberVisitREST.create(1, {
  access_status: AccessStatus.GREEN,
  access_status_data: validAccessStatusData,
  initial_access_status: null,
});

const warningMemberVisit = MemberVisitFactoryBot.MemberVisitREST.create(1, {
  access_status: AccessStatus.ORANGE,
  initial_access_status: null,
});

const errorMemberVisit = MemberVisitFactoryBot.MemberVisitREST.create(1, {
  access_status: AccessStatus.RED,
  initial_access_status: null,
});

export const EverythingDisplayed = MemberVisitDetailsCardTemplate.bind({});
EverythingDisplayed.args = {
  memberVisit: everythingDisplayedMemberVisit,
  locationInformation:
    'Location Information (where the check-in has been performed)',
  nextBooking: { type: 'booking', booking },
};

export const ValidMemberVisit = MemberVisitDetailsCardTemplate.bind({});
ValidMemberVisit.args = {
  memberVisit: validMemberVisit,
};

export const WarningMemberVisit = MemberVisitDetailsCardTemplate.bind({});
WarningMemberVisit.args = {
  memberVisit: warningMemberVisit,
};

export const ErrorMemberVisit = MemberVisitDetailsCardTemplate.bind({});
ErrorMemberVisit.args = {
  memberVisit: errorMemberVisit,
};

export const Loading = MemberVisitDetailsCardTemplate.bind({});
Loading.args = {
  isLoading: true,
};
