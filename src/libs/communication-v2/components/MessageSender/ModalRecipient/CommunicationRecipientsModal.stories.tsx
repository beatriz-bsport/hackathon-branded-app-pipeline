import React from 'react';
import CommunicationRecipientsModal, {
  Props,
} from './CommunicationRecipientsModal.component';
import MembersFactory from '#libs/member/factories/Member';
import { getMemberIdListsFromMemberList } from '#libs/communication-v2/utils';
import { PAGINATION_SIZE_RECIPIENTS } from '#libs/communication-v2/constants';
console.log('initiation');
const CustomTemplate = (args: Props) => (
  <CommunicationRecipientsModal {...args} />
);

const memberList = MembersFactory(12, true);
const [allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone] =
  getMemberIdListsFromMemberList(memberList);

export const RecipientsModal = CustomTemplate.bind({});
console.log(allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone);
RecipientsModal.args = {
  allMemberCategoryList: {
    categories: [
      {
        categoryIdentifier: 1,
        categoryLabel: 'Ceci est un premier filtre',
        categoryMemberIdList: [],
      },
      {
        categoryIdentifier: 2,
        categoryLabel: 'Ceci est un second filtre',
        categoryMemberIdList: [],
      },
    ],
    filterPlaceholder: 'Placeholder de mon filtre',
  },
  availableMemberIdList: allMemberIds,
  availableMemberWithoutEmailIdList: allMemberIdsWithoutEmail,
  availableMemberWithoutPhoneIdList: allMemberIdsWithoutPhone,
  checkedMemberCategoriesFilters: [1],
  fetchPaginatedMemberList: () => {},
  fullScreen: false,
  handleCloseDialog: () => {},
  kind: 0,
  loadingMemberList: false,
  memberList: memberList,
  open: true,
  pageSize: PAGINATION_SIZE_RECIPIENTS,
  setAvailableMemberIdList: () => {},
  setCheckedMemberCategoriesFilters: () => {},
  setUncheckedMembers: () => {},
  uncheckedMembers: [],
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
