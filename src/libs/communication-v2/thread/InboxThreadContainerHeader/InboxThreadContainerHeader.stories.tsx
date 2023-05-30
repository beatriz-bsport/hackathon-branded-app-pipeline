import React, { useState } from 'react';

import InboxThreadContainerHeader, {
  Props,
} from '#libs/communication-v2/thread/InboxThreadContainerHeader/InboxThreadContainerHeader.component';
import {
  MemberThread,
  OfferThread,
  SmartListThread,
} from '#libs/communication-v2/factories/CommunicationThread';
import { Moment as MomentType } from 'moment-timezone';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { SelectFieldItem } from '#libs/communication-v2/types';

const memberThreadProps = MemberThread();
const smartlistThreadProps = SmartListThread();
const offerThreadProps = OfferThread();

const markAsUnread = () => {};
const switchFavoriteStatus = () => {};
const switchMutedStatus = () => {};
const switchDisabledStatus = () => {};

const CustomMemberTemplate = (args: Props) => {
  const [dateStartValue, setDateStartValue] = useState<MomentType | null>(null);
  const [dateEndValue, setDateEndValue] = useState<MomentType | null>(null);
  const [kindFilter, kindFilterSetter] = useState<SelectFieldItem[]>([]);
  const [srcOrDstFilter, setSrcOrDstFilter] = useState<SelectFieldItem[]>([]);

  const periodHasChanged = !!dateStartValue || !!dateEndValue;

  return (
    <InboxThreadContainerHeader
      relatedObjectKind={ChatThreadKinds.Member}
      hasKindFilter
      kindFilterValues={kindFilter}
      kindFilterSetter={kindFilterSetter}
      hasRecipientFilter={false}
      hasSendParameterFilter={false}
      hasSrcOrDstFilter
      srcOrDstFilterValues={srcOrDstFilter}
      srcOrDstFilterSetter={setSrcOrDstFilter}
      hasDatesFilter
      dateStartValue={dateStartValue}
      dateStartSetter={setDateStartValue}
      dateEndValue={dateEndValue}
      dateEndSetter={setDateEndValue}
      periodHasChanged={periodHasChanged}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      markAsUnread={markAsUnread}
      switchFavoriteStatus={switchFavoriteStatus}
      switchMutedStatus={switchMutedStatus}
      switchDisabledStatus={switchDisabledStatus}
      {...args}
    />
  );
};

const CustomSmartlistTemplate = (args: Props) => {
  const [dateStartValue, setDateStartValue] = useState<MomentType | null>(null);
  const [dateEndValue, setDateEndValue] = useState<MomentType | null>(null);
  const [sendParameterFilter, setSendParameterFilter] = useState<
    SelectFieldItem[]
  >([]);
  const [kindFilter, kindFilterSetter] = useState<SelectFieldItem[]>([]);
  const [srcOrDstFilter, setSrcOrDstFilter] = useState<SelectFieldItem[]>([]);

  const periodHasChanged = !!dateStartValue || !!dateEndValue;

  return (
    <InboxThreadContainerHeader
      relatedObjectKind={ChatThreadKinds.Smartlist}
      hasKindFilter
      kindFilterValues={kindFilter}
      kindFilterSetter={kindFilterSetter}
      hasRecipientFilter={false}
      hasSendParameterFilter
      sendParameterFilterValues={sendParameterFilter}
      sendParameterFilterSetter={setSendParameterFilter}
      hasSrcOrDstFilter
      srcOrDstFilterValues={srcOrDstFilter}
      srcOrDstFilterSetter={setSrcOrDstFilter}
      hasDatesFilter
      dateStartValue={dateStartValue}
      dateStartSetter={setDateStartValue}
      dateEndValue={dateEndValue}
      dateEndSetter={setDateEndValue}
      periodHasChanged={periodHasChanged}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      markAsUnread={markAsUnread}
      switchFavoriteStatus={switchFavoriteStatus}
      switchMutedStatus={switchMutedStatus}
      switchDisabledStatus={switchDisabledStatus}
      {...args}
    />
  );
};

const CustomOfferTemplate = (args: Props) => {
  const [kindFilter, kindFilterSetter] = useState<SelectFieldItem[]>([]);
  const [dateStartValue, setDateStartValue] = useState<MomentType | null>(null);
  const [dateEndValue, setDateEndValue] = useState<MomentType | null>(null);
  const [recipientFilter, setRecipientFilter] = useState<SelectFieldItem[]>([]);
  const [srcOrDstFilter, setSrcOrDstFilter] = useState<SelectFieldItem[]>([]);

  const periodHasChanged = !!dateStartValue || !!dateEndValue;

  return (
    <InboxThreadContainerHeader
      relatedObjectKind={ChatThreadKinds.Offer}
      hasKindFilter
      kindFilterValues={kindFilter}
      kindFilterSetter={kindFilterSetter}
      hasRecipientFilter
      recipientFilterValues={recipientFilter}
      recipientFilterSetter={setRecipientFilter}
      hasSendParameterFilter={false}
      hasSrcOrDstFilter
      srcOrDstFilterValues={srcOrDstFilter}
      srcOrDstFilterSetter={setSrcOrDstFilter}
      hasDatesFilter
      dateStartValue={dateStartValue}
      dateStartSetter={setDateStartValue}
      dateEndValue={dateEndValue}
      dateEndSetter={setDateEndValue}
      periodHasChanged={periodHasChanged}
      allPreviousFilter={{ filters: [], dateStart: null, dateEnd: null }}
      markAsUnread={markAsUnread}
      switchFavoriteStatus={switchFavoriteStatus}
      switchMutedStatus={switchMutedStatus}
      switchDisabledStatus={switchDisabledStatus}
      {...args}
    />
  );
};

export const MemberThreadHeader = CustomMemberTemplate.bind({});
MemberThreadHeader.args = {
  name: memberThreadProps.name,
  cover: memberThreadProps.cover,
  isFavorite: memberThreadProps.isFavorite,
  isMuted: memberThreadProps.isMuted,
};

export const SmartlistThreadHeader = CustomSmartlistTemplate.bind({});
SmartlistThreadHeader.args = {
  name: smartlistThreadProps.name,
  cover: smartlistThreadProps.cover,
  isFavorite: smartlistThreadProps.isFavorite,
  isMuted: smartlistThreadProps.isMuted,
};

export const OfferThreadHeader = CustomOfferTemplate.bind({});
OfferThreadHeader.args = {
  name: offerThreadProps.name,
  subtitle: offerThreadProps.subtitle,
  cover: offerThreadProps.cover,
  isFavorite: offerThreadProps.isFavorite,
  isMuted: offerThreadProps.isMuted,
};

export default {
  title: 'Library/Communication-V2/InboxThreadContainerHeader',
  component: InboxThreadContainerHeader,
  argTypes: {
    handleFiltersSubmit: { action: 'handleFiltersSubmit' },
    markAsUnread: { action: 'markAsUnread' },
    switchFavoriteStatus: { action: 'switchFavoriteStatus' },
    switchMutedStatus: { action: 'switchMutedStatus' },
    switchDisabledStatus: { action: 'switchDisabledStatus' },
    goToDetailPage: { action: 'goToDetailPage' },
    goToThreadListPage: { action: 'goToThreadListPage' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
