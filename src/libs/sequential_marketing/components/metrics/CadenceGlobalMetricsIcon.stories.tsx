import React from 'react';

import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceGlobalMetricsIcon from './CadenceGlobalMetricsIcon.component';
import TrophyIcon from '#src/components/icons/TrophyIcon.component';
import { SequentialMarketingColors } from '#src/libs/sequential_marketing/constants';

const CadenceMetricsIconTemplate: ComponentStory<
  typeof CadenceGlobalMetricsIcon
> = (args: React.ComponentProps<typeof CadenceGlobalMetricsIcon>) => (
  <CadenceGlobalMetricsIcon {...args} />
);

export const MuiIcon = CadenceMetricsIconTemplate.bind({});
MuiIcon.args = {
  icon: 'People',
  CustomIcon: null,
  iconColor: SequentialMarketingColors.WORKFLOW_METRICS_ORANGE,
};

export const CustomTrophyIcon = CadenceMetricsIconTemplate.bind({});
CustomTrophyIcon.args = {
  icon: null,
  CustomIcon: TrophyIcon,
  iconColor: SequentialMarketingColors.WORKFLOW_METRICS_GREEN,
};

export default {
  title: 'Components/Cadences/Metrics/IconContainer',
  component: CadenceGlobalMetricsIcon,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Container for the icons used for Audience metrics board.',
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
} as ComponentMeta<typeof CadenceGlobalMetricsIcon>;
