import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import TriggerCard from './TriggerCard.component';
import { TriggerKind } from '#src/libs/sequential_marketing/constants';
import { triggerFactory } from '#src/libs/sequential_marketing/factories';
import { smartlistFactory } from '#src/libs/smart-list/factories';

export default {
  title: 'Components/Cadences/CadenceNodes/TriggerCard',
  component: TriggerCard,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Trigger card component for cadence graph',
    },
  },
  argTypes: {
    trigger: {
      control: { type: 'object' },
      description: 'The connected trigger object.',
    },
    canBeDeleted: {
      control: { type: 'boolean' },
      description: 'Specifies whether the connected trigger can be deleted.',
      defaultValue: true,
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Specifies whether the connected trigger is disabled.',
    },
    isSelected: {
      control: { type: 'boolean' },
      description: 'Specifies whether the connected trigger is selected.',
    },
    changeConnectedTriggerKind: {
      action: 'changeConnectedTriggerKind',
      description: 'Function to change the connected trigger kind.',
    },
    getSmartlist: {
      action: 'getSmartlist',
      description: 'Function to get the associated smartlist from its id.',
    },
    onCardClick: {
      action: 'onCardClick',
      description: 'Handler function for when the card is clicked.',
    },
    onDelete: {
      action: 'onDelete',
      description: 'Handler function for trigger deletion.',
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
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof TriggerCard>;

const Template: ComponentStory<typeof TriggerCard> = (
  args: React.ComponentProps<typeof TriggerCard>,
) => <TriggerCard {...args} />;

const getSmartlist = (id: number) => smartlistFactory(id);

export const Event = Template.bind({});
Event.args = {
  trigger: triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER),
  onDelete: null,
  getSmartlist: getSmartlist,
};

export const EventWithDelete = Template.bind({});
EventWithDelete.args = {
  trigger: triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER),
  getSmartlist: getSmartlist,
};

export const Smartlist = Template.bind({});
Smartlist.args = {
  trigger: triggerFactory(TriggerKind.ONLY_SMARTLIST_FILTERING),
  onDelete: null,
  getSmartlist: getSmartlist,
};

export const SmartlistWithDelete = Template.bind({});
SmartlistWithDelete.args = {
  trigger: triggerFactory(TriggerKind.ONLY_SMARTLIST_FILTERING),
  getSmartlist: getSmartlist,
};

export const EventForSmartlist = Template.bind({});
EventForSmartlist.args = {
  trigger: triggerFactory(TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING),
  onDelete: null,
  getSmartlist: getSmartlist,
};

export const EventForSmartlistWithDelete = Template.bind({});
EventForSmartlistWithDelete.args = {
  trigger: triggerFactory(TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING),
  getSmartlist: getSmartlist,
};

export const Timeout = Template.bind({});
Timeout.args = {
  trigger: triggerFactory(TriggerKind.ONLY_TIMEOUT),
  onDelete: null,
  getSmartlist: getSmartlist,
};

export const TimeoutWithDelete = Template.bind({});
TimeoutWithDelete.args = {
  trigger: triggerFactory(TriggerKind.ONLY_TIMEOUT),
  getSmartlist: getSmartlist,
};
