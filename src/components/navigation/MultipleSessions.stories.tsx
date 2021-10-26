import React from 'react';

import MultipleSessionDetails, { OwnProps } from './MultipleSessions.component';
import faker from 'faker';

const CustomTemplate = (args: OwnProps) => <MultipleSessionDetails {...args} />;

export const CompleteDefaultState = CustomTemplate.bind({});

CompleteDefaultState.args = {
  previousName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  currentName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  previousStatus: 'franchisor',
  currentStatus: 'manager',
  restoreSession: () => {},
  updateSession: () => {},
};

export default {
  title: 'Pages/Navigation/MultipleSession',
  component: MultipleSessionDetails,
  parameters: {
    docs: {
      page: null,
    },
  },
};
