import React, { ChangeEvent, useState, useCallback } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import ChangePasswordForm, { ChangePasswordFormStorybook } from '.';
import { Props } from './ChangePasswordForm.component';

import './styles-storybook.css';

const PASSWORD = faker.internet.password();
const ERROR = faker.lorem.words(6);

const ChangePasswordFormTemplate: ComponentStory<
  typeof ChangePasswordFormStorybook
> = (args) => {
  const [password1, setPassword1] = useState(args.password1);
  const [password2, setPassword2] = useState(args.password2);

  const updatePassword1 = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword1(event.target.value);
    },
    [],
  );

  const updatePassword2 = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPassword2(event.target.value);
    },
    [],
  );

  return (
    <ChangePasswordFormStorybook
      {...args}
      password1={password1}
      handlePassword1Change={updatePassword1}
      password2={password2}
      handlePassword2Change={updatePassword2}
    />
  );
};

const baseArgs: Omit<Props, 'handlePassword1Change' | 'handlePassword2Change'> =
  {
    companyTheme: null,
    franchisor: null,
    membership: null,
    franchisorId: null,
    simplifyUI: null,
    processing: false,
    hasExpired: false,
    error: null,
    password1: PASSWORD,
    password2: PASSWORD,
    requestResetLink: () => {},
    onSubmit: (event) => {
      event.preventDefault();
      return null;
    },
  };

export const Emptyform = ChangePasswordFormTemplate.bind({});
Emptyform.args = { ...baseArgs, password1: '', password2: '' };

export const Filledform = ChangePasswordFormTemplate.bind({});
Filledform.args = baseArgs;

export const Errorform = ChangePasswordFormTemplate.bind({});
Errorform.args = {
  ...baseArgs,
  error: ERROR,
};

export default {
  title: 'Components/CssOnly/ChangePasswordForm',
  component: ChangePasswordForm,
  argTypes: {
    companyTheme: {
      description: 'The current company theme',
    },
    franchisor: {
      description:
        'The franchisee object. If any is passed, we will use the theme of it.',
    },
    membership: {
      description: 'Company identifier passed in the submit request',
    },
    franchisorId: {
      description: 'Franchisee identifier passed in the submit request',
    },
    simplifyUI: {
      description:
        'Conditional if the user has the new checkout flow enabled or disabled bubbles background for his company',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    processing: {
      description: 'Whether the form is in loading state',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    hasExpired: {
      description:
        'Condition whether the link provided to change the password is expired or not',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    password1: {
      description: 'The password input value',
    },
    password2: {
      description: 'The password confirmation input value',
    },
    error: {
      description: 'Error returned by the form submit action',
      control: {
        type: 'text',
      },
    },
    requestResetLink: {
      description:
        'The action to perform when link is expired and user is requesting a new link',
    },
    onSubmit: {
      description: 'The action to perform when the form is submitted',
    },
  },
} as ComponentMeta<typeof ChangePasswordForm>;
