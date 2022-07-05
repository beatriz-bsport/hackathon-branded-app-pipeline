import React from 'react';
import CommunicationFilterContainer, { FilterProps } from './CommunicationFilterContainer.component';

const CustomTemplate = (args: FilterProps) => <CommunicationFilterContainer {...args} />;

export const CreateState = CustomTemplate.bind({});

CreateState.args = {
  hasKindFilter: true,
  hasDatesFilter: true,
  hasChannelFilter: true,
  hasRecipientFilter: true,
  hasSendParameterFilter: true,
  kindFilterOptionsOverride: [{
    value: 1, label: 'exemple override'
  }]
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