import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import MarketingActionBubble, {
  Props,
} from './MarketingActionBubble.component';

export default {
  title: 'Components/Cadences/Bubbles/MarketingAction',
  component: MarketingActionBubble,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Bubble for marketing actions form used in cadences.',
    },
  },
  argTypes: {
    marketingActions: { control: 'object', defaultValue: [] },
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
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof MarketingActionBubble>;

const Template: ComponentStory<typeof MarketingActionBubble> = (
  args: Props,
) => <MarketingActionBubble {...args} />;

export const Primary = Template.bind({});
