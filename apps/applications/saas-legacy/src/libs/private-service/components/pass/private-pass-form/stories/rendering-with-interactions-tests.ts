import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import {
  querySelectedElementShouldBeInTheDocument,
  querySelectedElementShouldHaveAttribute,
  sleep,
  findByTestIdInCanvas,
} from '../../../../../../utils/storybookHelper';

// Rendering tests with interactions
// The purpose of these tests is to mimic user behavior and check that hidden fields / elements are rendered

export const paymentSectionInteractionsRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  // 🧪 When selecting Universal pass, the section should be disabled
  const universalSwitchField = component.querySelector(
    '#private-pass-universal-switch-field-container input',
  );
  userEvent.click(universalSwitchField);

  const paymentSection = component.querySelector(
    '#private-pass-form-payment-section',
  );

  const paymentMethodOptions = paymentSection.querySelectorAll('label');

  paymentMethodOptions.forEach((label) => {
    // We use the first span inside each label, it represents the checkbox and should be disabled
    querySelectedElementShouldHaveAttribute(
      label.querySelector('span'),
      'aria-disabled',
      'true',
    );
  });
};

export const validitySectionInteractionsRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const validitySection = component.querySelector(
    '#private-pass-form-validity-section',
  );

  // 🧪 private-pass-expiration-field should not be visible
  const expirationField = validitySection.querySelector(
    '#private-pass-expiration-field',
  );
  expect(expirationField).not.toBeVisible();

  // 🧪 When clicking on 1st booking option, private-pass-expiration-field should be visibile
  const validityRadioGroups = await within(
    validitySection as HTMLElement,
  ).findByRole('radiogroup');

  const validityRadioButtons =
    within(validityRadioGroups).getAllByRole('radio');

  userEvent.click(validityRadioButtons[1]);
  expect(expirationField).toBeVisible();
};

export const universalCompatibilityInteractionsRenderingTests = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  // 🧪 By default, this section is not in the document
  expect(component.querySelector('#universal-pass-compatibility')).toBeNull();

  // 🧪 When clicking on the universal switchfield, the section should appear
  const universalSwitchField = component.querySelector(
    '#private-pass-universal-switch-field-container input',
  );

  userEvent.click(universalSwitchField);

  await sleep(500);

  querySelectedElementShouldBeInTheDocument(
    component,
    '#universal-pass-compatibility',
  );
};
