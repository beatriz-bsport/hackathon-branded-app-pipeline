import React from 'react';
import Welcome from './Welcome.component';

// @ts-expect-error
const WelcomeTemplate = (args: {}) => <Welcome {...args} />;

export const Validation = WelcomeTemplate.bind({});
Validation.args = {};

export default {
  title: 'Components/Login/WelcomeComponent',
  parameters: {
    docs: {
      page: null,
    },
  },
};
