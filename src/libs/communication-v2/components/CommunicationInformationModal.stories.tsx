import React from 'react';
import moment from 'moment-timezone';
import CommunicationInformationModal, {
  Props,
} from './CommunicationInformationModal.component';
import RecipientsWithMemberFactory from '../factories/RecipientWithMember';

const CustomTemplate = (args: Props) => (
  <CommunicationInformationModal {...args} />
);

export const InformationModal = CustomTemplate.bind({});

InformationModal.args = {
  contextInformation: 'Yoga au lit - Lundi 25 Décembre',
  contextTitle: 'Séance',
  dateCreated: moment(),
  fetchPage: (page: number, filters: any[]) => {
    console.log('This is page ', page, ' with filters ', filters);
  },
  filterOptions: [
    { value: 1, label: 'coree du sud' },
    { value: 2, label: 'coree du nord' },
  ],
  fullScreen: true,
  handleCloseDialog: () => {},
  kind: 1,
  loadingRecipientList: true,
  open: true,
  paginationSize: 4,
  recipientList: RecipientsWithMemberFactory(8),
  recipientsCount: 8,
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
