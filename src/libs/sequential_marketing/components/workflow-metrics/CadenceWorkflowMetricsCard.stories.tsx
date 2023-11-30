import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceWorkflowMetricsCard, {
  WorkflowMetricsVariant,
} from './CadenceWorkflowMetricsCard.component';

const CadenceWorkflowMetricsCardTemplate = (
  args: React.ComponentProps<typeof CadenceWorkflowMetricsCard>,
) => <CadenceWorkflowMetricsCard {...args} />;

export const WorkflowMetricsCard = CadenceWorkflowMetricsCardTemplate.bind({});

WorkflowMetricsCard.args = {
  variant: 'member',
  count: 42,
};

export default {
  title: 'Components/Cadences/WorkflowMetrics/Card',
  component: CadenceWorkflowMetricsCard,
  parameters: {
    docs: {
      page: null,
    },
    backgrounds: {
      default: 'lightGrey',
      values: [
        { name: 'none', value: 'none' },
        { name: 'lightGrey', value: '#949494' },
        { name: 'grey', value: '#666666' },
        { name: 'black', value: '#000000' },
      ],
    },
    description: {
      component:
        'Card for Audience tracking data, representing different parameters of a workflow.',
    },
  },
  argTypes: {
    count: {
      description: 'The value of the tracking data parameter.',
    },
    variant: {
      description: 'The tracking data parameter.',
      control: 'radio',
      options: Object.values(WorkflowMetricsVariant),
    },
    backgroundColor: {
      description: '(Optional) The background color of the card.',
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
} as ComponentMeta<typeof CadenceWorkflowMetricsCard>;
