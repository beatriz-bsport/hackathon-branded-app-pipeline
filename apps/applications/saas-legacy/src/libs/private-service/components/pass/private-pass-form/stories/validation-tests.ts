import { userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import PrivatePassForm from '../PrivatePassForm.component';

import {
  querySelectedFieldShouldReceiveTheInputValue,
  sleep,
  findByTestIdInCanvas,
} from '../../../../../../utils/storybookHelper';

import { inputValues } from './constants';

// Validation tests
// The purpose is to test if the validation rules are respected

export const validationTests = async ({
  canvasElement,
  args,
}: {
  args: React.ComponentProps<typeof PrivatePassForm>;
  canvasElement: HTMLElement;
}) => {
  const { component } = await findByTestIdInCanvas(
    canvasElement,
    'private-pass-form',
  );

  const generalSection = component.querySelector(
    '#private-pass-form-general-section',
  );
  const actionsButtons = component.querySelectorAll(
    '#private-pass-form-actions-buttons button',
  );

  // 🧪 Name - If no value provided, it's impossible to submit the form
  userEvent.click(actionsButtons[1]);
  await sleep(200);
  expect(args.onSubmit).not.toBeCalled();

  // 🧪 Name - If a value is provided, the form can be submitted
  await querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#private-pass-name-field',
    inputValues.general.name,
  );
  userEvent.click(actionsButtons[1]);
  await sleep(200);
  expect(args.onSubmit).toHaveBeenCalled();
};
