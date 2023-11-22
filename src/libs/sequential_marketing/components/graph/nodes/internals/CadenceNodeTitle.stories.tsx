import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CadenceNodeTitle from './CadenceNodeTitle.component';
import { triggerBatchFactory } from '#libs/sequential_marketing/factories';
import { smartlistBatchFactory } from '#libs/smart-list/factories';

export default {
  title: 'Components/Cadences/CadenceNodes/Title',
  component: CadenceNodeTitle,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Title component used in cadence nodes.',
    },
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'The icon in the top left corner of the cadence node.',
    },
    color: { control: 'color', description: 'The color for the icon.' },
    actions: {
      control: 'object',
      description:
        'Array of actions or nested actions for the top left button menu of the cadence node.',
    },
    disabled: {
      control: 'boolean',
      description: 'Indicates whether the node is disabled.',
    },
    squareIcon: {
      control: 'boolean',
      description:
        "Indicates the form of the icon's frame. If true, the icon is in a square; otherwise, it's in a diamond.",
    },
    hasNestedActions: {
      control: 'boolean',
      description: 'Indicates whether the action list is using nested actions.',
    },
    customIconForActions: {
      control: 'text',
      description:
        'Custom icon to be displayed for the action menu associated with the cadence node.',
    },
    triggerList: {
      control: 'object',
      description:
        'List of connected triggers associated with the cadence node.',
    },
    getSmartlist: {
      action: 'getSmartlistAction',
      description:
        'Function to retrieve details about a SmartList based on its ID.',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '30em' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof CadenceNodeTitle>;

const CadenceNodeTitleTemplate: ComponentStory<typeof CadenceNodeTitle> = (
  args: React.ComponentProps<typeof CadenceNodeTitle>,
) => <CadenceNodeTitle {...args} />;

const smartlists = smartlistBatchFactory(5);
const smartlistIds = smartlists.map((smartlist) => smartlist.id);
const getSmartlist = (id: number) =>
  smartlists.find((smartlist) => smartlist.id === id);

const actionData = {
  addPhoto: action('addPhoto'),
  localize: action('localize'),
  delete: action('delete'),
};

export const Minimal = CadenceNodeTitleTemplate.bind({});
Minimal.args = {
  name: 'Cadence',
  icon: 'Email',
  color: 'purple',
};

export const WithTrigger = CadenceNodeTitleTemplate.bind({});
WithTrigger.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  triggerList: triggerBatchFactory(1, smartlistIds),
  getSmartlist: getSmartlist,
};

export const WithDelete = CadenceNodeTitleTemplate.bind({});
WithDelete.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  actions: [{ label: 'Delete', icon: 'Delete', onClick: actionData.delete }],
};

export const WithMultipleActions = CadenceNodeTitleTemplate.bind({});
WithMultipleActions.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  actions: [
    { label: 'Photo', icon: 'AddAPhoto', onClick: actionData.addPhoto },
    { label: 'Hotel', icon: 'LocalHotel', onClick: actionData.localize },
  ],
};

export const WithTriggerList = CadenceNodeTitleTemplate.bind({});
WithTriggerList.args = {
  name: 'Cadence',
  icon: 'PlayArrow',
  color: 'rgba(144, 190, 109, 1)',
  triggerList: triggerBatchFactory(3, smartlistIds),
  getSmartlist: getSmartlist,
};

export const CustomIconForActions = CadenceNodeTitleTemplate.bind({});
CustomIconForActions.args = {
  name: 'Cadence',
  icon: 'Email',
  color: 'purple',
  customIconForActions: 'AcUnitRounded',
};
