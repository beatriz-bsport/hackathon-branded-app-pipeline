import React, { useState } from 'react';
import { CommunicationDrawerWithStyles as CommunicationDrawer } from './CommunicationDrawer.component';
import MembersFactory, { MemberFactory } from '#libs/member/factories/Member';
import ThreadCommunicationListFactory from '../factories/Communication';
import { RecipientWithMemberFromThreadCommunicationFactory } from '../factories/RecipientWithMember';
import EmailTemplateDetailSummaryListsFactory from '#libs/email-editor/factories/Emails';

import { getMemberIdListsFromMemberList } from '../utils';

import { CommunicationMessage, DrawerProps, Communication } from '../types';
import { Member } from '#libs/member/types';
import { tagCategories } from '#libs/tag/factory';

import {
  CONTEXT_NOTIFICATION,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
  CONTEXT_MEMBER,
  PAGINATION_SIZE_RECIPIENTS,
  COMMUNICATION_FILTER_IDENTIFIER_CHANNEL,
  COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
  COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
  COMMUNICATION_FILTER_IDENTIFIER_KIND,
  COMMUNICATION_FILTER_CHANNELS,
  COMMUNICATION_FILTER_KINDS,
  COMMUNICATION_FILTER_RECIPIENTS,
  COMMUNICATION_FILTER_SEND_PARAMETERS,
} from '../constants';

// UTILS JUST FOR STORYBOOK
const getAllRecipientsWithMember = (
  com: CommunicationMessage,
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
      key: COMMUNICATION_FILTER_IDENTIFIER_CHANNEL,
      value: filters.filter((id: number) =>
        Object.keys(COMMUNICATION_FILTER_CHANNELS).includes(id.toString()),
      ),
    },
    {
      key: COMMUNICATION_FILTER_IDENTIFIER_KIND,
      value: filters.filter((id: number) =>
        COMMUNICATION_FILTER_KINDS.includes(id),
      ),
    },
    {
      key: COMMUNICATION_FILTER_IDENTIFIER_RECIPIENT,
      value: filters.filter((id: number) =>
        Object.keys(COMMUNICATION_FILTER_RECIPIENTS).includes(id.toString()),
      ),
    },
    {
      key: COMMUNICATION_FILTER_IDENTIFIER_SEND_PARAMETER,
      value: filters.filter((id: number) =>
        COMMUNICATION_FILTER_SEND_PARAMETERS.includes(id),
      ),
    },
  ];
  return filtersByCategory;
};

const getFilteredThreadCommunicationList = (
  communications: CommunicationMessage[],
  filters: number[],
) => {
  if (filters.length === 0) return communications;
  let communicationsFiltered = communications;
  const filtersByCategory = getFiltersByCategory(filters);
  filtersByCategory.forEach((category: any) => {
    if (category.value?.length > 0) {
      switch (category.key) {
        case COMMUNICATION_FILTER_IDENTIFIER_KIND:
          communicationsFiltered = communicationsFiltered.filter((currentCom) =>
            category.value.includes(currentCom.communication.kind),
          );
          break;
        case COMMUNICATION_FILTER_IDENTIFIER_CHANNEL:
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

// DATABASES FOR STORYBOOK
const [emailTemplateDetailList, emailTemplateSummaryList] =
  EmailTemplateDetailSummaryListsFactory(6);
const DATABASE_RECIPIENTS_MODAL_MEMBER_LIST = MembersFactory(50, true); // REPRESENTS THE MEMBERS IN THE BACK
const DATABASE_THREAD_COMMUNICATION_LIST = ThreadCommunicationListFactory(
  60,
  DATABASE_RECIPIENTS_MODAL_MEMBER_LIST,
);
const DATABASE_RECIPIENTS_WITH_MEMBERS_BY_COMMUNICATION_SENT =
  DATABASE_THREAD_COMMUNICATION_LIST.map(
    (communication: CommunicationMessage) =>
      getAllRecipientsWithMember(
        communication,
        DATABASE_RECIPIENTS_MODAL_MEMBER_LIST,
      ),
  );

const WrapperWithState = (args: DrawerProps) => {
  // ---------- THREADS PROPS ----------
  const THREAD_DATA_PAGINATION_SIZE = 5;
  const initialThreadData = DATABASE_THREAD_COMMUNICATION_LIST.slice(
    0,
    THREAD_DATA_PAGINATION_SIZE,
  );
  const [threadCommunicationList, setThreadCommunicationList] =
    useState(initialThreadData);
  const loadingThreadCommunicationList = false;
  const [
    threadCommunicationListHasNextPage,
    setThreadCommunicationListHasNextPage,
  ] = useState(
    DATABASE_THREAD_COMMUNICATION_LIST.length > initialThreadData.length,
  );
  const fetchPageThreadCommunicationList = (
    page: number,
    filters: number[],
    dateStart: number,
    dateEnd: number,
  ) => {
    const allCommunicationFiltered = getFilteredThreadCommunicationList(
      DATABASE_THREAD_COMMUNICATION_LIST,
      filters,
    );
    const indexEnd = Math.min(
      page * THREAD_DATA_PAGINATION_SIZE,
      allCommunicationFiltered.length,
    );
    setThreadCommunicationList(allCommunicationFiltered.slice(0, indexEnd));
    setThreadCommunicationListHasNextPage(
      DATABASE_THREAD_COMMUNICATION_LIST.length > indexEnd,
    );
  };
  const threadProps = {
    threadCommunicationList: threadCommunicationList.reverse(),
    threadCommunicationListHasNextPage,
    loadingThreadCommunicationList,
    fetchPageThreadCommunicationList,
  };

  // ---------- RECIPIENTS PROPS ----------
  const [informationRecipientList, setInformationRecipientList] = useState([]);
  const [informationRecipientListCount, setInformationrecipientListCount] =
    useState(0);
  const loadingInformationRecipientList = false;
  const fetchPageInformationRecipientList = (
    communication: Communication,
    page: number,
    memberSelectedCategories: [],
  ) => {
    const recipients =
      DATABASE_RECIPIENTS_WITH_MEMBERS_BY_COMMUNICATION_SENT.find(
        (element) => element.key === communication.id,
      ).value;
    const range = [
      (page - 1) * PAGINATION_SIZE_RECIPIENTS,
      Math.min(page * PAGINATION_SIZE_RECIPIENTS, recipients.length),
    ];
    const nextList = recipients.slice(range[0], range[1]);
    setInformationRecipientList(nextList);
    setInformationrecipientListCount(recipients.length);
  };
  const recipientsProps = {
    informationRecipientList,
    informationRecipientListCount,
    loadingInformationRecipientList,
    fetchPageInformationRecipientList,
  };

  // ---------- TEMPLATES PROPS ----------
  const templatesProps = {
    emailTemplateDetailList: emailTemplateDetailList,
    emailTemplateSummaryList: emailTemplateSummaryList,
    loadingEmailTemplateDetailList: false,
    loadingEmailTemplateSummaryList: false,
  };

  // ---------- MEMBERS PROPS ----------
  const memberDatabase = args.contextMember
    ? [args.contextMember]
    : DATABASE_RECIPIENTS_MODAL_MEMBER_LIST;
  const initialRecipientsMemberList = memberDatabase.slice(
    0,
    Math.min(memberDatabase.length, PAGINATION_SIZE_RECIPIENTS),
  );
  const [recipientsModalMemberList, setRecipientsModalMemberList] = useState(
    initialRecipientsMemberList,
  );
  const [allMemberIds, allMemberIdsWithoutEmail, allMemberIdsWithoutPhone] =
    getMemberIdListsFromMemberList(memberDatabase);
  const countAvailableRecipientsTotal = allMemberIds.length;
  const countAvailableRecipientsWithEmail =
    allMemberIds.length - allMemberIdsWithoutEmail.length;
  const countAvailableRecipientsWithPhone =
    allMemberIds.length - allMemberIdsWithoutPhone.length;
  const fetchPaginatedAvailableRecipientMemberList = (
    page: number,
    memberSelectedCategories?: number[],
  ) => {
    const indexEnd = Math.min(
      page * PAGINATION_SIZE_RECIPIENTS,
      memberDatabase.length,
    );
    setRecipientsModalMemberList(
      memberDatabase.slice((page - 1) * PAGINATION_SIZE_RECIPIENTS, indexEnd),
    );
  };
  const membersProps = {
    countAvailableRecipientsTotal,
    countAvailableRecipientsWithEmail,
    countAvailableRecipientsWithPhone,
    recipientsModalMemberList,
    loadingRecipiensModalMemberList: false,
    fetchPaginatedAvailableRecipientMemberList,
    resolvedGenericTags: {},
    fetchResolvedGenericTags: () => {},
    tagCategories: tagCategories,
    fetchTagList: () => {},
  };

  // ---------- HOC PROPS ----------
  const composeProps = {
    ...threadProps,
    ...recipientsProps,
    ...templatesProps,
    ...membersProps,
    ...args,
    sendCommunication: () => {},
  };
  return <CommunicationDrawer {...composeProps} />;
};

const drawerProps = {
  onDrawerClose: () => {},
  openDrawer: true,
  communicationKindToWrite: Math.floor(Math.random() * 4),
};

const CustomTemplate = (args: DrawerProps) => <WrapperWithState {...args} />;

export const MemberContext = CustomTemplate.bind({});

MemberContext.args = {
  ...drawerProps,
  contextIdentifier: CONTEXT_MEMBER,
  contextMember: MemberFactory({ number_tags: 10 }, true),
};

export const NotificationContext = CustomTemplate.bind({});

NotificationContext.args = {
  ...drawerProps,
  contextIdentifier: CONTEXT_NOTIFICATION,
  contextTitle:
    "Le nom de l'object de ma push notif - essayons un text genre super long, .. ",
};

export const SessionContext = CustomTemplate.bind({});

SessionContext.args = {
  ...drawerProps,
  contextIdentifier: CONTEXT_OFFER,
  contextTitle: 'Le nom de ma séance',
  allMemberCategoryList: [
    {
      categoryMemberIdList: [],
      categoryLabel: 'Première catégorie',
      categoryIdentifier: 1,
    },
    {
      categoryMemberIdList: [],
      categoryLabel: 'Seconde catégorie',
      categoryIdentifier: 2,
    },
  ],
};

export const SmartlistContext = CustomTemplate.bind({});

SmartlistContext.args = {
  ...drawerProps,
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
