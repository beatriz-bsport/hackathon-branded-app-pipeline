import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ResetPasswordConfirmationStorybook } from '.';

const ResetPasswordConfirmationTemplate: ComponentStory<
  typeof ResetPasswordConfirmationStorybook
> = (args) => (
  <ResetPasswordConfirmationStorybook {...args}>
    {args.children}
  </ResetPasswordConfirmationStorybook>
);

const actionData = {
  handlePageExit: action('handlePageExit'),
};

export const ResetPasswordConfirmation = ResetPasswordConfirmationTemplate.bind(
  {},
);
ResetPasswordConfirmation.args = {
  handlePageExit: actionData.handlePageExit,
};

export default {
  title: 'Components/Login/ResetPasswordConfirmation',
  component: ResetPasswordConfirmationStorybook,
  argTypes: {
    handlePageExit: {
      action: 'clicked',
      description: 'redirect to given url.',
    },
  },
} as ComponentMeta<typeof ResetPasswordConfirmationStorybook>;
