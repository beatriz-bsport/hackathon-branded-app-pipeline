import React from 'react';
import CommunicationSendMessageContainer, {
  Props,
} from './CommunicationSendMessageContainer.component';
import MembersFactory from '#libs/member/factories/Member';
import {
  PAGINATION_SIZE_RECIPIENTS,
  WRITE_EMAIL,
  WRITE_PUSH_NOTIFICATION,
  WRITE_SMS,
} from '#libs/communication-v2/constants';
import { getMemberIdListsFromMemberList } from '#libs/communication-v2/utils';
import EmailTemplateDetailSummaryListsFactory from '#libs/email-editor/factories/Emails';

const memberList = MembersFactory(9, true);
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
  availableMemberToSendCommunicationIdList: allMemberIds,
  availableMemberWithoutEmailToSendCommunicationIdList:
    allMemberIdsWithoutEmail,
  availableMemberWithoutPhoneToSendCommunicationIdList:
    allMemberIdsWithoutPhone,
  allMemberCategoryList: {
    categories: [
      {
        categoryIdentifier: 1,
        categoryLabel: 'Ceci est un premier filtre',
        categoryMemberIdList: [1],
      },
      {
        categoryIdentifier: 2,
        categoryLabel: 'Ceci est un second filtre',
        categoryMemberIdList: [2],
      },
    ],
    filterPlaceholder: 'Placeholder de mon filtre',
  },
  emailTemplateDetailList: emailTemplateDetailList,
  emailTemplateSummaryList: emailTemplateSummaryList,
  fetchEmailSummaryList: () => {},
  fetchPaginatedMemberList: () => {},
  fetchSelectedMemberListToSendCommunication: () => {},
  fullScreen: false,
  getEmailDetail: () => {},
  loadingMemberList: false,
  loadingTemplateSummaryList: false,
  loadingTemplateDetailList: false,
  memberList: memberList,
  pageSize: PAGINATION_SIZE_RECIPIENTS,
  selectedMemberListToSendCommunication: memberList.slice(0, 4),
  selectedMemberListToSendCommunicationLoading: false,
  sendCommunication: () => {},
  setCommunicationKind: () => {},
  updateThreadList: () => {},
  paginatedMemberList:memberList,
};

const CustomTemplate = (args: Props) => (
  <CommunicationSendMessageContainer {...args} />
);

export const SendEmailToGroup = CustomTemplate.bind({});

SendEmailToGroup.args = {
  ...commonProps,
  communicationKind: WRITE_EMAIL,
};

export const SendSmsToDirectMember = CustomTemplate.bind({});

SendSmsToDirectMember.args = {
  ...commonProps,
  availableMemberToSendCommunicationIdList: singleMemberIds,
  availableMemberWithoutEmailToSendCommunicationIdList:
    singleMemberIdsWithoutEmail,
  availableMemberWithoutPhoneToSendCommunicationIdList:
    singleMemberIdsWithoutPhone,
  communicationKind: WRITE_SMS,
  directMember: singleMember[0],
};

export const SendNotificationPushToGroup = CustomTemplate.bind({});

SendNotificationPushToGroup.args = {
  ...commonProps,
  communicationKind: WRITE_PUSH_NOTIFICATION,
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
