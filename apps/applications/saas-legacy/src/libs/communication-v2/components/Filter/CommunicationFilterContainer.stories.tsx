import React from 'react';
import CommunicationFilterContainer, {
  Props,
} from '#src/libs/communication-v2/components/Filter/CommunicationFilterContainer.component';
import {
  CONTEXT_MEMBER,
  CONTEXT_NOTIFICATION,
  CONTEXT_OFFER,
  CONTEXT_SMARTLIST,
} from '#src/libs/communication-v2/constants';

const defaultArgs = {
  handleFilters: () => {},
};

const CustomTemplate = (args: Props) => (
  <CommunicationFilterContainer {...args} />
);

export const FilterOnMemberChat = CustomTemplate.bind({});

FilterOnMemberChat.args = {
  ...defaultArgs,
  communicationIdentifier: CONTEXT_MEMBER,
};

export const FilterOnNotificationChat = CustomTemplate.bind({});

FilterOnNotificationChat.args = {
  ...defaultArgs,
  communicationIdentifier: CONTEXT_NOTIFICATION,
};

export const FilterOnOfferChat = CustomTemplate.bind({});

FilterOnOfferChat.args = {
  ...defaultArgs,
  communicationIdentifier: CONTEXT_OFFER,
};

export const FilterOnSmartlistChat = CustomTemplate.bind({});

FilterOnSmartlistChat.args = {
  ...defaultArgs,
  communicationIdentifier: CONTEXT_SMARTLIST,
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
