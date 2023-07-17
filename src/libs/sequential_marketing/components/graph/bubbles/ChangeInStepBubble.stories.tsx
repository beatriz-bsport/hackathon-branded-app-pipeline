import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ChangeInStepBubble, {
  ChangeInStepBubbleProps,
} from './ChangeInStepBubble.component';

export default {
  title: 'Components/Cadences/Bubbles/ChangeInStep',
  component: ChangeInStepBubble,
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
      component: 'Bubble for change in step form',
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
} as ComponentMeta<typeof ChangeInStepBubble>;

const Template: ComponentStory<typeof ChangeInStepBubble> = (
  args: ChangeInStepBubbleProps,
) => <ChangeInStepBubble {...args} />;

export const Primary = Template.bind({});
