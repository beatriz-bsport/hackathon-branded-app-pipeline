import React from 'react';

import MemberMinimalFactory from '#src/libs/member/factories/MemberMinimal';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { AccessControlSnackBarContent, AccessControlSnackBarProps } from '.';

AccessControlSnackBarContent.displayName = 'AccessControlSnackBar';

const ActionData = {
  handleClose: action('handleClose'),
  handleOpen: action('handleOpen'),
};

const member = MemberMinimalFactory();

const AccessControlSnackBarContentTemplate: ComponentStory<
  typeof AccessControlSnackBarContent
> = (args: AccessControlSnackBarProps) => {
  return <AccessControlSnackBarContent {...args} />;
};

const defaultArgs = {
  accessStatus: 'G',
  member,
  handleClose: ActionData.handleClose,
  handleOpen: ActionData.handleOpen,
};

export const Valid = AccessControlSnackBarContentTemplate.bind({});
Valid.args = {
  ...defaultArgs,
};

export const Warning = AccessControlSnackBarContentTemplate.bind({});
Warning.args = {
  ...defaultArgs,
  accessStatus: 'O',
};

export const Invalid = AccessControlSnackBarContentTemplate.bind({});
Invalid.args = {
  ...defaultArgs,
  accessStatus: 'R',
};

export default {
  title: 'Library/AccessControl/AccessControlSnackBar',
  component: AccessControlSnackBarContent,
  argTypes: {
    handleClose: {
      description: 'Function to handle closing the snackbar',
      action: 'handleClose',
    },
    handleOpen: {
      description:
        "Function to handle opening the member visit's dedicated page",
      action: 'handleOpen',
    },
    accessStatus: {
      description: 'The access status of the member',
      control: {
        type: 'select',
        options: ['G', 'R', 'O'],
      },
    },
    member: {
      description: 'The member to display in the snackbar',
      control: {
        type: 'object',
      },
    },
  },
} as ComponentMeta<typeof AccessControlSnackBarContent>;
