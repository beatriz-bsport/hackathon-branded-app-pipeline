import React from 'react';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CustomMuiSkeletonText from './CustomMuiSkeletonText.component';

const Template: ComponentStory<typeof CustomMuiSkeletonText> = (
  args: React.ComponentProps<typeof CustomMuiSkeletonText>,
) => <CustomMuiSkeletonText {...args} />;

export const DefaultCustomMuiSkeletonText = Template.bind({});

export const CustomCustomMuiSkeletonText = Template.bind({});

CustomCustomMuiSkeletonText.args = {
  borderRadius: '4px',
  height: '16px',
  width: '50%',
};

export default {
  title: 'Components/Skeletons/CustomMuiSkeletonText',
  component: CustomMuiSkeletonText,
  argTypes: {
    borderRadius: {
      description:
        '(Optional) The borderRadius you want to give to the skeleton. Can be in px or %, as you want',
    },
    height: {
      description:
        '(Optional) The height you want to give to the skeleton. Can be in px or %, as you want',
    },
    width: {
      description:
        '(Optional) The width you want to give to the skeleton. Can be in px or %, as you want',
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'This component is a custom mui skeleton simulating a line of text (useful for labels / titles).',
    },
  },
} as ComponentMeta<typeof CustomMuiSkeletonText>;
