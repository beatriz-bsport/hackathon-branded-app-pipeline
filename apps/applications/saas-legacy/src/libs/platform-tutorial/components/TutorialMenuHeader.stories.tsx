import React from 'react';

import TutorialMenuHeader, { Props } from './TutorialMenuHeader.component';

const CustomTemplate = (args: Props) => <TutorialMenuHeader {...args} />;

export const TutorialMenuHeaderCompleted = CustomTemplate.bind({});

TutorialMenuHeaderCompleted.args = {
  percentage: 100,
};

export const TutorialMenuHeaderNotCompleted = CustomTemplate.bind({});

TutorialMenuHeaderNotCompleted.args = {
  percentage: 29,
};

export default {
  title: 'Library/Tutorial/TutorialMenuHeader',
  component: TutorialMenuHeader,
  parameters: {
    docs: {
      page: null,
    },
  },
};
