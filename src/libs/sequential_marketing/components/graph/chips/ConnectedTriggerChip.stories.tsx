import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ConnectedTriggerChip, {
  ConnectedTriggerChipProps,
} from './ConnectedTriggerChip.component';
import {
  TriggerKind,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import { triggerFactory } from '#libs/sequential_marketing/factories';
import { smartlistFactory } from '#libs/smart-list/factories';

export default {
  title: 'Components/Cadences/Chips/TriggerChips',
  component: ConnectedTriggerChip,
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'This component is a ConnectedTrigger chip used in sequential marketing.',
      },
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
} as ComponentMeta<typeof ConnectedTriggerChip>;

const smartlist = {
  id: 53,
  company: 22,
  name: 'La Smartlist',
  description: 'Ceci est une smartlist',
  members: [353, 398],
  member_base: 0,
};

const getSmartlist = (id: number) => smartlistFactory(id);

const Template: ComponentStory<typeof ConnectedTriggerChip> = (
  args: ConnectedTriggerChipProps,
) => <ConnectedTriggerChip {...args} />;

export const Event = Template.bind({});
Event.args = {
  trigger: triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER),
  color: SequentialMarketingColors.ENTRY_COLOR,
  getSmartlist: getSmartlist,
};

export const Timeout = Template.bind({});
Timeout.args = {
  trigger: triggerFactory(TriggerKind.ONLY_TIMEOUT),
  color: SequentialMarketingColors.ENTRY_COLOR,
  getSmartlist: getSmartlist,
};

export const Smartlist = Template.bind({});
Smartlist.args = {
  trigger: triggerFactory(TriggerKind.ONLY_SMARTLIST_FILTERING, smartlist.id),
  smartlist: smartlist,
  color: SequentialMarketingColors.ENTRY_COLOR,
  getSmartlist: getSmartlist,
};

export const EventForSmartlist = Template.bind({});
EventForSmartlist.args = {
  trigger: triggerFactory(
    TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING,
    smartlist.id,
  ),
  smartlist: smartlist,
  color: SequentialMarketingColors.ENTRY_COLOR,
  getSmartlist: getSmartlist,
};
