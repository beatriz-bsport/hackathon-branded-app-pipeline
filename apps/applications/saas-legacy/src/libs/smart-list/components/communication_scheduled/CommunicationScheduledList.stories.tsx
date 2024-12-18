import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CommunicationScheduledList from './CommunicationScheduledList.component';
import { communicationScheduledBatchFactory } from '#src/libs/smart-list/factories';

export default {
  title: 'Components/Smartlists/CommunicationScheduledList',
  component: CommunicationScheduledList,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'This component displays a list of multiple scheduled communication items.',
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
    loading: {
      control: 'boolean',
      description: 'Scheduled communications loading state.',
    },
    communicationScheduledList: {
      description: 'List of scheduled communications.',
    },
    currentPage: {
      control: 'number',
      description: 'Number of the current page, defaults to 1.',
    },
    total: {
      control: 'number',
      description:
        'Total number of the communication scheduled, used to compute the number of pages.',
    },
    editCommunication: {
      action: 'editCommunication',
      description: 'Initiates the editing of the communication.',
    },
    deleteCommunication: {
      action: 'deleteCommunication',
      description: 'Initiates the deletion of the communication.',
    },
    changePage: {
      action: 'changePage',
      description: 'Changes the page.',
    },
  },
} as ComponentMeta<typeof CommunicationScheduledList>;

const Template: ComponentStory<typeof CommunicationScheduledList> = (
  args: React.ComponentProps<typeof CommunicationScheduledList>,
) => <CommunicationScheduledList {...args} />;

export const SinglePage = Template.bind({});
SinglePage.args = {
  communicationScheduledList: communicationScheduledBatchFactory(3),
};

export const MultiplePages = Template.bind({});
MultiplePages.args = {
  communicationScheduledList: communicationScheduledBatchFactory(5),
  total: 13,
};
