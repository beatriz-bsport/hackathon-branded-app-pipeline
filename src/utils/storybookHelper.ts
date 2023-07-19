import { Component } from 'react';
import { ComponentStory } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// Function that helps us to retrieve the form and the specified element / container
export async function findByTestIdInCanvas(
  canvasElement: HTMLElement,
  componentId: string,
) {
  const canvas = within(canvasElement);
  const component = await canvas.findByTestId(
    componentId,
    {}, //Unused queryOption
    { timeout: 3500 },
  );
  return {
    canvas,
    component,
  };
}

// Function to emulate pausing between interactions
// We need this to interact with the select components as sometimes (depending on the computer performance), the
// document is not completely mounted and we can't interact with some elements, mainly selectors.
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// This function is used to type the stories as bind() will change the template type to any
export function newStoryFromTemplate<T extends typeof Component>(
  template: ComponentStory<T>,
): ComponentStory<T> {
  return template.bind({});
}

// Test that the selected element is rendered in the document
export const querySelectedElementShouldBeInTheDocument = (
  element: HTMLElement | Element,
  selector: string,
) => {
  const selectedElement = element.querySelector(selector);
  expect(selectedElement).toBeInTheDocument();
};

// Test that the selected element is rendered in the document but hidden
export const querySelectedElementShouldBeHiddenInTheDocument = (
  element: HTMLElement | Element,
  selector: string,
) => {
  const selectedElement = element.querySelector(selector);
  expect(selectedElement).toBeInTheDocument();
  expect(selectedElement).not.toBeVisible();
};

// Test that the value received by the field should be the same as the one inputted
export const querySelectedFieldShouldReceiveTheInputValue = async (
  element: HTMLElement | Element,
  selector: string,
  inputValue: string,
) => {
  const field = element.querySelector(selector);
  userEvent.clear(field);
  userEvent.type(field, inputValue);
  userEvent.tab();
  await sleep(100);
  expect(field.getAttribute('value')).toBe(inputValue);
};

// Test that the value received by the field should be the one expected
export const querySelectedFieldShouldHaveTheExpectedValue = async (
  selectedField: HTMLElement | Element,
  inputValue: string,
  expectedValue: string,
) => {
  userEvent.clear(selectedField);
  userEvent.type(selectedField, inputValue);
  userEvent.tab();
  expect(selectedField.getAttribute('value')).toBe(expectedValue);
};

// Test that the selected element has attribute and value(optional)
export const querySelectedElementShouldHaveAttribute = (
  element: Element | HTMLElement,
  attribute: string,
  value?: string,
) => {
  !!value
    ? expect(element).toHaveAttribute(attribute, value)
    : expect(element).toHaveAttribute(attribute);
};

// Test that the selected element contains the text
export const querySelectedElementShouldContainsSpecifiedText = (
  element: HTMLElement,
  text: string,
) => {
  expect(within(element).queryByText(text)).not.toBeNull();
};
