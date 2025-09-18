import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import NotificationForm, {
  Props as NotificationFormProps,
} from './NotificationForm';
import SmsForm, { Props as SmsFormProps } from './SMS/SmsForm';
import TagForm, { Props as TagFormProps } from './TagForm';
import TemplateEmailForm, {
  Props as TemplateEmailFormProps,
} from './TemplateEmailForm';
import WrittenEmailForm, {
  Props as WrittenEmailFormProps,
} from './WrittenEmailForm';

import {
  MarketingActionKind,
  MarketingActions,
} from '#src/libs/sequential_marketing/constants';
import type { StepMarketingActions } from '#src/libs/sequential_marketing/types';
import { stepMarketingActionFactory } from '#src/libs/sequential_marketing/factories';
import { tagListFactory } from '#src/libs/tag/factory';
import EmailTemplateDetailSummaryListsFactory from '#src/libs/email-editor/factories/Emails';

const fakeTagCategories = {
  User: ['1', '2'],
  Company: ['3', '4', '5'],
};

export default {
  title: 'Components/Cadences/Forms/Communication',
  component: NotificationForm,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Marketing action forms for Audience',
    },
  },
  argTypes: {
    getEmailDetail: {
      action: 'getEmailDetail',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          marginRight: '15em',
          marginLeft: '15em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof NotificationForm>;

const [emailTemplateDetailList, emailTemplateSummaryList] =
  EmailTemplateDetailSummaryListsFactory(6);

// NOTIFICATIONS PUSH

const NotificationTemplate: ComponentStory<typeof NotificationForm> = (
  args: NotificationFormProps,
) => (
  <div>
    <NotificationForm {...args} />
  </div>
);

let notification = stepMarketingActionFactory({
  communication_kind:
    MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  kind: MarketingActionKind.COMMUNICATION,
});

const updateNotification = (action: StepMarketingActions) => {
  notification = action;
};

export const Notification = NotificationTemplate.bind({});
Notification.args = {
  marketingAction: notification,
  tagCategories: fakeTagCategories,
  submit: updateNotification,
};

// SMS

const SmsTemplate: ComponentStory<typeof SmsForm> = (args: SmsFormProps) => (
  <SmsForm {...args} />
);

let sms = stepMarketingActionFactory({
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
  kind: MarketingActionKind.COMMUNICATION,
});

const updateSms = (action: StepMarketingActions) => {
  sms = action;
};

export const Sms = SmsTemplate.bind({});
Sms.args = {
  marketingAction: sms,
  tagCategories: fakeTagCategories,
  submit: updateSms,
};

// TAG

const TagTemplate: ComponentStory<typeof TagForm> = (args: TagFormProps) => (
  <TagForm {...args} />
);

let tag = stepMarketingActionFactory({
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  kind: MarketingActionKind.TAG,
});

const updateTag = (action: StepMarketingActions) => {
  tag = action;
};

export const Tag = TagTemplate.bind({});
Tag.args = {
  marketingAction: tag,
  tagList: tagListFactory(4),
  submit: updateTag,
};

// EMAIL TEMPLATE

const TemplateEmailTemplate: ComponentStory<typeof TemplateEmailForm> = (
  args: TemplateEmailFormProps,
) => <TemplateEmailForm {...args} />;

let templateEmail = stepMarketingActionFactory({
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  kind: MarketingActionKind.COMMUNICATION,
});

const updateTemplateEmail = (action: StepMarketingActions) => {
  templateEmail = action;
};

export const TemplateEmail = TemplateEmailTemplate.bind({});
TemplateEmail.args = {
  marketingAction: templateEmail,
  emailDetailList: emailTemplateDetailList,
  emailDetailListLoading: false,
  emailSummaryList: emailTemplateSummaryList,
  emailSummaryListLoading: false,
  submit: updateTemplateEmail,
};

// WRITTEN EMAIL

const WrittenEmailTemplate: ComponentStory<typeof WrittenEmailForm> = (
  args: WrittenEmailFormProps,
) => (
  <div>
    <WrittenEmailForm {...args} />
  </div>
);

let writtenEmail = stepMarketingActionFactory({
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  kind: MarketingActionKind.COMMUNICATION,
});

const updateWrittenEmail = (action: StepMarketingActions) => {
  writtenEmail = action;
};

export const WrittenEmail = WrittenEmailTemplate.bind({});
WrittenEmail.args = {
  marketingAction: writtenEmail,
  tagCategories: fakeTagCategories,
  submit: updateWrittenEmail,
};
