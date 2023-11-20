import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceChip from './CadenceChip.component';

export default {
  title: 'Components/Cadences/Chips/CadenceChips',
  component: CadenceChip,
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'This component is a custom chip skeleton for sequential marketing chips.',
      },
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
} as ComponentMeta<typeof CadenceChip>;

const Template: ComponentStory<typeof CadenceChip> = (
  args: React.ComponentProps<typeof CadenceChip>,
) => <CadenceChip {...args} />;

export const Trigger = Template.bind({});
Trigger.args = {
  name: 'Trigger Chip',
  icon: 'CheckCircle',
  color: 'rgba(144, 190, 109, 1)',
};

export const Marketing = Template.bind({});
Marketing.args = {
  name: '{ Email object }',
  icon: 'Email',
  color: 'rgba(4, 109, 200, 1)',
};

export const MarketingSelected = Template.bind({});
MarketingSelected.args = {
  name: '{ Email object }',
  icon: 'Email',
  color: 'rgba(4, 109, 200, 1)',
};

export const WithTooltip = Template.bind({});
WithTooltip.args = {
  name: '{ Email object}',
  icon: 'Email',
  color: 'rgba(4, 109, 200, 1)',
  toolTip: true,
};

export const Empty = Template.bind({});
