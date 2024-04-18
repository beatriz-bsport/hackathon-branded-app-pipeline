import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import MemberVisitWarnings, { Props } from './MemberVisitWarnings.component';
import MemberVisitFactoryBot, {
  generateFakeAccessStatusData,
} from '#libs/access-control/factories';
import { AccessStatus } from '#libs/access-control/constants';

export default {
  title: 'Libs/AccessControl/MemberVisitWarnings',
  component: MemberVisitWarnings,
} as ComponentMeta<typeof MemberVisitWarnings>;

const MemberVisitWarningsTemplate: ComponentStory<
  typeof MemberVisitWarnings
> = (args: Props) => <MemberVisitWarnings {...args} />;

/** -------------------- CREATE FAKE DATA ---------------------- */

const accessStatusDataEverythingDisplayed = generateFakeAccessStatusData({
  hasNegativeAccountBalance: true,
  hasUnpaidAppointments: true,
  hasUnpaidInvoices: true,
  withMostRelevantConsumerPaymentPack: true,
  passIsValid: false,
  numberOfCheckedPasses: 5,
  passIsDisabled: true,
  passIsIncompatibleWithEstablishments: true,
  passIsLinkedToPausedSubscription: true,
  passIsRestrictedByOffPeakSchedule: true,
  passIsRestrictedToVod: true,
  numberOfBookingsInOtherEstablishments: 1,
});

const checkOnBookingsWarnings = generateFakeAccessStatusData({
  checkOnBookingsIsValid: false,
  numberOfBookingsInOtherEstablishments: 1,
  numberOfCheckedPasses: 1,
});

const noPassWarnings = generateFakeAccessStatusData({});

const checkOnPaymentPackWarnings = generateFakeAccessStatusData({
  passIsValid: false,
  numberOfCheckedPasses: 1,
  withMostRelevantConsumerPaymentPack: true,
  passIsDisabled: true,
  passIsIncompatibleWithEstablishments: true,
  passIsLinkedToPausedSubscription: true,
  passIsRestrictedByOffPeakSchedule: true,
  passIsRestrictedToVod: true,
});

const checkOnPrivatePassWarnings = generateFakeAccessStatusData({
  passIsValid: false,
  withMostRelevantPrivateConsumerPass: true,
  numberOfCheckedPasses: 1,
  passIsDisabled: true,
  passIsLinkedToPausedSubscription: true,
  passIsIncompatibleWithAppointmentsInEstablishments: true,
});

const checkOnMemberAccountWarnings = generateFakeAccessStatusData({
  hasNegativeAccountBalance: true,
  hasUnpaidAppointments: true,
  hasUnpaidInvoices: true,
  numberOfCheckedPasses: 1,
});

/** -------------------- STORIES ---------------------- */

export const OrangeAccessStatus = MemberVisitWarningsTemplate.bind({});
OrangeAccessStatus.args = {
  memberVisit: MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status_data: accessStatusDataEverythingDisplayed,
    access_status: AccessStatus.ORANGE,
  }),
};

export const RedAccessStatus = MemberVisitWarningsTemplate.bind({});
RedAccessStatus.args = {
  memberVisit: MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status_data: accessStatusDataEverythingDisplayed,
    access_status: AccessStatus.RED,
  }),
};

export const CheckOnBookings = MemberVisitWarningsTemplate.bind({});
CheckOnBookings.args = {
  memberVisit: MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status_data: checkOnBookingsWarnings,
    access_status: AccessStatus.ORANGE,
  }),
};

export const NoPass = MemberVisitWarningsTemplate.bind({});
NoPass.args = {
  memberVisit: MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status_data: noPassWarnings,
    access_status: AccessStatus.ORANGE,
  }),
};

export const CheckOnPaymentPack = MemberVisitWarningsTemplate.bind({});
CheckOnPaymentPack.args = {
  memberVisit: MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status_data: checkOnPaymentPackWarnings,
    access_status: AccessStatus.ORANGE,
  }),
};

export const CheckOnPrivatePass = MemberVisitWarningsTemplate.bind({});
CheckOnPrivatePass.args = {
  memberVisit: MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status_data: checkOnPrivatePassWarnings,
    access_status: AccessStatus.ORANGE,
  }),
};

export const CheckOnMemberAccount = MemberVisitWarningsTemplate.bind({});
CheckOnMemberAccount.args = {
  memberVisit: MemberVisitFactoryBot.MemberVisitREST.create(1, {
    access_status_data: checkOnMemberAccountWarnings,
    access_status: AccessStatus.ORANGE,
  }),
};
