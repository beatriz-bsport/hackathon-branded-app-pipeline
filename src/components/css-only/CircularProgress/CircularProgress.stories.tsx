import React from 'react';

import { CircularProgressForStorybook, Props } from './';

const CircularProgressTemplate = (args: Props) => (
  // @ts-expect-error
  <CircularProgressForStorybook {...args} />
);

export const IdleProgress = CircularProgressTemplate.bind({});
IdleProgress.args = {
  size: null,
  contrastStrokeColor: false,
};

export const SmallProgress = CircularProgressTemplate.bind({});
SmallProgress.args = {
  size: 'sm',
  contrastStrokeColor: false,
};

export default {
  title: 'Components/CssOnly/CircularProgress',
  component: CircularProgressForStorybook,
  argTypes: {
    size: { control: { type: 'select', options: ['sm', undefined] } },
  },
  parameters: {
    docs: {
      page: null,
    },
  },
};
