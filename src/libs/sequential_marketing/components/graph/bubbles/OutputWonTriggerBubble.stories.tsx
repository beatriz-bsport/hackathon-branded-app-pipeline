import React from 'react';
import Immutable from 'seamless-immutable';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import OutputWonTriggerBubble from './OutputWonTriggerBubble.component';
import { smartlistBatchFactory } from '#libs/smart-list/factories';
import { triggerBatchFactory } from '#libs/sequential_marketing/factories';

export default {
  title: 'Components/Cadences/Bubbles/WonTrigger',
  component: OutputWonTriggerBubble,
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
      component: 'Bubble for won output marketing action form',
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
    isInitial: {
      description:
        'Indicates whether the workflow is in its initial state. True if it has not been initialized yet, signifying the first configuration.',
      control: { type: 'boolean' },
    },
    connectedTriggers: {
      description:
        'Array of connected triggers indicating conditions for a member to exit the workflow, marked as "win".',
      control: { type: 'object' },
    },
    smartlists: {
      description:
        'Immutable array containing all the SmartLists of the company.',
      control: { type: 'object' },
    },
  },
} as ComponentMeta<typeof OutputWonTriggerBubble>;

const Template: ComponentStory<typeof OutputWonTriggerBubble> = (
  args: React.ComponentProps<typeof OutputWonTriggerBubble>,
) => <OutputWonTriggerBubble {...args} />;

const smartlists = smartlistBatchFactory(5);

export const Creation = Template.bind({});
Creation.args = {
  isInitial: true,
  smartlists: Immutable(smartlists),
  entrystepId: 1,
};

export const Edition = Template.bind({});
Edition.args = {
  connectedTriggers: triggerBatchFactory(
    3,
    smartlists.map((smartlist) => smartlist.id),
  ),
  smartlists: Immutable(smartlists),
  entrystepId: 1,
};
