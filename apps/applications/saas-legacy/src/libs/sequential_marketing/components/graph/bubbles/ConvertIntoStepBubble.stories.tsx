import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ConvertIntoStepBubble from './ConvertIntoStepBubble.component';

export default {
  title: 'Components/Cadences/Bubbles/ConvertIntoStep',
  component: ConvertIntoStepBubble,
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
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Bubble for convert into step form',
    },
  },
  argTypes: {
    onCancel: {
      action: 'onCancelClicked',
      description: 'Cancel button',
    },
    onConfirm: {
      action: 'onConfirmClicked',
      description: 'Confirm button',
    },
  },
} as ComponentMeta<typeof ConvertIntoStepBubble>;

const Template: ComponentStory<typeof ConvertIntoStepBubble> = (
  args: React.ComponentProps<typeof ConvertIntoStepBubble>,
) => <ConvertIntoStepBubble {...args} />;

export const Primary = Template.bind({});
