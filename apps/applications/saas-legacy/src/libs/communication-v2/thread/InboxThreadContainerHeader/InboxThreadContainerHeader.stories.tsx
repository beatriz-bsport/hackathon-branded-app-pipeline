import React, { useState } from 'react';

import InboxThreadContainerHeader, {
  Props,
} from '#src/libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadContainerHeader.component';
import {
  MemberThread,
  OfferThread,
  SmartListThread,
} from '#src/libs/communication-v2/factories/CommunicationThread';
import { DateTime } from 'luxon';
import { SelectFieldItem } from '#src/libs/communication-v2/types';

const memberThreadProps = MemberThread();
const smartlistThreadProps = SmartListThread();
const offerThreadProps = OfferThread();

const CustomMemberTemplate = (args: Props) => {
  const [dateStart, setdateStart] = useState<DateTime | null>(null);
  const [dateEnd, setdateEnd] = useState<DateTime | null>(null);
  const [kindFilter, setCommunicationKind] = useState<SelectFieldItem[]>([]);
  const [recipientFilter, setRecipientFilter] = useState<SelectFieldItem[]>([]);
  const [srcOrDstFilter, setSrcOrDstFilter] = useState<SelectFieldItem[]>([]);
  const [sendParameterFilter, setSendParameterFilter] = useState<
    SelectFieldItem[]
  >([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const onShowFilterModal = () => {
    setShowFilterModal(true);
  };

  return (
    <InboxThreadContainerHeader
      communicationKinds={kindFilter}
      setCommunicationKind={setCommunicationKind}
      automatedMessages={sendParameterFilter}
      setAutomatedMessages={setSendParameterFilter}
      recipientTypes={recipientFilter}
      setRecipientTypes={setRecipientFilter}
      messagesOrigin={srcOrDstFilter}
      setMessagesOrigin={setSrcOrDstFilter}
      dateStart={dateStart}
      setDateStart={setdateStart}
      dateEnd={dateEnd}
      setDateEnd={setdateEnd}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      showFilterModal={showFilterModal}
      setShowFilterModal={setShowFilterModal}
      onShowFilterModal={onShowFilterModal}
      {...args}
    />
  );
};

const CustomSmartlistTemplate = (args: Props) => {
  const [dateStart, setdateStart] = useState<DateTime | null>(null);
  const [dateEnd, setdateEnd] = useState<DateTime | null>(null);
  const [sendParameterFilter, setSendParameterFilter] = useState<
    SelectFieldItem[]
  >([]);
  const [kindFilter, setCommunicationKind] = useState<SelectFieldItem[]>([]);
  const [recipientFilter, setRecipientFilter] = useState<SelectFieldItem[]>([]);
  const [srcOrDstFilter, setSrcOrDstFilter] = useState<SelectFieldItem[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const onShowFilterModal = () => {
    setShowFilterModal(true);
  };

  return (
    <InboxThreadContainerHeader
      communicationKinds={kindFilter}
      setCommunicationKind={setCommunicationKind}
      automatedMessages={sendParameterFilter}
      setAutomatedMessages={setSendParameterFilter}
      recipientTypes={recipientFilter}
      setRecipientTypes={setRecipientFilter}
      messagesOrigin={srcOrDstFilter}
      setMessagesOrigin={setSrcOrDstFilter}
      dateStart={dateStart}
      setDateStart={setdateStart}
      dateEnd={dateEnd}
      setDateEnd={setdateEnd}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      showFilterModal={showFilterModal}
      setShowFilterModal={setShowFilterModal}
      onShowFilterModal={onShowFilterModal}
      {...args}
    />
  );
};

const CustomOfferTemplate = (args: Props) => {
  const [kindFilter, setCommunicationKind] = useState<SelectFieldItem[]>([]);
  const [dateStart, setdateStart] = useState<DateTime | null>(null);
  const [dateEnd, setdateEnd] = useState<DateTime | null>(null);
  const [recipientFilter, setRecipientFilter] = useState<SelectFieldItem[]>([]);
  const [srcOrDstFilter, setSrcOrDstFilter] = useState<SelectFieldItem[]>([]);
  const [sendParameterFilter, setSendParameterFilter] = useState<
    SelectFieldItem[]
  >([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const onShowFilterModal = () => {
    setShowFilterModal(true);
  };

  return (
    <InboxThreadContainerHeader
      communicationKinds={kindFilter}
      setCommunicationKind={setCommunicationKind}
      automatedMessages={sendParameterFilter}
      setAutomatedMessages={setSendParameterFilter}
      recipientTypes={recipientFilter}
      setRecipientTypes={setRecipientFilter}
      messagesOrigin={srcOrDstFilter}
      setMessagesOrigin={setSrcOrDstFilter}
      dateStart={dateStart}
      setDateStart={setdateStart}
      dateEnd={dateEnd}
      setDateEnd={setdateEnd}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      showFilterModal={showFilterModal}
      setShowFilterModal={setShowFilterModal}
      onShowFilterModal={onShowFilterModal}
      {...args}
    />
  );
};

export const MemberThreadHeader = CustomMemberTemplate.bind({});
MemberThreadHeader.args = {
  thread: memberThreadProps,
};

export const SmartlistThreadHeader = CustomSmartlistTemplate.bind({});
SmartlistThreadHeader.args = {
  thread: smartlistThreadProps,
};

export const OfferThreadHeader = CustomOfferTemplate.bind({});
OfferThreadHeader.args = {
  thread: offerThreadProps,
};

export default {
  title: 'Library/Communication-V2/InboxThreadContainerHeader',
  component: InboxThreadContainerHeader,
  argTypes: {
    handleFiltersSubmit: { action: 'handleFiltersSubmit' },
    flagAsUnread: { action: 'flagAsUnread' },
    switchFavoriteStatus: { action: 'switchFavoriteStatus' },
    switchMutedStatus: { action: 'switchMutedStatus' },
    switchDisabledStatus: { action: 'switchDisabledStatus' },
    goToDetailPage: { action: 'goToDetailPage' },
    goToThreadListPage: { action: 'goToThreadListPage' },
    popKindFilterValue: { action: 'popKindFilterValue' },
    popRecipientFilterValue: { action: 'popRecipientFilterValue' },
    popSendParameterFilterValue: { action: 'popSendParameterFilterValue' },
    popSrcOrDstFilterValue: { action: 'popSrcOrDstFilterValue' },
    resetPeriodFilter: { action: 'resetPeriodFilter' },
    resetFilters: { action: 'resetFilters' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
