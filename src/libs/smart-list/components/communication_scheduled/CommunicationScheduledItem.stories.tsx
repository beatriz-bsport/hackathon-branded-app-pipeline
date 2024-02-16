import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CommunicationScheduledItem from './CommunicationScheduledItem.component';
import { communicationScheduledFactory } from '#libs/smart-list/factories';
import { CommunicationFactory } from '#libs/communication-v2/factories/Communication';

export default {
  title: 'Components/Smartlists/CommunicationScheduledItem',
  component: CommunicationScheduledItem,
  parameters: {
    docs: { page: null },
    description: {
      component:
        'This serves as the fundamental component for managing scheduled communication items.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '3em', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    communicationScheduled: {
      description: 'Represents a scheduled communication.',
    },
    communicationSent: {
      description: 'Represents a communication sent on the scheduled date.',
    },
    editCommunication: {
      action: 'editCommunication',
      description: 'Initiates the editing of the communication.',
    },
    deleteCommunication: {
      action: 'deleteCommunication',
      description: 'Initiates the deletion of the communication.',
    },
    showCommunication: {
      action: 'showCommunication',
      description: 'Shows of the communication.',
    },
  },
} as ComponentMeta<typeof CommunicationScheduledItem>;

const Template: ComponentStory<typeof CommunicationScheduledItem> = (
  args: React.ComponentProps<typeof CommunicationScheduledItem>,
) => <CommunicationScheduledItem {...args} />;

export const FutureCommunication = Template.bind({});
FutureCommunication.args = {
  communicationScheduled: communicationScheduledFactory({
    company: null,
    smartlist: 201,
  }),
};

export const CommunicationSent = Template.bind({});
CommunicationSent.args = {
  communicationScheduled: communicationScheduledFactory({
    company: null,
    smartlist: 201,
  }),
  communicationSent: CommunicationFactory(),
};
