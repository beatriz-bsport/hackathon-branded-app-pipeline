import React, { useState } from 'react';
import CommunicationDrawer, { Props } from './CommunicationDrawer.component';
import MembersFactory, { MemberFactory } from '#libs/member/factories/Member';
import ThreadCommunicationListFactory from '../factories/Communication';
import { RecipientWithMemberFromThreadCommunicationFactory } from '../factories/RecipientWithMember';
import EmailTemplateDetailSummaryListsFactory from '#libs/email-editor/factories/Emails';

import { getMemberIdListsFromMemberList } from '../utils';

import { ThreadCommunication } from '../types';
import { Member } from '#libs/member/types';

import {
  CONTEXT_NOTIFICATION,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
  CONTEXT_MEMBER,
  WRITE_SMS,
  PAGINATION_SIZE_RECIPIENTS,
  FILTER_IDENTIFIER_CHANNEL,
  FILTER_IDENTIFIER_RECIPIENT,
  FILTER_IDENTIFIER_SEND_PARAMETER,
  FILTER_IDENTIFIER_KIND,
  FILTER_CHANNELS,
  FILTER_KINDS,
  FILTER_RECIPIENTS,
  FILTER_SEND_PARAMETERS,
} from '../constants';

// UTILS JUST FOR STORYBOOK
const getAllRecipientsWithMember = (
  com: ThreadCommunication,
  allMembers: Member[],
) => {
  return {
    key: com.communication.id,
    value: RecipientWithMemberFromThreadCommunicationFactory(com, allMembers),
  };
};

const getFiltersByCategory = (filters: number[]) => {
  const filtersByCategory = [
    {
      key: FILTER_IDENTIFIER_CHANNEL,
      value: filters.filter((id: number) =>
        Object.keys(FILTER_CHANNELS).includes(id.toString()),
      ),
    },
    {
      key: FILTER_IDENTIFIER_KIND,
      value: filters.filter((id: number) => FILTER_KINDS.includes(id)),
    },
    {
      key: FILTER_IDENTIFIER_RECIPIENT,
      value: filters.filter((id: number) =>
        Object.keys(FILTER_RECIPIENTS).includes(id.toString()),
      ),
    },
    {
      key: FILTER_IDENTIFIER_SEND_PARAMETER,
      value: filters.filter((id: number) =>
        FILTER_SEND_PARAMETERS.includes(id),
      ),
    },
  ];
  return filtersByCategory;
};

const getFilteredThreadCommunicationList = (
  communications: ThreadCommunication[],
  filters: number[],
) => {
  if (filters.length === 0) return communications;
  let communicationsFiltered = communications;
  const filtersByCategory = getFiltersByCategory(filters);
  filtersByCategory.forEach((category: any) => {
    if (category.value?.length > 0) {
      switch (category.key) {
        case FILTER_IDENTIFIER_KIND:
          communicationsFiltered = communicationsFiltered.filter((currentCom) =>
            category.value.includes(currentCom.communication.kind),
          );
          break;
        case FILTER_IDENTIFIER_CHANNEL:
          communicationsFiltered = communicationsFiltered.filter((currentCom) =>
            category.value.includes(currentCom.channel),
          );
          break;
        default:
          break;
      }
    }
  });
  return communicationsFiltered;
};

const [emailTemplateDetailList, emailTemplateSummaryList] =
  EmailTemplateDetailSummaryListsFactory(6);

// DATABASE FOR STORYBOOK
const allMemberList = MembersFactory(50, true); // REPRESENTS THE MEMBERS IN THE BACK
const nbCommunications = 60;
const allThreadCommunications = ThreadCommunicationListFactory(
  nbCommunications,
  allMemberList,
);
const [allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone] =
  getMemberIdListsFromMemberList(allMemberList);

const options = {
  // DrawerProps
  onDrawerClose: () => {},
  openDrawer: true,
  // SendMessageProps
  communicatioonKindToWrite: WRITE_SMS,
  emailTemplateDetailList: emailTemplateDetailList,
  emailTemplateSummaryList: emailTemplateSummaryList,
  fetchEmailDetail: (templateId: number) => {},
  loadingThreadCommunicationList: true,
  loadingInformationRecipientList: false,
  loadingRecipientsModalMemberList: false,
  loadingTemplateDetailList: false,
  loadingTempalteSummaryList: false,
  sendCommunication: (data: any) => {},
};

const WrapperWithState = (args: Props) => {
  let threadCommunicationList = allThreadCommunications;
  let allMembersIds = allMemberIds;
  let allMembersIdsWithoutEmail = allMemberIdsWithoutEmail;
  let allMembersIdsWithoutPhone = allMemberIdsWithoutPhone;
  if (args.contextMember) {
    [allMembersIds, allMembersIdsWithoutEmail, allMembersIdsWithoutPhone] =
      getMemberIdListsFromMemberList([args.contextMember]);
    threadCommunicationList = ThreadCommunicationListFactory(10, [
      args.contextMember,
    ]);
  }
  const allRecipientsWithMembersByCommunicationId = threadCommunicationList.map(
    (communication: ThreadCommunication) =>
      getAllRecipientsWithMember(communication, allMemberList),
  );
  // TO SIMULATE THREAD DATA
  const THREAD_NB_DATA_LOADED = 4;
  const initialThreadData = threadCommunicationList.slice(
    0,
    THREAD_NB_DATA_LOADED,
  );
  const [threadDataList, setThreadDataList] = useState(initialThreadData);
  const [hasNextPage, setHasNextPage] = useState(
    threadCommunicationList.length > initialThreadData.length,
  );
  const fetchThreadDataList = (
    page: number,
    filters: number[],
    dateStart: number,
    dateEnd: number,
  ) => {
    const allCommunicationFiltered = getFilteredThreadCommunicationList(
      threadCommunicationList,
      filters,
    );
    const indexEnd = Math.min(
      page * THREAD_NB_DATA_LOADED,
      allCommunicationFiltered.length,
    );
    setThreadDataList(allCommunicationFiltered.slice(0, indexEnd));
    setHasNextPage(threadCommunicationList.length > indexEnd);
  };

  // TO SIMULATE FETCH MEMBERS FOR INFORMATION MODAL
  const [modalInformationList, setModalInformationList] = useState([]);
  const fetchPageForInformationModal = (
    communicationId: number,
    page: number,
    filters: [],
  ) => {
    const recipients = allRecipientsWithMembersByCommunicationId.find(
      (element) => element.key === communicationId,
    ).value;
    const range = [
      (page - 1) * PAGINATION_SIZE_RECIPIENTS,
      Math.min(page * PAGINATION_SIZE_RECIPIENTS, recipients.length),
    ];
    const nextList = recipients.slice(range[0], range[1]);
    setModalInformationList(nextList);
  };

  // TO SIMULATE FETCH MEMBERS FOR RECIPIENTS MODAL
  const [modalRecipientsList, setModalRecipientsList] = useState(
    allMemberList.slice(0, PAGINATION_SIZE_RECIPIENTS),
  );
  const fetchPageForRecipientsModal = (page: number, filters: number[]) => {
    const range = [
      (page - 1) * PAGINATION_SIZE_RECIPIENTS,
      Math.min(page * PAGINATION_SIZE_RECIPIENTS, allMemberList.length),
    ];
    const nextList = allMemberList.slice(range[0], range[1]);
    setModalRecipientsList(nextList);
  };
  const [selectedMemberList, setSelectedMemberList] = useState([]);
  const fetchSelectedMembersDetails = (memberIdList: number[]) => {
    setSelectedMemberList([
      ...allMemberList.filter((member: Member) =>
        memberIdList.includes(member.id),
      ),
    ]);
  };

  const props = {
    ...args,
    allMembersIds: allMembersIds,
    allMembersIdsWithoutEmail: allMembersIdsWithoutEmail,
    allMembersIdsWithoutPhone: allMembersIdsWithoutPhone,
    threadCommunicationList: threadDataList,
    fetchPageThreadCommunicationList: fetchThreadDataList,
    fetchPageInformationRecipientList: fetchPageForInformationModal,
    fetchPageRecipientsModalMemberList: fetchPageForRecipientsModal,
    fetchSelectedMembersDetails: fetchSelectedMembersDetails,
    threadCommunicationListHasNextPage: hasNextPage,
    recipientsModalMemberList: modalRecipientsList,
    informationRecipientList: modalInformationList,
    selectedMemberList: selectedMemberList,
  };

  return <CommunicationDrawer {...props} />;
};

const CustomTemplate = (args: Props) => <WrapperWithState {...args} />;

export const MemberContext = CustomTemplate.bind({});

MemberContext.args = {
  ...options,
  contextIdentifier: CONTEXT_MEMBER,
  contextMember: MemberFactory({ number_tags: 10 }, true),
};

export const NotificationContext = CustomTemplate.bind({});

NotificationContext.args = {
  ...options,
  contextIdentifier: CONTEXT_NOTIFICATION,
  contextTitle:
    "Le nom de l'object de ma push notif - essayons un text genre super long, .. ",
};

export const SessionContext = CustomTemplate.bind({});

SessionContext.args = {
  ...options,
  contextIdentifier: CONTEXT_OFFER,
  contextTitle: 'Le nom de ma séance',
};

export const SmartlistContext = CustomTemplate.bind({});

SmartlistContext.args = {
  ...options,
  contextIdentifier: CONTEXT_SMARTLIST,
  contextTitle: 'Le nom de ma smartlist',
};

export default {
  title: 'Library/Communication-V2/Drawer',
  component: CommunicationDrawer,
  parameters: {
    docs: {
      page: null,
    },
  },
};
