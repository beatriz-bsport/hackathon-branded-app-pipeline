import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import StepMemberCountChip from './StepMemberCountChip.component';

const actionData = {
  onClick: action('onClick'),
};

const StepMemberCountChipTemplate = (
  args: React.ComponentProps<typeof StepMemberCountChip>,
) => <StepMemberCountChip {...args} />;

export const StepMemberCount = StepMemberCountChipTemplate.bind({});
StepMemberCount.args = { count: 300, isVisible: true, isHighlighted: false };

export const Highlited = StepMemberCountChipTemplate.bind({});
Highlited.args = { count: 300, isVisible: true, isHighlighted: true };

export const NotVisible = StepMemberCountChipTemplate.bind({});
NotVisible.args = { count: 300, isVisible: false };

export default {
  title: 'Components/Cadences/Chips/StepMemberCountChip',
  component: StepMemberCountChip,
  args: { onClick: actionData.onClick },
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
} as ComponentMeta<typeof StepMemberCountChip>;
