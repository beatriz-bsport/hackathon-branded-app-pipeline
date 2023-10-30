import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import EntryActionBubble from './EntryActionBubble.component';
import EmailTemplateSummaryFactoryBot from '#libs/email-editor/factories/EmailTemplateSummary';
import { tagListFactory } from '#libs/tag/factory';
import { stepMarketingActionBatchFactory } from '#libs/sequential_marketing/factories';

export default {
  title: 'Components/Cadences/Bubbles/EntryAction',
  component: EntryActionBubble,
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
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Bubble for entry step form',
    },
  },
  argTypes: {
    onClose: {
      action: 'onCloseClicked',
      description: 'Cancel button',
    },
    onConfirm: {
      action: 'onConfirmClicked',
      description: 'Confirm button',
    },
  },
} as ComponentMeta<typeof EntryActionBubble>;

const Template: ComponentStory<typeof EntryActionBubble> = (
  args: React.ComponentProps<typeof EntryActionBubble>,
) => <EntryActionBubble {...args} />;

const fakeTagCategories = {
  User: ['1', '2'],
  Company: ['3', '4', '5'],
};

export const Creation = Template.bind({});
Creation.args = {
  isInitial: true,
  tagCategories: fakeTagCategories,
  tagList: tagListFactory(faker.number.int({ min: 2, max: 10 })),
  emailSummaryList: EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(
    faker.number.int({ min: 2, max: 10 }),
  ),
};

export const Edition = Template.bind({});
Edition.args = {
  marketingActions: stepMarketingActionBatchFactory(3),
  tagCategories: fakeTagCategories,
  tagList: tagListFactory(faker.number.int({ min: 2, max: 10 })),
  emailSummaryList: EmailTemplateSummaryFactoryBot.EmailTemplateSummary.create(
    faker.number.int({ min: 2, max: 10 }),
  ),
};
