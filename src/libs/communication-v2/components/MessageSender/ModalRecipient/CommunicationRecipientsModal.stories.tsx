import React from 'react';
import CommunicationRecipientsModal, {
  Props,
} from './CommunicationRecipientsModal.component';
import MembersFactory from '#libs/member/factories/Member';
import { getMemberIdListsFromMemberList } from '#libs/communication-v2/utils';
import { PAGINATION_SIZE_RECIPIENTS } from '#libs/communication-v2/constants';

const CustomTemplate = (args: Props) => {
  const [unchecked, setUnchecked] = React.useState({
    email: [],
    phone: [],
    notification: [],
  });
  const [checkedFilters, setCheckedFilters] = React.useState([1]);

  return (
    <CommunicationRecipientsModal
      {...args}
      uncheckedMembers={unchecked}
      setUncheckedMembers={setUnchecked}
      checkedMemberCategoriesFilters={checkedFilters}
      setCheckedMemberCategoriesFilters={setCheckedFilters}
    />
  );
};

const memberList = MembersFactory(12, true);
const [allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone] =
  getMemberIdListsFromMemberList(memberList);

export const RecipientsModal = CustomTemplate.bind({});

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
  countAvailableRecipientsTotal: allMemberIds.length,
  countAvailableRecipientsWithEmail:
    allMemberIds.length - allMemberIdsWithoutEmail.length,
  countAvailableRecipientsWithPhone:
    allMemberIds.length - allMemberIdsWithoutPhone.length,
  fetchPaginatedAvailableRecipientMemberList: () => {},
  fullScreen: false,
  handleCloseDialog: () => {},
  kind: 0,
  loadingPaginatedMemberList: false,
  open: true,
  pageSize: PAGINATION_SIZE_RECIPIENTS,
  paginatedMemberList: memberList,
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
