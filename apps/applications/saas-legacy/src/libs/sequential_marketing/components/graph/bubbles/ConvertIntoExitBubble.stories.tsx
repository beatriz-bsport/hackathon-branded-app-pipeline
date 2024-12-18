import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ConvertIntoExitBubble from './ConvertIntoExitBubble.component';

export default {
  title: 'Components/Cadences/Bubbles/ConvertIntoExit',
  component: ConvertIntoExitBubble,
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
      component: 'Bubble for convert into exit form',
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
} as ComponentMeta<typeof ConvertIntoExitBubble>;

const Template: ComponentStory<typeof ConvertIntoExitBubble> = (
  args: React.ComponentProps<typeof ConvertIntoExitBubble>,
) => <ConvertIntoExitBubble {...args} />;

export const Primary = Template.bind({});
