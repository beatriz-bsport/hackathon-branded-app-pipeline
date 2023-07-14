import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { PaymentPackForm } from '../PaymentPackForm.component';

import { sleep } from '../../../../../utils/storybookHelper';

import { inputValues } from './constants';

export const formValidationTests = async ({
  canvasElement,
  args,
}: {
  canvasElement: HTMLElement;
  args: React.ComponentProps<typeof PaymentPackForm>;
}) => {
  const canvas = within(canvasElement);
  const paymentPackForm = await canvas.findByTestId(
    'paymentpack-form',
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );
  const generalSection = paymentPackForm.querySelector(
    '#paymentpack-form-general-section',
  );
  const actionButtonsContainer = paymentPackForm.querySelector(
    '#paymentpack-form-actions',
  );
  const actionsButtons = actionButtonsContainer.querySelectorAll('button');
  const nameField = generalSection.querySelector(
    '#paymentpack-form-title-input',
  );

  await sleep(500);

  // 🧪 Name - If no value provided, it's impossible to submit the form
  userEvent.click(actionsButtons[1]);

  expect(args.onSubmit).not.toBeCalled();

  // 🧪 Name - If a value is provided, the form can be submitted
  await userEvent.type(nameField, inputValues.name, { delay: 1 });
  userEvent.click(actionsButtons[1]);

  await sleep(100);

  expect(args.onSubmit).toBeCalled();
  expect(actionsButtons[1].hasAttribute('disabled')).toBeTruthy();
};
