import React from 'react';
import Immutable from 'seamless-immutable';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UniqueTriggerBubble, {
  type Props,
} from './UniqueTriggerBubble.component';
import { triggerFactory } from '#libs/sequential_marketing/factories';
import { smartlistBatchFactory } from '#libs/smart-list/factories';
import { TriggerKind } from '#libs/sequential_marketing/constants';

export default {
  title: 'Components/Cadences/Bubbles/UniqueConnectedTrigger',
  component: UniqueTriggerBubble,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Bubble for the connected trigger form used in cadences.',
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
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof UniqueTriggerBubble>;

const Template: ComponentStory<typeof UniqueTriggerBubble> = (args: Props) => (
  <UniqueTriggerBubble {...args} />
);

export const Random = Template.bind({});
Random.args = {
  trigger: triggerFactory(),
  smartlists: Immutable(smartlistBatchFactory(5)),
};

export const Event = Template.bind({});
Event.args = {
  trigger: triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER),
  smartlists: Immutable(smartlistBatchFactory(5)),
};

export const Smartlist = Template.bind({});
Smartlist.args = {
  trigger: triggerFactory(TriggerKind.ONLY_SMARTLIST_FILTERING),
  smartlists: Immutable(smartlistBatchFactory(5)),
};

export const EventAndSmartlist = Template.bind({});
EventAndSmartlist.args = {
  trigger: triggerFactory(TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING),
  smartlists: Immutable(smartlistBatchFactory(5)),
};

export const Timeout = Template.bind({});
Timeout.args = {
  trigger: triggerFactory(TriggerKind.ONLY_TIMEOUT),
  smartlists: Immutable(smartlistBatchFactory(5)),
};
