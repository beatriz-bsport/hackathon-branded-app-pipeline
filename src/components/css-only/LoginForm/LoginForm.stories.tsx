import React, { useState, useEffect, useCallback } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import LoginForm, { LoginFormStorybook } from '.';
import { Props } from './LoginForm.component';

const LoginFormTemplate: ComponentStory<typeof LoginFormStorybook> = (args) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!email && args.email) {
      setEmail(args.email);
    }
    if (!password && args.password) {
      setPassword(args.password);
    }
  }, [args.email, args.password]);

  const handleChangeField = useCallback(
    (id: 'email' | 'password') => (value: string) => {
      if (id === 'email') {
        setEmail(value);
      } else if (id === 'password') {
        setPassword(value);
      }
    },
    [],
  );

  return (
    <LoginFormStorybook
      {...args}
      email={email}
      password={password}
      onChangeField={handleChangeField}
    />
  );
};

const baseArgs: Omit<Props, 'onChangeField'> = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  emailChoices: undefined,
  hasError: false,
  isLoading: false,
  errorMessage: faker.lorem.sentence(),
  hasFranchisor: false,
  hasCompany: false,
  simplifyUI: false,
  requestResetPassword: () => {},
  onOpenIntercomHelp: () => {},
  onSubmit: () => {},
};

export const Emptyform = LoginFormTemplate.bind({});
Emptyform.args = { ...baseArgs, email: '', password: '' };

export const Emailchoicesform = LoginFormTemplate.bind({});
Emailchoicesform.args = {
  ...baseArgs,
  emailChoices: faker.helpers.multiple(() => faker.internet.email(), {
    count: 3,
  }),
};

export const Filledform = LoginFormTemplate.bind({});
Filledform.args = baseArgs;

export const Simplifyuiform = LoginFormTemplate.bind({});
Simplifyuiform.args = { ...baseArgs, simplifyUI: true };

export const Errorform = LoginFormTemplate.bind({});
Errorform.args = {
  ...baseArgs,
  hasError: true,
};

export default {
  title: 'Components/CssOnly/LoginForm',
  component: LoginForm,
  argTypes: {
    email: {
      description: 'The staff/member email used to login into the platform',
    },
    password: {
      description: 'The staff/member password used to login into the platform',
    },
    emailChoices: {
      description: 'The emails returned',
    },
    hasError: {
      description: 'Confition if the form is in error state or not',
    },
    errorMessage: {
      description:
        'The error message to display if the boolean `hasError` is set to `true`',
    },
    hrefLink: {
      description: 'The link to access the reset password form',
    },
    onOpenIntercomHelp: {
      description:
        'Action to perform once the intercom help button has been clicked',
    },
    hasFranchisor: {
      description: 'In a franchisor context',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    hasCompany: {
      description: 'In a company context',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    simplifyUI: {
      description:
        'Conditional if the user has the new checkout flow enabled or disabled bubbles background for his company',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    isLoading: {
      description: 'Whether the form is loading or not',
    },
    onSubmit: {
      description: 'The action to perform once the form submitted',
    },
  },
} as ComponentMeta<typeof LoginForm>;
