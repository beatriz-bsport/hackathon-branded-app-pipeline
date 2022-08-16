import React from 'react';
import CommunicationFilterContainer, {
  Props,
} from './CommunicationFilterContainer.component';

const CustomTemplate = (args: Props) => (
  <CommunicationFilterContainer {...args} />
);

export const CreateState = CustomTemplate.bind({});

CreateState.args = {
  contextIdentifier: 1,
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
