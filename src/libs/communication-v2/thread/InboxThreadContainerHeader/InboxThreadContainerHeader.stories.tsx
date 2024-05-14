import React, { useState } from 'react';

import InboxThreadContainerHeader, {
  Props,
} from '#libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadContainerHeader.component';
import {
  MemberThread,
  OfferThread,
  SmartListThread,
} from '#libs/communication-v2/factories/CommunicationThread';
import { DateTime } from 'luxon';
import { SelectFieldItem } from '#libs/communication-v2/types';

const memberThreadProps = MemberThread();
const smartlistThreadProps = SmartListThread();
const offerThreadProps = OfferThread();

const CustomMemberTemplate = (args: Props) => {
  const [dateStartValue, setDateStartValue] = useState<DateTime | null>(null);
  const [dateEndValue, setDateEndValue] = useState<DateTime | null>(null);
  const [kindFilter, kindFilterSetter] = useState<SelectFieldItem[]>([]);
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
      kindFilterValues={kindFilter}
      kindFilterSetter={kindFilterSetter}
      sendParameterFilterValues={sendParameterFilter}
      sendParameterFilterSetter={setSendParameterFilter}
      recipientFilterValues={recipientFilter}
      recipientFilterSetter={setRecipientFilter}
      srcOrDstFilterValues={srcOrDstFilter}
      srcOrDstFilterSetter={setSrcOrDstFilter}
      dateStartValue={dateStartValue}
      dateStartSetter={setDateStartValue}
      dateEndValue={dateEndValue}
      dateEndSetter={setDateEndValue}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      showFilterModal={showFilterModal}
      setShowFilterModal={setShowFilterModal}
      onShowFilterModal={onShowFilterModal}
      {...args}
    />
  );
};

const CustomSmartlistTemplate = (args: Props) => {
  const [dateStartValue, setDateStartValue] = useState<DateTime | null>(null);
  const [dateEndValue, setDateEndValue] = useState<DateTime | null>(null);
  const [sendParameterFilter, setSendParameterFilter] = useState<
    SelectFieldItem[]
  >([]);
  const [kindFilter, kindFilterSetter] = useState<SelectFieldItem[]>([]);
  const [recipientFilter, setRecipientFilter] = useState<SelectFieldItem[]>([]);
  const [srcOrDstFilter, setSrcOrDstFilter] = useState<SelectFieldItem[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const onShowFilterModal = () => {
    setShowFilterModal(true);
  };

  return (
    <InboxThreadContainerHeader
      kindFilterValues={kindFilter}
      kindFilterSetter={kindFilterSetter}
      sendParameterFilterValues={sendParameterFilter}
      sendParameterFilterSetter={setSendParameterFilter}
      recipientFilterValues={recipientFilter}
      recipientFilterSetter={setRecipientFilter}
      srcOrDstFilterValues={srcOrDstFilter}
      srcOrDstFilterSetter={setSrcOrDstFilter}
      dateStartValue={dateStartValue}
      dateStartSetter={setDateStartValue}
      dateEndValue={dateEndValue}
      dateEndSetter={setDateEndValue}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      showFilterModal={showFilterModal}
      setShowFilterModal={setShowFilterModal}
      onShowFilterModal={onShowFilterModal}
      {...args}
    />
  );
};

const CustomOfferTemplate = (args: Props) => {
  const [kindFilter, kindFilterSetter] = useState<SelectFieldItem[]>([]);
  const [dateStartValue, setDateStartValue] = useState<DateTime | null>(null);
  const [dateEndValue, setDateEndValue] = useState<DateTime | null>(null);
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
      kindFilterValues={kindFilter}
      kindFilterSetter={kindFilterSetter}
      sendParameterFilterValues={sendParameterFilter}
      sendParameterFilterSetter={setSendParameterFilter}
      recipientFilterValues={recipientFilter}
      recipientFilterSetter={setRecipientFilter}
      srcOrDstFilterValues={srcOrDstFilter}
      srcOrDstFilterSetter={setSrcOrDstFilter}
      dateStartValue={dateStartValue}
      dateStartSetter={setDateStartValue}
      dateEndValue={dateEndValue}
      dateEndSetter={setDateEndValue}
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
