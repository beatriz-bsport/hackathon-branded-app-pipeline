import React, { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import ResetPasswordForm, { ResetPasswordFormStorybook } from '.';
import { Props } from './ResetPasswordForm.component';
import { DateTime } from 'luxon';
import './styles-storybook.css';

const ResetPasswordFormTemplate: ComponentStory<
  typeof ResetPasswordFormStorybook
> = (args) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!email && args.email) {
      setEmail(args.email);
    }
  }, [args.email]);

  const updateEmail = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, []);

  return (
    <ResetPasswordFormStorybook
      {...args}
      email={email}
      updateEmail={updateEmail}
    />
  );
};

const baseArgs: Omit<Props, 'updateEmail'> = {
  email: faker.internet.email(),
  hasSent: false,
  hasResetError: false,
  simplifyUI: false,
  last_password_reset_request: '',
  isLoading: false,
  redirectUrlWithParams: '',
  redirectLogin: () => {},
  onSubmit: () => {},
};

export const Emptyform = ResetPasswordFormTemplate.bind({});
Emptyform.args = { ...baseArgs, email: '' };

export const Filledform = ResetPasswordFormTemplate.bind({});
Filledform.args = baseArgs;

export const Errorform = ResetPasswordFormTemplate.bind({});
Errorform.args = {
  ...baseArgs,
  hasResetError: true,
};

export const Helpmessageform = ResetPasswordFormTemplate.bind({});
Helpmessageform.args = {
  ...baseArgs,
  last_password_reset_request: DateTime.now().minus({ hours: 2 }).toISO(),
  hasSent: true,
};

export const Successform = ResetPasswordFormTemplate.bind({});
Successform.args = {
  ...baseArgs,
  hasSent: true,
};

export default {
  title: 'Components/CssOnly/ResetPasswordForm',
  component: ResetPasswordForm,
  argTypes: {
    customConfiguration: {
      description: 'The optional saved custom CSS configuration for this form',
    },
    hasSent: {
      description: 'Display the success screen',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    hasResetError: {
      description: 'Conditional if the form submit has returned any error',
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
    last_password_reset_request: {
      description:
        'Date of the request about last time the user attempted to reset his password. If less than 4hrs has been spent since, we display a help message.',
    },
    isLoading: {
      description: 'Whether the form is loading or not',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    redirectUrlWithParams: {
      description: 'The URL to redirect to cancel button is clicked',
    },
    redirectLogin: {
      description: 'The action to perform once cancel button is clicked',
    },
    onSubmit: {
      description: 'The action to perform once the form submitted',
    },
  },
} as ComponentMeta<typeof ResetPasswordForm>;
