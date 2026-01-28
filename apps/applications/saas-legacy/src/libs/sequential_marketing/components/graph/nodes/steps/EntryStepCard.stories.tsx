import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import EntryStepCard, { EntryStepCardProps } from './EntryStepCard.component';
import {
  MarketingActionKind,
  MarketingActions,
  TriggerKind,
} from '#src/libs/sequential_marketing/constants';
import {
  triggerFactory,
  triggerBatchFactory,
  stepMarketingActionFactory,
} from '#src/libs/sequential_marketing/factories';
import { tagWithoutGroupFactory } from '#src/libs/tag/factory';
import { companyEmailListFactory } from '#src/libs/email-editor/factories/EmailTemplateSummary';

export default {
  title: 'Components/Cadences/CadenceNodes/EntryStep',
  component: EntryStepCard,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Entry step card component for cadence graph',
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
} as ComponentMeta<typeof EntryStepCard>;

const EntryStepCardTemplate: ComponentStory<typeof EntryStepCard> = (
  args: EntryStepCardProps,
) => <EntryStepCard {...args} />;

const eventTrigger = triggerFactory(TriggerKind.ONLY_EVENT_TRIGGER);

const emailMarketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.COMMUNICATION,
  communication_kind: MarketingActions.WRITTEN_EMAIL,
});

const marketingActionList = [
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.WRITTEN_EMAIL,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.SMS,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.PUSH_NOTIFICATION,
  }),
];

const tag = tagWithoutGroupFactory();
const getTag = (_id: string) => tag;

const emailTemplateSummary = companyEmailListFactory(1, 1)[0];
const getEmailTemplate = (_id: string) => emailTemplateSummary;

const marketingActionFullList = [
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.WRITTEN_EMAIL,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.SMS,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.PUSH_NOTIFICATION,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.EMAIL_TEMPLATE,
    email_design: emailTemplateSummary.id,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.TAG,
    tag_id: tag.id,
  }),
];

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
  marketingActionList: [emailMarketingAction],
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
  marketingActionList: [emailMarketingAction],
  addMarketingAction: () => {},
  getSmartlist: getSmartlist,
};

export const Full = EntryStepCardTemplate.bind({});
Full.args = {
  triggerList: triggerBatchFactory(2),
  getSmartlist: getSmartlist,
  marketingActionList: marketingActionFullList,
  addMarketingAction: () => {},
  getTag: getTag,
  getEmailTemplate: getEmailTemplate,
};

export const FullWithAddStep = EntryStepCardTemplate.bind({});
FullWithAddStep.args = {
  triggerList: triggerBatchFactory(2),
  marketingActionList: marketingActionList,
  addMarketingAction: () => {},
  getSmartlist: getSmartlist,
  addNextStep: () => {},
};
