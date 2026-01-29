import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import type { StepMarketingActions } from '#src/libs/sequential_marketing/types';

import UniqueMarketingActionBubble from './UniqueMarketingActionBubble.component';
import EmailTemplateSummaryFactoryBot from '#src/libs/email-editor/factories/EmailTemplateSummary';

import { getMarketingActionPartialValues } from '#src/libs/sequential_marketing/components/form/marketing_actions/utils';
import { stepMarketingActionFactory } from '#src/libs/sequential_marketing/factories';
import { tagListFactory } from '#src/libs/tag/factory';
import {
  MarketingActionKind,
  MarketingActions,
} from '#src/libs/sequential_marketing/constants';

export default {
  title: 'Components/Cadences/Bubbles/UniqueMarketingAction',
  component: UniqueMarketingActionBubble,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Bubble to create or edit one marketing action, used in cadences.',
    },
  },
  argTypes: {
    marketingActions: { control: 'object', defaultValue: null },
    emailListLoading: { control: 'boolean' },
    emailDetailLoading: { control: 'boolean' },
    emails: { control: 'object', defaultValue: [] },
    tagList: { control: 'object', defaultValue: [] },
    onCancel: {
      action: 'onCancelClicked',
      description: 'Cancel button',
    },
    onConfirm: {
      action: 'onConfirmClicked',
      description: 'Confirm button',
    },
    onDelete: {
      action: 'onDeleteClicked',
      description: 'Delete button',
    },
    fetchEmailTemplateDetail: {
      action: 'fetchEmailTemplateDetail',
      description: 'Email template fetch',
    },
    getEmailTemplate: {
      action: 'getEmailTemplate',
      description: 'Email template get',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '2%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof UniqueMarketingActionBubble>;

const Template: ComponentStory<typeof UniqueMarketingActionBubble> = (
  args: React.ComponentProps<typeof UniqueMarketingActionBubble>,
) => <UniqueMarketingActionBubble {...args} />;

const fakeTagCategories = {
  User: ['1', '2'],
  Company: ['3', '4', '5'],
};

let marketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.COMMUNICATION,
});

const updateMarketingAction = (action: StepMarketingActions) => {
  marketingAction = action;
};

export const Edition = Template.bind({});
Edition.args = {
  marketingAction: marketingAction,
  tagCategories: fakeTagCategories,
  submit: updateMarketingAction,
};

export const SmsCreation = Template.bind({});
SmsCreation.args = {
  marketingAction: getMarketingActionPartialValues(MarketingActions.SMS),
  tagCategories: fakeTagCategories,
  submit: updateMarketingAction,
};

export const WrittenEmailCreation = Template.bind({});
WrittenEmailCreation.args = {
  marketingAction: getMarketingActionPartialValues(
    MarketingActions.WRITTEN_EMAIL,
  ),
  tagCategories: fakeTagCategories,
  submit: updateMarketingAction,
};

export const TemplateEmailCreation = Template.bind({});
TemplateEmailCreation.args = {
  marketingAction: getMarketingActionPartialValues(
    MarketingActions.EMAIL_TEMPLATE,
  ),
  tagCategories: fakeTagCategories,
  emailSummaryList: EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(
    faker.number.int({ min: 2, max: 10 }),
  ),
  submit: updateMarketingAction,
};

export const PushNotifCreation = Template.bind({});
PushNotifCreation.args = {
  marketingAction: getMarketingActionPartialValues(
    MarketingActions.PUSH_NOTIFICATION,
  ),
  tagCategories: fakeTagCategories,
  submit: updateMarketingAction,
};

export const TagCreation = Template.bind({});
TagCreation.args = {
  marketingAction: getMarketingActionPartialValues(MarketingActions.ADD_TAG),
  tagList: tagListFactory(faker.number.int({ min: 2, max: 10 })),
  submit: updateMarketingAction,
};
