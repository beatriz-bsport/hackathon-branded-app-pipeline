import React from 'react';
import CommunicationSendMessageContainer, {
  Props,
} from './CommunicationSendMessageContainer.component';
import EmailTemplateSummaryFactoryBot from '../../email-editor/factories/EmailTemplateSummary';
import EmailTemplateDetailFactoryBot from '../../email-editor/factories/EmailTemplateDetail';
import { Member } from '../../member/types';
import MembersFactory, { MemberFactory } from '../../member/factories/Member';
import { WRITE_EMAIL, WRITE_SMS } from '../constants';
import { getMemberIdListsFromMemberList } from '../utils';
import EmailTemplateDetailSummaryListsFactory from '../factories/Emails';

const memberList = MembersFactory(8, true);
const [allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone] =
  getMemberIdListsFromMemberList(memberList);

const singleMember = MembersFactory(1, true);
const [
  singleMemberIds,
  singleMemberIdsWithoutEmail,
  singleMemberIdsWithoutPhone,
] = getMemberIdListsFromMemberList(singleMember);

const [emailTemplateDetailList, emailTemplateSummaryList] =
  EmailTemplateDetailSummaryListsFactory(6);

const commonProps = {
  canFilterRecipients: false,
  emailTemplateDetailList: emailTemplateDetailList,
  emailTemplateSummaryList: emailTemplateSummaryList,
  fetchRecipientsPage: (page: number, filters: number[]) => {},
  fullScreen: false,
  getEmailDetail: (id: number) => {},
  getSelectedMembersDetails: (ids: number[]) => console.log(ids),
  loadingMemberList: false,
  loadingTemplateSummaryList: false,
  loadingTemplateDetailList: false,
  pageSize: 5,
  sendCommunication: (data: any) => console.log(data),
  setCommunicationKind: (kind: number) =>
    console.log('Changing kind is done in the parent'),
};

const CustomTemplate = (args: Props) => (
  <CommunicationSendMessageContainer {...args} />
);

export const SendCommunicationToGroup = CustomTemplate.bind({});

SendCommunicationToGroup.args = {
  ...commonProps,
  allIds: allMemberIds,
  allIdsWithoutEmail: allMemberIdsWithoutEmail,
  allIdsWithoutPhone: allMemberIdsWithoutPhone,
  communicationKind: WRITE_EMAIL,
  memberList: memberList,
};

export const SendCommunicationToDirectMember = CustomTemplate.bind({});

SendCommunicationToDirectMember.args = {
  ...commonProps,
  allIds: singleMemberIds,
  allMemberIdsWithoutEmail: singleMemberIdsWithoutEmail,
  allMemberIdsWithoutPhone: singleMemberIdsWithoutPhone,
  communicationKind: WRITE_SMS,
  directMember: singleMember[0],
  memberList: singleMember,
};

export default {
  title: 'Library/Communication-V2/SendMessage',
  component: CommunicationSendMessageContainer,
  parameters: {
    docs: {
      page: null,
    },
  },
};
