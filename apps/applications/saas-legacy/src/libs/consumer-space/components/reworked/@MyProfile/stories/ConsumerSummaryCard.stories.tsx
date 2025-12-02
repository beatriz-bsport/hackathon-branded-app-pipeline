import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ConsumerSummaryCard, {
  ConsumerSummaryCardStorybook,
} from '../ConsumerProfileCards/ConsumerSummaryCard';

import { MemberFactory } from '#src/libs/member/factories/Member';
import type { ConsumerSummaryCardProps } from '../types';

export default {
  title: 'ConsumerSpace/ConsumerSummaryCard',
  component: ConsumerSummaryCard,
} as ComponentMeta<typeof ConsumerSummaryCardStorybook>;

const member = MemberFactory({});

const defaultArgs: Omit<
  ConsumerSummaryCardProps,
  'showAccountBalance' | 'showBarcodeButton' | 'showMembershipNumber'
> = {
  acceptEmail: member.accept_email,
  acceptSms: member.accept_sms,
  address: {
    address_line_1: 'Carrer de la Butifarra, 7',
    address_line_2: '2/2A',
    city: 'Barcelona',
    country: 'Spain',
    state: null,
    zipcode: '08012',
  },
  birthday: member.birthday,
  companyId: 1,
  creditAccountBalance: member.credit_account_balance,
  email: member.email,
  emergencyContact: member.emergency_contact,
  firstName: member.firstname,
  gender: member.gender,
  lastName: member.lastname,
  memberId: member.id,
  membershipId: member.membership_ID,
  officialDocumentId: member.official_document_id,
  phoneNumber: member.official_document_id,
  photo: member.photo,
  spiviPrivacySettingsAccepted: member.spivi_privacy_settings_accepted,
  spiviPrivacySettingsLoading: false,
  isLoading: false,
  regularizeBalanceAllowed: false,
  updateSpiviPrivacySettings: () => {},
};

const Template: ComponentStory<typeof ConsumerSummaryCard> = (
  args: ConsumerSummaryCardProps,
) => <ConsumerSummaryCardStorybook {...args} />;

export const Default = Template.bind({});
Default.args = defaultArgs;
