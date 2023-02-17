import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import LoginComponent from './Login.component';

export default {
  title: 'Login Component',
  component: LoginComponent,
  argTypes: { onSubmit: { action: 'clicked' } },
} as ComponentMeta<typeof LoginComponent>;

const LoginComponentTemplate: ComponentStory<typeof LoginComponent> = (
  args,
) => <LoginComponent {...args} />;

export const EmptyComponentLogin = LoginComponentTemplate.bind({});

export const LoadingLoginComponent = LoginComponentTemplate.bind({});
LoadingLoginComponent.args = {
  loading: true,
};
LoadingLoginComponent.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const emailInput = canvas.getByTestId('email').querySelector('#email');
  const passwordInput = canvas
    .getByTestId('password')
    .querySelector('#textfield_password');

  await expect(
    canvas.getByTestId('btn-signin').hasAttribute('disabled'),
  ).toBeTruthy();

  await expect(emailInput.hasAttribute('disabled')).toBeTruthy();

  await expect(passwordInput.hasAttribute('disabled')).toBeTruthy();
};

export const FillingLoginComponent = LoginComponentTemplate.bind({});
FillingLoginComponent.args = {
  errorMessage: 'Error',
  error: true,
};
FillingLoginComponent.play = async ({ canvasElement }) => {
  const userEmail = 'email@provider.com';
  const userPassWord = 'password123';

  const canvas = within(canvasElement);

  const emailInput = canvas.getByTestId('email').querySelector('#email');

  const passwordInput = canvas
    .getByTestId('password')
    .querySelector('#textfield_password');

  await userEvent.type(emailInput, userEmail);
  await userEvent.type(passwordInput, userPassWord);

  await expect(emailInput.getAttribute('value')).toBe(userEmail);
  await expect(passwordInput.getAttribute('value')).toBe(userPassWord);
};
