import React from 'react';
import CommunicationInformationModal, {
  Props,
} from '#src/libs/communication-v2/components/MessageList/ModalInformation/CommunicationInformationModal.component';
import RecipientsWithMemberFactory from '#src/libs/communication-v2/factories/RecipientWithMember';
import { CommunicationMessageFactory } from '#src/libs/communication-v2/factories/Communication';
import { PAGINATION_SIZE_RECIPIENTS } from '#src/libs/communication-v2/constants';
import { Recipient } from '#src/libs/communication-v2/types';
import { Member } from '#src/libs/member/types';

const CustomTemplate = (args: Props) => (
  <CommunicationInformationModal {...args} />
);

const recipientsWithMember = RecipientsWithMemberFactory(8);
export const InformationModal = CustomTemplate.bind({});

InformationModal.args = {
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
  contextInformation: 'Yoga au lit - Lundi 25 Décembre',
  contextTitle: 'Séance',
  fetchRecipientPaginatedList: () => {},
  fullScreen: false,
  handleCloseDialog: () => {},
  loadingRecipientList: false,
  open: true,
  paginationSize: PAGINATION_SIZE_RECIPIENTS,
  recipientList: recipientsWithMember,
  selectedCommunication: CommunicationMessageFactory(
    1,
    recipientsWithMember.map(
      (recipient: Recipient<Member>) => recipient.member,
    ),
  ),
};

export const InformationModalWithEmptyList = CustomTemplate.bind({});

InformationModalWithEmptyList.args = {
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
      {
        categoryIdentifier: 3,
        categoryLabel: 'Ceci est un troisième filtre',
        categoryMemberIdList: [],
      },
    ],
    filterPlaceholder: 'Placeholder de mon filtre',
  },
  contextInformation: 'Yoga au lit - Lundi 25 Décembre',
  contextTitle: 'Séance',
  fetchRecipientPaginatedList: () => {},
  fullScreen: false,
  handleCloseDialog: () => {},
  loadingRecipientList: false,
  open: true,
  paginationSize: PAGINATION_SIZE_RECIPIENTS,
  recipientList: [],
  selectedCommunication: CommunicationMessageFactory(
    1,
    recipientsWithMember.map(
      (recipient: Recipient<Member>) => recipient.member,
    ),
  ),
};

export default {
  title: 'Library/Communication-V2/Modals',
  component: CommunicationInformationModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};
