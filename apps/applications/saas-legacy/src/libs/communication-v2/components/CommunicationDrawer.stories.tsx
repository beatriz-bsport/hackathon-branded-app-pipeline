import React, { useState } from 'react';
import CommunicationDrawer from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import MembersFactory, {
  MemberFactory,
} from '#src/libs/member/factories/Member';
import CommunicationMessageListFactory from '#src/libs/communication-v2/factories/Communication';
import { RecipientWithMemberFromCommunicationMessageFactory } from '#src/libs/communication-v2/factories/RecipientWithMember';
import EmailTemplateDetailSummaryListsFactory from '#src/libs/email-editor/factories/Emails';

import { getMemberIdListsFromMemberList } from '#src/libs/communication-v2/utils';

import {
  CommunicationMessage,
  DrawerProps,
  Communication,
  Recipient,
} from '#src/libs/communication-v2/types';
import { Member } from '#src/libs/member/types';
import { tagCategories, tagListFactory } from '#src/libs/tag/factory';

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
} from '#src/libs/communication-v2/constants';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { ComponentStory } from '@storybook/react';

// UTILS JUST FOR STORYBOOK
const randomInt = (max: number): number => Math.ceil(Math.random() * max);
const getAllRecipientsWithMember = (
  com: CommunicationMessage,
  allMembers: Member[],
) => {
  return {
    key: com.communication.id,
    value: RecipientWithMemberFromCommunicationMessageFactory(com, allMembers),
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

const getFilteredCommunicationMessageList = (
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
const DATABASE_COMMUNICATION_MESSAGE_LIST = CommunicationMessageListFactory(
  60,
  DATABASE_RECIPIENTS_MODAL_MEMBER_LIST,
);
const DATABASE_RECIPIENTS_WITH_MEMBERS_BY_COMMUNICATION_SENT =
  DATABASE_COMMUNICATION_MESSAGE_LIST.map(
    (communication: CommunicationMessage) =>
      getAllRecipientsWithMember(
        communication,
        DATABASE_RECIPIENTS_MODAL_MEMBER_LIST,
      ),
  );

const WrapperWithState = (args: DrawerProps) => {
  // ---------- COMMUNICATION MESSAGES PROPS ----------
  const COMMUNICATION_MESSAGE_DATA_PAGINATION_SIZE = 5;
  const initialCommunicationMessageData =
    DATABASE_COMMUNICATION_MESSAGE_LIST.slice(
      0,
      COMMUNICATION_MESSAGE_DATA_PAGINATION_SIZE,
    );
  const [communicationMessageList, setCommunicationMessageList] = useState(
    initialCommunicationMessageData,
  );
  const loadingCommunicationMessageList = false;
  const [
    communicationMessageListHasNextPage,
    setCommunicationMessageListHasNextPage,
  ] = useState(
    DATABASE_COMMUNICATION_MESSAGE_LIST.length >
      initialCommunicationMessageData.length,
  );
  const fetchPageMessageList = (
    page: number,
    filters: number[],
    _dateStart: number,
    _dateEnd: number,
  ) => {
    const allCommunicationFiltered = getFilteredCommunicationMessageList(
      DATABASE_COMMUNICATION_MESSAGE_LIST,
      filters,
    );
    const indexEnd = Math.min(
      page * COMMUNICATION_MESSAGE_DATA_PAGINATION_SIZE,
      allCommunicationFiltered.length,
    );
    setCommunicationMessageList(allCommunicationFiltered.slice(0, indexEnd));
    setCommunicationMessageListHasNextPage(
      DATABASE_COMMUNICATION_MESSAGE_LIST.length > indexEnd,
    );
  };
  const communicationMessageProps = {
    communicationMessageList: communicationMessageList.reverse(),
    communicationMessageListHasNextPage,
    loadingCommunicationMessageList,
    fetchPageMessageList,
  };

  // ---------- RECIPIENTS PROPS ----------
  const [informationRecipientList, setInformationRecipientList] = useState<
    Recipient<Member>[]
  >([]);
  const [informationRecipientListCount, setInformationrecipientListCount] =
    useState(0);
  const loadingInformationRecipientList = false;
  const fetchPageInformationRecipientList = (
    communication: Communication,
    page: number,
    _memberSelectedCategories: [],
  ) => {
    const recipients =
      DATABASE_RECIPIENTS_WITH_MEMBERS_BY_COMMUNICATION_SENT.find(
        (element) => element.key === communication.id,
      )?.value;
    const range = [
      (page - 1) * PAGINATION_SIZE_RECIPIENTS,
      Math.min(page * PAGINATION_SIZE_RECIPIENTS, recipients?.length ?? 0),
    ];
    const nextList = recipients?.slice(range[0], range[1]) ?? [];
    setInformationRecipientList(nextList);
    setInformationrecipientListCount(recipients?.length ?? 0);
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
    _memberSelectedCategories?: number[],
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
    resolvedGenericTags: tagListFactory(randomInt(5)),
    fetchResolvedGenericTags: () => {},
    tagCategories: tagCategories,
    fetchTagList: () => {},
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // ---------- HOC PROPS ----------
  const composeProps = {
    ...communicationMessageProps,
    ...recipientsProps,
    ...templatesProps,
    ...membersProps,
    ...args,
    sendCommunication: () => {},
    fullScreen,
  };

  return <CommunicationDrawer {...composeProps} />;
};

const drawerProps = {
  onDrawerClose: () => {},
  openDrawer: true,
  communicationKindToWrite: Math.floor(Math.random() * 4),
};

const CustomTemplate: ComponentStory<typeof WrapperWithState> = (
  args: DrawerProps,
) => <WrapperWithState {...args} />;

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
  allMemberCategoryList: {
    categories: [
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
    filterPlaceholder: '',
  },
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
  argTypes: {
    flagAllUnreadCommunicationsAsRead: {
      action: 'flagAllUnreadCommunicationsAsRead',
    },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
