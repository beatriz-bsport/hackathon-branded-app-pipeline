import React from 'react';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CustomMuiSkeletonText from './CustomMuiSkeletonIconContainer.component';

const Template: ComponentStory<typeof CustomMuiSkeletonText> = (
  args: React.ComponentProps<typeof CustomMuiSkeletonText>,
) => <CustomMuiSkeletonText {...args} />;

export const DefaultCustomMuiSkeletonIconContainer = Template.bind({});

export const CustomCustomMuiSkeletonIconContainer = Template.bind({});

CustomCustomMuiSkeletonIconContainer.args = {
  borderRadius: '8px',
  size: '36px',
};

export default {
  title: 'Components/Skeletons/CustomMuiSkeletonIconContainer',
  component: CustomMuiSkeletonText,
  argTypes: {
    borderRadius: {
      description:
        '(Optional) The borderRadius you want to give to the skeleton. Can be in px or %, as you want',
    },
    size: {
      description:
        '(Optional) The size you want to give to the skeleton. Can be in px or %, as you want',
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'This component is a custom mui skeleton simulating a squared icon container.',
    },
  },
} as ComponentMeta<typeof CustomMuiSkeletonText>;
