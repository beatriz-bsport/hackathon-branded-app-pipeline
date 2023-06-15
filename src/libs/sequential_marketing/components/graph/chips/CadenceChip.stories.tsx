import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceChip, { CadenceChipProps } from './CadenceChip.component';

export default {
  title: 'Components/Cadences/Chips/CadenceChips',
  component: CadenceChip,
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
  args: CadenceChipProps,
) => <CadenceChip {...args} />;

export const Trigger = Template.bind({});
Trigger.args = {
  name: 'Trigger Chip',
  icon: 'CheckCircle',
  color: 'rgba(144, 190, 109, 1)',
};

export const Marketing = Template.bind({});
Marketing.args = {
  name: '{ Email object}',
  icon: 'Email',
  color: 'rgba(4, 109, 200, 1)',
  withBackground: false,
  blackText: true,
};

export const MarketingSelected = Template.bind({});
MarketingSelected.args = {
  name: '{ Email object}',
  icon: 'Email',
  color: 'rgba(4, 109, 200, 1)',
  blackText: true,
};

export const Empty = Template.bind({});
