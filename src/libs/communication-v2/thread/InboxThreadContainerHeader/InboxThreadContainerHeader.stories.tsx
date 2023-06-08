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

const flagAsUnread = () => {};
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
      flagAsUnread={flagAsUnread}
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
      flagAsUnread={flagAsUnread}
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
      flagAsUnread={flagAsUnread}
      switchFavoriteStatus={switchFavoriteStatus}
      switchMutedStatus={switchMutedStatus}
      switchDisabledStatus={switchDisabledStatus}
      {...args}
    />
  );
};

export const MemberThreadHeader = CustomMemberTemplate.bind({});
MemberThreadHeader.args = {
  title: memberThreadProps.title,
  cover: memberThreadProps.cover,
  isFavorite: memberThreadProps.favorite,
  isMuted: memberThreadProps.muted,
};

export const SmartlistThreadHeader = CustomSmartlistTemplate.bind({});
SmartlistThreadHeader.args = {
  title: smartlistThreadProps.title,
  cover: smartlistThreadProps.cover,
  isFavorite: smartlistThreadProps.favorite,
  isMuted: smartlistThreadProps.muted,
};

export const OfferThreadHeader = CustomOfferTemplate.bind({});
OfferThreadHeader.args = {
  title: offerThreadProps.title,
  subtitle: offerThreadProps.subtitle,
  cover: offerThreadProps.cover,
  isFavorite: offerThreadProps.favorite,
  isMuted: offerThreadProps.muted,
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
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
