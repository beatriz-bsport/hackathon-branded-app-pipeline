import React from 'react';
import moment from 'moment-timezone';
import CommunicationInformationModal, { Props } from './CommunicationInformationModal.component';
import RecipientsWithMemberFactory from '../factories/RecipientWithMember';

const CustomTemplate = (args: Props) => <CommunicationInformationModal {...args} />;

export const CreateState = CustomTemplate.bind({});

CreateState.args = {
  open: true,
  fullScreen: true,
  membersCount: 4,
  pageSize: 4,
  membersList: RecipientsWithMemberFactory(3),
  kind: 1,
  dateCreated: moment(),
  filterOptions: [{ value: 1, label: 'coree du sud' }, { value: 2, label: 'coree du nord' }],
  contextTitle: 'Séance',
  contextInformation: 'Yoga au lit - Lundi 25 Décembre',
  fetchPage: (page: number, filters: any[]) => { console.log("This is page ", page, " with filters ", filters) },
};

export default {
  title: 'Library/Communication-V2/InformationModal',
  component: CommunicationInformationModal,
  parameters: {
    docs: {
      page: null,
    },
  },
};