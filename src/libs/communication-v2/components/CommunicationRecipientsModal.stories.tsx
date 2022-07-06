import React from 'react';
import CommunicationRecipientsModal, { Props } from './CommunicationRecipientsModal.component';
import MembersFactory from '#libs/member/factories/Member';

import {
  COMMUNICATION_RECIPIENT_BOOKINGS,
  COMMUNICATION_RECIPIENT_WAITING_LIST,
} from '@bsport/common/lib/master-data/communication-filters';

const CustomTemplate = (args: Props) => <CommunicationRecipientsModal {...args} />;

const membersList = MembersFactory(8);
const allIds : number[] = [];
membersList.forEach((member) => allIds.push(member.id));

const defaultOptions = {
  allIds: allIds,
  fullScreen: false,
  membersList: membersList,
  open: true,
  loadingMembersList: false,
  fetchPage: (page: number) => console.log("Go to the page ", page),
  setRecipients: (selectedIds: number[]) => console.log("These are the selected ids : ", selectedIds),
  setUncheckedMembers: (members: number[]) => console.log('These are the unchecked members ', members),
}
export const EmailState = CustomTemplate.bind({});

EmailState.args = {
  ...defaultOptions,
  pageSize:10,
  allIdsWithoutPhone: null ,
  allIdsWithoutEmail: allIds.slice(1,4),
  hasFilters: true,
  setSelectedFilters: (numbers: number[]) => console.log(numbers),
  selectedFilters: [
    COMMUNICATION_RECIPIENT_BOOKINGS,
    COMMUNICATION_RECIPIENT_WAITING_LIST
  ],
  kind: 0,
};

export const SmsState = CustomTemplate.bind({});

SmsState.args = {
  ... defaultOptions,
  pageSize:6,
  allIdsWithoutPhone: allIds.slice(2,7),
  allIdsWithoutEmail: [],
  uncheckedMembers: [2,3],
  hasFilters: false,
  kind: 1,
}

export const NotificationState = CustomTemplate.bind({});

NotificationState.args = {
  ...defaultOptions,
  pageSize:8,
  allIds: undefined,
  allIdsWithoutEmail: allIds.slice(1,4),
  hasFilters: false,
  kind: 2,
}

export default {
  title: 'Library/Communication-V2/RecipientsModal',
  component: CommunicationRecipientsModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};