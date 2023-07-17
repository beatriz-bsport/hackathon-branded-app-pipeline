import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import TriggerCard, { TriggerCardProps } from './TriggerCard.component';
import { TriggerKind } from '#libs/sequential_marketing/constants';
import { triggerFactory } from '#libs/sequential_marketing/factories';
import { smartlistFactory } from '#libs/smart-list/factories';

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
  args: TriggerCardProps,
) => <TriggerCard {...args} />;

const getSmartlist = (id: number) => smartlistFactory(id);

export const Event = Template.bind({});
Event.args = {
  trigger: triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER),
  getSmartlist: getSmartlist,
};

export const EventWithDelete = Template.bind({});
EventWithDelete.args = {
  trigger: triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER),
  onDelete: () => {},
  getSmartlist: getSmartlist,
};

export const Smartlist = Template.bind({});
Smartlist.args = {
  trigger: triggerFactory(TriggerKind.ONLY_SMARTLIST_FILTERING),
  getSmartlist: getSmartlist,
};

export const SmartlistWithDelete = Template.bind({});
SmartlistWithDelete.args = {
  trigger: triggerFactory(TriggerKind.ONLY_SMARTLIST_FILTERING),
  onDelete: () => {},
  getSmartlist: getSmartlist,
};

export const EventForSmartlist = Template.bind({});
EventForSmartlist.args = {
  trigger: triggerFactory(TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING),
  getSmartlist: getSmartlist,
};

export const EventForSmartlistWithDelete = Template.bind({});
EventForSmartlistWithDelete.args = {
  trigger: triggerFactory(TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING),
  getSmartlist: getSmartlist,
  onDelete: () => {},
};

export const Timeout = Template.bind({});
Timeout.args = {
  trigger: triggerFactory(TriggerKind.ONLY_TIMEOUT),
  getSmartlist: getSmartlist,
};

export const TimeoutWithDelete = Template.bind({});
TimeoutWithDelete.args = {
  trigger: triggerFactory(TriggerKind.ONLY_TIMEOUT),
  onDelete: () => {},
  getSmartlist: getSmartlist,
};
