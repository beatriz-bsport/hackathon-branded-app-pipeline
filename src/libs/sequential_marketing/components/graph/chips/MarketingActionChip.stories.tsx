import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MarketingActionChip, {
  MarketingActionChipProps,
} from './MarketingActionChip.component';
import { stepMarketingActionFactory } from '#libs/sequential_marketing/factories';
import {
  MarketingActionKind,
  MarketingActions,
} from '#libs/sequential_marketing/constants';
import { tagWithoutGroupListFactory } from '#libs/tag/factory';
import { companyEmailListFactory } from '#libs/email-editor/factories/EmailTemplateSummary';
import type { Tag } from '#libs/tag/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';

export default {
  title: 'Components/Cadences/Chips/MarketingActionChip',
  component: MarketingActionChip,
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
} as ComponentMeta<typeof MarketingActionChip>;

const Template: ComponentStory<typeof MarketingActionChip> = (
  args: MarketingActionChipProps,
) => <MarketingActionChip {...args} />;

const tagsList = tagWithoutGroupListFactory(4);
const tagsDict = tagsList.reduce<{ [key: string]: Tag }>((acc, tag) => {
  acc[tag.id.toString()] = tag;
  return acc;
}, {});
const getTag = (id: string) => tagsDict[id];

const emailTemplateSummaryList = companyEmailListFactory(1, 4);
const emailTemplateSummaryDict = emailTemplateSummaryList.reduce<{
  [key: string]: EmailTemplateSummary;
}>((acc, template) => {
  acc[template.id.toString()] = template;
  return acc;
}, {});
const getEmailTemplate = (id: string) => emailTemplateSummaryDict[id];

export const TagChip = Template.bind({});
TagChip.args = {
  marketingAction: stepMarketingActionFactory({
    kind: MarketingActionKind.TAG,
    tag_id: tagsList[1].id,
  }),
  getTag: getTag,
};

export const Email = Template.bind({});
Email.args = {
  marketingAction: stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  }),
};

export const Sms = Template.bind({});
Sms.args = {
  marketingAction: stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
  }),
};

export const PushNotif = Template.bind({});
PushNotif.args = {
  marketingAction: stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind:
      MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  }),
};

export const TemplateEmail = Template.bind({});
TemplateEmail.args = {
  marketingAction: stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind:
      MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
    email_design: emailTemplateSummaryList[1].id,
  }),
  getEmailTemplate: getEmailTemplate,
};
