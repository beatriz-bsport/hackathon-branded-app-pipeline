import React from 'react';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ProgressBar from './ProgressBar.component';

const Template: ComponentStory<typeof ProgressBar> = (
  args: React.ComponentProps<typeof ProgressBar>,
) => <ProgressBar {...args} />;

export const DefaultProgress = Template.bind({});

DefaultProgress.args = {
  count: 42,
};

export const ColoredProgress = Template.bind({});

ColoredProgress.args = {
  count: 42,
  customColor: 'green',
};

export const DisabledProgress = Template.bind({});

DisabledProgress.args = {
  count: 42,
  disabled: true,
};

export const MinimumWidthProgress = Template.bind({});

MinimumWidthProgress.args = {
  count: 42,
  disabled: true,
  minimumWidth: true,
};

export default {
  title: 'Components/ProgressBar',
  parameters: {
    docs: {
      page: null,
    },
  },
  argTypes: {
    customColor: {
      description: '(Optional) The color the progress bar will be displayed.',
    },
    count: {
      description: '(Optional) The number displayed by the progress bar.',
    },
    disabled: {
      description:
        '(Optional) A boolean used if we want to disable the progress bar.',
    },
    minimumWidth: {
      description:
        '(Optional) A boolean that will give the progress bar a minimal size.',
    },
  },
} as ComponentMeta<typeof ProgressBar>;
