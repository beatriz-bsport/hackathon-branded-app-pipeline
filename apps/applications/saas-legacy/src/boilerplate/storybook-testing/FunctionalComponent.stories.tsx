import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import FunctionalComponent from './FunctionalComponent';

// The purpose of this story is to show how to implement interaction test in storybook

export default {
  title: 'Boilerplate',
  component: FunctionalComponent,
} as ComponentMeta<typeof FunctionalComponent>;

const FunctionalComponentTemplate: ComponentStory<
  typeof FunctionalComponent
> = (args) => <FunctionalComponent {...args} />;

export const EmptyForm = FunctionalComponentTemplate.bind({});

//The test itself is defined inside a play function connected to a story.
//The play function is a small snippet of code that runs after a story finishes rendering.
export const FormValidationTest = FunctionalComponentTemplate.bind({});
FormValidationTest.play = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // The container element
  const canvas = within(canvasElement);

  // 🚨 The elements are rendered asynchronously. Therefore, we need to use a findBy* method
  // which is async and returns a Promise. To get the main element, we need to give it a data-testid,
  // it should be the only use case and data-testid should be avoided for now.

  // 🐢 As there is a loading when the story renders for the first time, we need to implement a timeout for slower computers.

  // 👇 Get the main element we want to test
  const formElement = await canvas.findByTestId(
    'functional-component-form',
    {
      /* Unused queryOptions */
    },
    { timeout: 3000 },
  );

  // Then, we get its children with basic query selectors.
  const firstNameInput = formElement.querySelector('#firstname-field');
  const lastNameInput = formElement.querySelector('#lastname-field');
  const phoneInput = formElement.querySelector('#phone-field');
  const button = formElement.querySelector('#btn-submit');

  // 👇 Set the inputs values
  const userFirstName = 'Richard';
  const userLastName = 'Aldana';
  const userPhone = '0123456789';

  // Tests when user successfully fill the fields

  // 👇 Simulate interactions with the component
  await userEvent.type(firstNameInput, userFirstName, { delay: 100 });
  await userEvent.type(lastNameInput, userLastName, { delay: 100 });
  await userEvent.type(phoneInput, userPhone, { delay: 100 });
  await userEvent.click(button);

  // 👇 Run the basic interaction tests
  await expect(firstNameInput.getAttribute('value')).toBe(userFirstName);
  await expect(lastNameInput.getAttribute('value')).toBe(userLastName);
  await expect(phoneInput.getAttribute('value')).toBe(userPhone);

  // 🚨 DON'T USE THIS ! 🚨
  // We use translations to generate text dynamically -> We can't rely on this
  // await expect(
  //     canvas.getByText(
  //         'Successfully submited'
  //     )
  // ).toBeInTheDocument();

  // A better way could be to identify the error message div with a data-testid or an id, and run the test
  await expect(formElement.querySelector('#success-msg')).toBeInTheDocument();

  // Another way of getting nested elements is to use the within function
  // It allow us to use all the queries from Testing Library
  // Here, we use queryByTestId instead of getByTestId
  // -> queryBy... return null, getBy... throw error when doesn't find an element
  const errorMessageContainer = within(formElement).queryByTestId('error-msg');

  await expect(errorMessageContainer).toBeNull();
};

export const FormErrorTest = FunctionalComponentTemplate.bind({});
FormErrorTest.play = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  // 👇 Get the elements we want to test
  const formElement = await canvas.findByTestId(
    'functional-component-form',
    {
      /* Unused queryOptions */
    },
    { timeout: 3000 },
  );
  const firstNameInput = formElement.querySelector('#firstname-field');
  const lastNameInput = formElement.querySelector('#lastname-field');
  const phoneInput = formElement.querySelector('#phone-field');
  const button = formElement.querySelector('#btn-submit');

  // 👇 Set the inputs values
  const userFirstName = 'Richard';
  const userLastName = 'Aldana';
  // Phone number length is supposed to be = 10
  const wrongUserPhone = '0123489';

  // Tests when user wrongly fill the fields

  // 👇 Simulate interactions with the elements
  await userEvent.type(firstNameInput, userFirstName, { delay: 100 });
  await userEvent.type(lastNameInput, userLastName, { delay: 100 });
  await userEvent.type(phoneInput, wrongUserPhone, { delay: 100 });
  await userEvent.click(button);

  // 👇 Run the basic interaction tests
  await expect(firstNameInput.getAttribute('value')).toBe(userFirstName);
  await expect(lastNameInput.getAttribute('value')).toBe(userLastName);
  await expect(phoneInput.getAttribute('value')).toBe(wrongUserPhone);

  const errorMessageContainer = formElement.querySelector('#error-msg');
  const errorMessageText =
    errorMessageContainer.querySelector('#text-error-msg');
  await expect(errorMessageContainer).toBeInTheDocument();

  await expect(errorMessageText).toBeInTheDocument();
};

export const EmptyFormLoadingTest = FunctionalComponentTemplate.bind({});
EmptyFormLoadingTest.args = {
  loading: true,
};
EmptyFormLoadingTest.play = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  // 👇 Get the elements we want to test
  const formElement = await canvas.findByTestId(
    'functional-component-form',
    {
      /* Unused queryOptions */
    },
    { timeout: 3000 },
  );
  const firstNameInput = formElement.querySelector('#firstname-field');
  const lastNameInput = formElement.querySelector('#lastname-field');
  const phoneInput = formElement.querySelector('#phone-field');
  const button = formElement.querySelector('#btn-submit');

  // 👇 Test if the elements are properly disabled when loading
  await expect(firstNameInput.hasAttribute('disabled')).toBeTruthy();
  await expect(lastNameInput.hasAttribute('disabled')).toBeTruthy();
  await expect(phoneInput.hasAttribute('disabled')).toBeTruthy();
  await expect(button.hasAttribute('disabled')).toBeTruthy();
};
