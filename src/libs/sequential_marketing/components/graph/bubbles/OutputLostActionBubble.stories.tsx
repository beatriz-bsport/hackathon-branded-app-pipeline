import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import OutputLostActionBubble from './OutputLostActionBubble.component';
import EmailTemplateSummaryFactoryBot from '#libs/email-editor/factories/EmailTemplateSummary';
import { tagListFactory } from '#libs/tag/factory';
import { stepMarketingActionBatchFactory } from '#libs/sequential_marketing/factories';
import { MarketingActionArgTypes } from '#libs/sequential_marketing/constants/marketing_actions';

export default {
  title: 'Components/Cadences/Bubbles/LostAction',
  component: OutputLostActionBubble,
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
      component: 'Bubble for lost output marketing action form',
    },
  },
  argTypes: {
    ...MarketingActionArgTypes,
    onClose: {
      action: 'onCloseClicked',
      description: 'Close button',
    },
    onConfirm: {
      action: 'onConfirmClicked',
      description: 'Confirm button',
    },
    isInitial: {
      description:
        'Indicates whether the workflow is in its initial state. True if it has not been initialized yet, signifying the first configuration.',
      control: { type: 'boolean' },
    },
    marketingActions: {
      description:
        'List of marketing actions associated with the "LOST" output in the workflow.',
      control: { type: 'object' },
    },
  },
} as ComponentMeta<typeof OutputLostActionBubble>;

const Template: ComponentStory<typeof OutputLostActionBubble> = (
  args: React.ComponentProps<typeof OutputLostActionBubble>,
) => <OutputLostActionBubble {...args} />;

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
