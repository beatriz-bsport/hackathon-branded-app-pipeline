import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import PrivatePassForm from '../PrivatePassForm.component';

import {
  querySelectedFieldShouldReceiveTheInputValue,
  sleep,
  findByTestIdInCanvas,
} from '../../../../../../utils/storybookHelper';
import { inputValues } from './constants';

// Error tests
// The purpose is to test if errors are displayed properly. It should not be possible to submit the form in case of error

const testNumericFieldError = async (
  element: Element,
  input: string,
  buttons: NodeListOf<Element>,
  args: React.ComponentProps<typeof PrivatePassForm>,
) => {
  // It should be impossible to submit the form when input is negative
  userEvent.clear(element);
  userEvent.type(element, input);
  userEvent.tab();
  await sleep(50);
  userEvent.click(buttons[1], {}, { skipPointerEventsCheck: true });
  expect(args.onSubmit).not.toBeCalled();
  userEvent.clear(element);
  userEvent.type(element, '0');
  userEvent.tab();
};

export const generalSectionErrorTests = async ({
  canvasElement,
  args,
}: {
  args: React.ComponentProps<typeof PrivatePassForm>;
  canvasElement: HTMLElement;
}) => {
  const { canvas, component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const generalSection = component.querySelector(
    '#private-pass-form-general-section',
  );

  const actionsButtons = component.querySelectorAll(
    '#private-pass-form-actions-buttons button',
  );

  await querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#private-pass-name-field',
    inputValues.general.name,
  );

  // 🧪 Credits - It should be impossible to submit the form when the VAT is a negative value
  await testNumericFieldError(
    generalSection.querySelector('#private-pass-credit-field'),
    inputValues.errors.wrongNumericValue,
    actionsButtons,
    args,
  );
};

export const validitySectionErrorTests = async ({
  canvasElement,
  args,
}: {
  args: React.ComponentProps<typeof PrivatePassForm>;
  canvasElement: HTMLElement;
}) => {
  const { canvas, component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const validitySection = component.querySelector(
    '#private-pass-form-validity-section',
  );
  const generalSection = component.querySelector(
    '#private-pass-form-general-section',
  );
  const actionsButtons = component.querySelectorAll(
    '#private-pass-form-actions-buttons button',
  );

  await querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#private-pass-name-field',
    inputValues.general.name,
  );

  // 🧪 Validity - Days - It should be impossible to submit the form when value is negative
  await testNumericFieldError(
    validitySection.querySelector('#private-pass-duration-days'),
    inputValues.errors.wrongNumericValue,
    actionsButtons,
    args,
  );

  // 🧪 Validity - Months - It should be impossible to submit the form when value is negative
  await testNumericFieldError(
    validitySection.querySelector('#private-pass-duration-months'),
    inputValues.errors.wrongNumericValue,
    actionsButtons,
    args,
  );

  // 🧪 Validity - Years - It should be impossible to submit the form when value is negative
  await testNumericFieldError(
    validitySection.querySelector('#private-pass-duration-years'),
    inputValues.errors.wrongNumericValue,
    actionsButtons,
    args,
  );
};
