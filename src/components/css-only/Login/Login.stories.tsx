import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { LoginStorybook } from './Login.component';
import { newStoryFromTemplate } from '#utils/storybookHelper';

export default {
  title: 'Login Component',
  component: LoginStorybook,
  argTypes: { onSubmit: { action: 'clicked' } },
} as ComponentMeta<typeof LoginStorybook>;

const LoginComponentTemplate: ComponentStory<typeof LoginStorybook> = (
  args,
) => <LoginStorybook {...args} />;

export const EmptyComponentLogin = newStoryFromTemplate(LoginComponentTemplate);

export const LoadingLoginComponent = newStoryFromTemplate(
  LoginComponentTemplate,
);
LoadingLoginComponent.args = {
  loading: true,
};
LoadingLoginComponent.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const emailInput = await canvas.findByTestId(
    'email',
    {},
    {
      timeout: 3500,
    },
  );
  const passwordInput = await canvas.findByTestId(
    'password',
    {},
    {
      timeout: 3500,
    },
  );

  await expect(emailInput.hasAttribute('disabled')).toBeTruthy();
  await expect(passwordInput.hasAttribute('disabled')).toBeTruthy();
};

export const FillingLoginComponent = newStoryFromTemplate(
  LoginComponentTemplate,
);
FillingLoginComponent.args = {
  errorMessage: 'Error',
  error: true,
};
FillingLoginComponent.play = async ({ canvasElement }) => {
  const userEmail = 'email@provider.com';
  const userPassWord = 'password123';

  const canvas = within(canvasElement);

  const emailInput = canvas.getByTestId('email');
  const passwordInput = canvas.getByTestId('password');

  await userEvent.type(emailInput, userEmail);
  await userEvent.type(passwordInput, userPassWord);

  await expect(emailInput.getAttribute('value')).toBe(userEmail);
  await expect(passwordInput.getAttribute('value')).toBe(userPassWord);
};
