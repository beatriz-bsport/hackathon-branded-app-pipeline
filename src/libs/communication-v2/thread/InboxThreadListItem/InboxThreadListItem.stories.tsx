import React, { useState } from 'react';
import InboxThreadListItem, {
  Props,
} from '#src/libs/communication-v2/thread/InboxThreadListItem/InboxThreadListItem.component';
import {
  MemberThread,
  OfferThread,
  SmartListThread,
} from '#src/libs/communication-v2/factories/CommunicationThread';

const memberThreadProps = MemberThread();
const smartlistThreadProps = SmartListThread();
const offerThreadProps = OfferThread();
const flagAsUnread = () => {};
const switchFavoriteStatus = () => {};
const switchMutedStatus = () => {};
const switchDisabledStatus = () => {};

const CustomMemberTemplate = (args: Props) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div onClick={() => setIsSelected(!isSelected)}>
      <InboxThreadListItem
        flagAsUnread={flagAsUnread}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        isSelected={isSelected}
        {...args}
      />
    </div>
  );
};

const CustomSmartlistTemplate = (args: Props) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div onClick={() => setIsSelected(!isSelected)}>
      <InboxThreadListItem
        flagAsUnread={flagAsUnread}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        isSelected={isSelected}
        {...args}
      />
    </div>
  );
};

const CustomOfferTemplate = (args: Props) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div onClick={() => setIsSelected(!isSelected)}>
      <InboxThreadListItem
        flagAsUnread={flagAsUnread}
        switchFavoriteStatus={switchFavoriteStatus}
        switchMutedStatus={switchMutedStatus}
        switchDisabledStatus={switchDisabledStatus}
        isSelected={isSelected}
        {...args}
      />
    </div>
  );
};

export const MemberThreadItem = CustomMemberTemplate.bind({});
MemberThreadItem.args = {
  isLoading: false,
  thread: memberThreadProps,
};

export const SmartlistThreadItem = CustomSmartlistTemplate.bind({});
SmartlistThreadItem.args = {
  isLoading: false,
  thread: smartlistThreadProps,
};

export const OfferThreadItem = CustomOfferTemplate.bind({});
OfferThreadItem.args = {
  isLoading: false,
  thread: offerThreadProps,
};

export default {
  title: 'Library/Communication-V2/InboxThreadListItem',
  component: InboxThreadListItem,
  argTypes: {
    flagAsUnread: { action: 'flagAsUnread' },
    switchFavoriteStatus: { action: 'switchFavoriteStatus' },
    switchMutedStatus: { action: 'switchMutedStatus' },
    switchDisabledStatus: { action: 'switchDisabledStatus' },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
