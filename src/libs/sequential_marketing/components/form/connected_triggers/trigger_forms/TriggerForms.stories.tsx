import React from 'react';
import Immutable from 'seamless-immutable';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SmartlistForm from './SmartlistForm.component';
import EventForm from './EventForm.component';
import EventAndSmartlistForm from './EventAndSmartlistForm.component';
import TimeoutForm from './TimeoutForm.component';
import LostTriggerTimeoutForm from './LostTriggerTimeoutForm.component';
import { smartlistBatchFactory } from '#src/libs/smart-list/factories';

const smartlists = smartlistBatchFactory(5);

export default {
  title: 'Components/Cadences/Forms/ConnectedTrigger',
  component: SmartlistForm,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Connected trigger forms for Audience',
    },
  },
  argTypes: {
    trigger: {
      control: { type: 'object' },
      description: 'Connected trigger associated with the form.',
    },
    updateValue: {
      action: 'UpdateValueAction',
      description: 'Action initiated to update the connected trigger value.',
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '400px',
            width: '100%',
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof SmartlistForm>;

const SmartlistTemplate: ComponentStory<typeof SmartlistForm> = (
  args: React.ComponentProps<typeof SmartlistForm>,
) => <SmartlistForm {...args} />;

export const Smartlist = SmartlistTemplate.bind({});
Smartlist.args = { smartlists: Immutable(smartlists) };

const TimeoutTemplate: ComponentStory<typeof TimeoutForm> = (
  args: React.ComponentProps<typeof TimeoutForm>,
) => <TimeoutForm {...args} />;

export const Timeout = TimeoutTemplate.bind({});

const EventAndSmartlistTemplate: ComponentStory<
  typeof EventAndSmartlistForm
> = (args: React.ComponentProps<typeof EventAndSmartlistForm>) => (
  <EventAndSmartlistForm {...args} />
);

export const EventAndSmartlist = EventAndSmartlistTemplate.bind({});
EventAndSmartlist.args = { smartlists: Immutable(smartlists) };

const EventTemplate: ComponentStory<typeof EventForm> = (
  args: React.ComponentProps<typeof EventForm>,
) => <EventForm {...args} />;

export const Event = EventTemplate.bind({});

const LostTriggerTimeoutTemplate: ComponentStory<
  typeof LostTriggerTimeoutForm
> = (args: React.ComponentProps<typeof LostTriggerTimeoutForm>) => (
  <LostTriggerTimeoutForm {...args} />
);

export const LostTriggerTimeout = LostTriggerTimeoutTemplate.bind({});
