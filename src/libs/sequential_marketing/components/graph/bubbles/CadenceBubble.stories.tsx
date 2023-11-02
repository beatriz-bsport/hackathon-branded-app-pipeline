import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceBubble from './CadenceBubble.component';

export default {
  title: 'Components/Cadences/Bubbles/Generic',
  component: CadenceBubble,
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
      component: 'Bubbles for cadence graph forms',
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: "Bubble's title",
    },
    icon: {
      control: 'text',
      description: 'String corresponding to the bubble icon',
    },
    color: {
      control: 'color',
      description: 'Color of the bubble icon',
    },
    onCancelClick: {
      action: 'onCancelClicked',
      description: 'Cancel button',
    },
    onConfirmClick: {
      action: 'onConfirmClicked',
      description: 'Confirm button',
    },
    onCancelText: {
      control: 'text',
      description: 'String describing the cancel action',
    },
    onConfirmText: {
      control: 'text',
      description: 'String describing the confirm action',
    },
    minimalIcon: {
      control: 'boolean',
      description: 'True for an icon without diamond background',
    },
    withoutBottomActions: {
      control: 'boolean',
      description: 'True to hide bottom action buttons',
    },
    squareIcon: {
      control: 'boolean',
      description:
        'True to have square icon in the bubble header instead of the diamond one',
    },
    smallTitle: {
      control: 'boolean',
      description: 'True to have a smaller title',
    },
  },
} as ComponentMeta<typeof CadenceBubble>;

const Template: ComponentStory<typeof CadenceBubble> = (
  args: React.ComponentProps<typeof CadenceBubble>,
) => <CadenceBubble {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'Title',
  icon: 'PlayArrow',
  color: '#60caff',
  onCancelText: 'Cancel',
  onConfirmText: 'Confirm',
  minimalIcon: false,
  withoutBottomActions: false,
};

export const SquareIcon = Template.bind({});
SquareIcon.args = {
  title: 'Title',
  icon: 'DeviceHub',
  color: '#ffb55e',
  onCancelText: 'No',
  onConfirmText: 'Yes',
  squareIcon: true,
};
