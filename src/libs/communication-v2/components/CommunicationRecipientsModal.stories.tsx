import React from 'react';
import CommunicationRecipientsModal, {
  Props,
} from './CommunicationRecipientsModal.component';
import MembersFactory from '#libs/member/factories/Member';

import {
  COMMUNICATION_RECIPIENT_BOOKINGS,
  COMMUNICATION_RECIPIENT_WAITING_LIST,
} from '@bsport/common/lib/master-data/communication-filters';

import { getMemberIdListsFromMemberList } from '../utils';

const CustomTemplate = (args: Props) => (
  <CommunicationRecipientsModal {...args} />
);

const memberList = MembersFactory(8, true);
const [allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone] =
  getMemberIdListsFromMemberList(memberList);

export const RecipientsModal = CustomTemplate.bind({});

RecipientsModal.args = {
  allIds: allMemberIds,
  allIdsWithoutEmail: allMemberIdsWithoutEmail,
  allIdsWithoutPhone: allMemberIdsWithoutPhone,
  fetchPage: (page: number, filters: number[]) =>
    console.log('Go to the page ', page, 'with filters ', filters),
  fullScreen: false,
  handleCloseDialog: () => {},
  kind: 0,
  loadingMemberList: false,
  memberList: memberList,
  open: true,
  pageSize: 12,
  selectedFilters: [
    COMMUNICATION_RECIPIENT_BOOKINGS,
    COMMUNICATION_RECIPIENT_WAITING_LIST,
  ],
  setSelectedFilters: (numbers: number[]) => console.log(numbers),
  setUncheckedMembers: (members: number[]) =>
    console.log('These are the unchecked members ', members),
  uncheckedMembers: allMemberIds.sort(() => Math.random() < 0.5).slice(0, 4),
};

export default {
  title: 'Library/Communication-V2/Modals',
  component: CommunicationRecipientsModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};
