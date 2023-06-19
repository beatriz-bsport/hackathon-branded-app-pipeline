import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EntryStepCard, { EntryStepCardProps } from './EntryStepCard.component';
import { TriggerKind } from '#libs/sequential_marketing/constants';
import {
  triggerFactory,
  triggerBatchFactory,
} from '#libs/sequential_marketing/factories';

export default {
  title: 'Components/Cadences/CadenceNodes/EntryStep',
  component: EntryStepCard,
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
} as ComponentMeta<typeof EntryStepCard>;

const EntryStepCardTemplate: ComponentStory<typeof EntryStepCard> = (
  args: EntryStepCardProps,
) => <EntryStepCard {...args} />;

const eventTrigger = triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER);

const getSmartlist = (id: number) => {
  return {
    id: id,
    company: 22,
    name: `Smartlist n°${id}`,
    description: 'Ceci est une smartlist',
    members: [353, 398],
    member_base: 0,
  };
};

export const Empty = EntryStepCardTemplate.bind({});

export const WithTrigger = EntryStepCardTemplate.bind({});
WithTrigger.args = {
  triggerList: [eventTrigger],
  getSmartlist: getSmartlist,
};

export const WithMultipleTriggers = EntryStepCardTemplate.bind({});
WithMultipleTriggers.args = {
  triggerList: triggerBatchFactory(6),
  getSmartlist: getSmartlist,
};

export const TriggerAndMarketingAction = EntryStepCardTemplate.bind({});
TriggerAndMarketingAction.args = {
  triggerList: [eventTrigger],
  marketingActionChipList: [{ name: '{ Email object }', icon: 'Email' }],
  getSmartlist: getSmartlist,
};

export const TriggerAndAddAction = EntryStepCardTemplate.bind({});
TriggerAndAddAction.args = {
  triggerList: [eventTrigger],
  addMarketingAction: () => {},
  getSmartlist: getSmartlist,
};

export const All = EntryStepCardTemplate.bind({});
All.args = {
  triggerList: [eventTrigger],
  marketingActionChipList: [{ name: '{ Email object }', icon: 'Email' }],
  addMarketingAction: () => {},
  getSmartlist: getSmartlist,
};

export const Full = EntryStepCardTemplate.bind({});
Full.args = {
  triggerList: triggerBatchFactory(2),
  marketingActionChipList: [
    { name: '{ Email object }', icon: 'Email' },
    { name: '{ Notification title... }', icon: 'Notifications' },
    { name: '{ Message preview... }', icon: 'Textsms' },
  ],
  addMarketingAction: () => {},
  getSmartlist: getSmartlist,
};
