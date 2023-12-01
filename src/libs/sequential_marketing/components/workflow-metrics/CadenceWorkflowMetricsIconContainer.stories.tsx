import React from 'react';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceWorkflowMetricsIconContainer from './CadenceWorkflowMetricsIconContainer.component';
import TrophyIcon from '#components/icons/TrophyIcon.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

const CadenceWorkflowMetricsIconsTemplate = (
  args: React.ComponentProps<typeof CadenceWorkflowMetricsIconContainer>,
) => <CadenceWorkflowMetricsIconContainer {...args} />;

export const MuiIcon = CadenceWorkflowMetricsIconsTemplate.bind({});
MuiIcon.args = {
  icon: 'People',
  CustomIcon: null,
  iconColor: SequentialMarketingColors.WORKFLOW_METRICS_ORANGE,
};

export const CustomTrophyIcon = CadenceWorkflowMetricsIconsTemplate.bind({});
CustomTrophyIcon.args = {
  icon: null,
  CustomIcon: TrophyIcon,
  iconColor: SequentialMarketingColors.WORKFLOW_METRICS_GREEN,
};

export default {
  title: 'Components/Cadences/WorkflowMetrics/IconContainer',
  component: CadenceWorkflowMetricsIconContainer,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Container for the icons used in Audience WorkflowMetrics data.',
    },
    backgrounds: {
      default: 'lightGrey',
      values: [
        { name: 'none', value: 'none' },
        { name: 'lightGrey', value: '#949494' },
        { name: 'grey', value: '#666666' },
      ],
    },
  },
  argTypes: {
    icon: {
      description: 'The MUI icon we want to display.',
    },
    CustomIcon: {
      description: 'The custom icon we want to display.',
    },
    iconColor: {
      description: 'The color of the icon.',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof CadenceWorkflowMetricsIconContainer>;
