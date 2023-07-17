import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ChangeInExitBubble, {
  ChangeInExitBubbleProps,
} from './ChangeInExitBubble.component';

export default {
  title: 'Components/Cadences/Bubbles/ChangeInExit',
  component: ChangeInExitBubble,
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
      component: 'Bubble for change in exit form',
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
} as ComponentMeta<typeof ChangeInExitBubble>;

const Template: ComponentStory<typeof ChangeInExitBubble> = (
  args: ChangeInExitBubbleProps,
) => <ChangeInExitBubble {...args} />;

export const Primary = Template.bind({});
