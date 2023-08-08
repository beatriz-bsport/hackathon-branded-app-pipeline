import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import NotificationForm, {
  Props as NotificationFormProps,
} from './NotificationForm';
import SmsForm, { Props as SmsFormProps } from './SmsForm';
import TagForm, { Props as TagFormProps } from './TagForm';
import TemplateEmailForm, {
  Props as TemplateEmailFormProps,
} from './TemplateEmailForm';
import WrittenEmailForm, {
  Props as WrittenEmailFormProps,
} from './WrittenEmailForm';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import { stepMarketingActionFactory } from '#libs/sequential_marketing/factories';
import { tagListFactory } from '#libs/tag/factory';
import EmailTemplateDetailSummaryListsFactory from '#libs/email-editor/factories/Emails';

const fakeTagCategories = {
  User: ['1', '2'],
  Company: ['3', '4', '5'],
};

export default {
  title: 'Components/Cadences/Communication/Forms',
  component: NotificationForm,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Forms for cadences',
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

let marketingAction = stepMarketingActionFactory({});

const updateMarketingAction = (action: StepMarketingActions) => {
  marketingAction = action;
};

const [emailTemplateDetailList, emailTemplateSummaryList] =
  EmailTemplateDetailSummaryListsFactory(6);

const NotificationTemplate: ComponentStory<typeof NotificationForm> = (
  args: NotificationFormProps,
) => (
  <div>
    <NotificationForm {...args} />
  </div>
);

export const Notification = NotificationTemplate.bind({});
Notification.args = {
  marketingAction: marketingAction,
  tagCategories: fakeTagCategories,
  submit: updateMarketingAction,
};

const SmsTemplate: ComponentStory<typeof SmsForm> = (args: SmsFormProps) => (
  <div>
    <SmsForm {...args} />
  </div>
);

export const Sms = SmsTemplate.bind({});
Sms.args = {
  marketingAction: marketingAction,
  tagCategories: fakeTagCategories,
  submit: updateMarketingAction,
};

const TagTemplate: ComponentStory<typeof TagForm> = (args: TagFormProps) => (
  <TagForm {...args} />
);

export const Tag = TagTemplate.bind({});
Tag.args = {
  marketingAction: marketingAction,
  tagList: tagListFactory(4),
  submit: updateMarketingAction,
};

const TemplateEmailTemplate: ComponentStory<typeof TemplateEmailForm> = (
  args: TemplateEmailFormProps,
) => <TemplateEmailForm {...args} />;

export const TemplateEmail = TemplateEmailTemplate.bind({});
TemplateEmail.args = {
  marketingAction: marketingAction,
  emailDetailList: emailTemplateDetailList,
  emailDetailListLoading: false,
  emailSummaryList: emailTemplateSummaryList,
  emailSummaryListLoading: false,
  submit: updateMarketingAction,
};

const WrittenEmailTemplate: ComponentStory<typeof WrittenEmailForm> = (
  args: WrittenEmailFormProps,
) => (
  <div>
    <WrittenEmailForm {...args} />
  </div>
);

export const WrittenEmail = WrittenEmailTemplate.bind({});
WrittenEmail.args = {
  marketingAction: marketingAction,
  tagCategories: fakeTagCategories,
  submit: updateMarketingAction,
};
