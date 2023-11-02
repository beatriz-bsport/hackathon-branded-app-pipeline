import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import StepEditionBubble from './StepEditionBubble.component';
import { cadenceStepFactory } from '#libs/sequential_marketing/factories';

export default {
  title: 'Components/Cadences/Bubbles/StepEdition',
  component: StepEditionBubble,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Bubble for step edition form in cadences.',
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
} as ComponentMeta<typeof StepEditionBubble>;

const Template: ComponentStory<typeof StepEditionBubble> = (
  args: React.ComponentProps<typeof StepEditionBubble>,
) => <StepEditionBubble {...args} />;

export const NoProps = Template.bind({});

export const WithStep = Template.bind({});
WithStep.args = {
  step: cadenceStepFactory({}),
};
