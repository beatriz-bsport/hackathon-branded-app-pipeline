import React from 'react';
import CommunicationFilterContainer, {
  Props,
} from './CommunicationFilterContainer.component';
import {
  CONTEXT_MEMBER,
  CONTEXT_NOTIFICATION,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
} from '#libs/communication-v2/constants';

const defaultArgs = {
  handleFilters: () => {},
};

const CustomTemplate = (args: Props) => (
  <CommunicationFilterContainer {...args} />
);

export const FilterOnMemberChat = CustomTemplate.bind({});

FilterOnMemberChat.args = {
  ...defaultArgs,
  contextIdentifier: CONTEXT_MEMBER,
};

export const FilterOnNotificationChat = CustomTemplate.bind({});

FilterOnNotificationChat.args = {
  ...defaultArgs,
  contextIdentifier: CONTEXT_NOTIFICATION,
};

export const FilterOnOfferChat = CustomTemplate.bind({});

FilterOnOfferChat.args = {
  ...defaultArgs,
  contextIdentifier: CONTEXT_OFFER,
};

export const FilterOnSmartlistChat = CustomTemplate.bind({});

FilterOnSmartlistChat.args = {
  ...defaultArgs,
  contextIdentifier: CONTEXT_SMARTLIST,
};

export default {
  title: 'Library/Communication-V2/FilterContainer',
  component: CommunicationFilterContainer,
  parameters: {
    docs: {
      page: null,
    },
  },
};
