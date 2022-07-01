
import React from 'react';
import CommunicationSendMessageContainer, { Props } from './CommunicationSendMessageContainer.component';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import EmailTemplateDetailFactoryBot from '../../email-editor/factories/EmailTemplateDetail';
import { Member } from '../../member/types';
import MembersFactory, {MemberFactory} from '../../member/factories/Member';
import { WRITE_SMS } from '../constants';



const membersList = MembersFactory(8);
const allIds: number[] = [];
membersList.forEach((member: Member) => allIds.push(member.id));

const emailTemplateDetails = EmailTemplateDetailFactoryBot.EmailTemplateDetail.create(5);
const emailTemplateSummaries = EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(5);
for (let i = 0; i < 5; i += 1){
  emailTemplateDetails[i].id = emailTemplateSummaries[i].id;
}

const commonProps = {
  allIds: allIds,
  allIdsWithoutPhone: allIds.slice(1, 5),
  dialogFullScreen: false,
  emailTemplateDetails: emailTemplateDetails,
  emailTemplateSummaries: emailTemplateSummaries,
  fetchPage: (id: number) => { },
  getEmailDetail: (id: number) => { },
  getSelectedMembersDetails: (ids: number[]) => console.log(ids),
  loadingMembersList: false,
  loadingTemplateSummaries: false,
  loadingTemplateDetails: false,
  membersList: membersList,
  pageSize: 5,
  selectedMembersList: membersList.slice(4),
  sendMessage: (data: any) => console.log(data),
  tags: {
      'User': ['firstname', 'lastname', 'unsubscribe_link'],
    },
}

const CustomTemplate = (args: Props) => <CommunicationSendMessageContainer {...args} />;

export const CreateState = CustomTemplate.bind({});

CreateState.args = {
  ...commonProps,
};

export const SendSmsToDirectMember = CustomTemplate.bind({});

SendSmsToDirectMember.args = {
    ...commonProps,
  actionType : WRITE_SMS,
  directMember: MemberFactory({}),
}

export default {
  title: 'Library/Communication-V2/SendMessage',
  component: CommunicationSendMessageContainer,
  parameters: {
    docs: {
      page: null,
    },
  },
};
