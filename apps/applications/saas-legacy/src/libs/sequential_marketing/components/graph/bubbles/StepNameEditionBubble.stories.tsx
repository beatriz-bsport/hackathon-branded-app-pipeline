import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import omit from 'lodash/omit';

import StepNameEditionBubble from './StepNameEditionBubble.component';
import { cadenceStepFactory } from '#src/libs/sequential_marketing/factories';

export default {
  title: 'Components/Cadences/Bubbles/StepNameEdition',
  component: StepNameEditionBubble,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Bubble for step name edition form in Audience.',
    },
  },
  argTypes: {
    onCancel: {
      action: 'onCancelClicked',
      description: 'Cancel button',
    },
    onConfirm: {
      action: 'onConfirmClicked',
      description: 'Confirm button',
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
} as ComponentMeta<typeof StepNameEditionBubble>;

const Template: ComponentStory<typeof StepNameEditionBubble> = (
  args: React.ComponentProps<typeof StepNameEditionBubble>,
) => <StepNameEditionBubble {...args} />;

export const NoProps = Template.bind({});

export const WithStep = Template.bind({});
WithStep.args = {
  step: { ...omit(cadenceStepFactory({}), ['exits']) },
};
