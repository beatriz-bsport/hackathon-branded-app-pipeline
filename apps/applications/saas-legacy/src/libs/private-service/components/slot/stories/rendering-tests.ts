import { within } from '@storybook/testing-library';
import { defaultValues, expectedValues } from './constants';
import { expect } from '@storybook/jest';

export const formRenderingTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // The purpose is to test if the component and its children are rendered correctly
  const canvas = within(canvasElement);
  const privateSlotForm = await canvas.findByTestId(
    'privateslot-form',
    {
      /* Unused queryOptions */
    },
    { timeout: 3000 },
  );

  // 🧪 Fields should be rendered in the document
  const nameInput = privateSlotForm.querySelector('#name-input');
  expect(nameInput).toBeInTheDocument();

  //We need to queryselect #id... tag for NumericInput as the input is nested inside the component
  const creditInput = privateSlotForm.querySelector('#credit-input input');
  expect(creditInput).toBeInTheDocument();

  const peopleCapacityInput = privateSlotForm.querySelector(
    '#people-capacity-input input',
  );
  expect(peopleCapacityInput).toBeInTheDocument();

  const bookingIntervalInput = privateSlotForm.querySelector(
    '#booking-interval-input input',
  );
  expect(bookingIntervalInput).toBeInTheDocument();

  const durationInput = privateSlotForm.querySelector('#duration-input');
  expect(durationInput).toBeInTheDocument();

  const durationDayInput = durationInput.querySelector('#duration_day');
  expect(durationDayInput).toBeInTheDocument();

  const durationHourInput = durationInput.querySelector('#duration_hour');
  expect(durationHourInput).toBeInTheDocument();

  const durationMinuteInput = durationInput.querySelector('#duration_minute');
  expect(durationMinuteInput).toBeInTheDocument();

  const selectDurationButton = privateSlotForm.querySelector(
    '#duration-preselected-button',
  );
  expect(selectDurationButton).toBeInTheDocument();

  // 🧪 If no props.initial is provided, default values should be as defined in the component state
  expect({
    name: nameInput.getAttribute('value'),
    durationMinutes: durationMinuteInput.getAttribute('value'),
    durationHours: durationHourInput.getAttribute('value'),
    durationDays: durationDayInput.getAttribute('value'),
    credit: creditInput.getAttribute('value'),
    peopleCapacityUsed: peopleCapacityInput.getAttribute('value'),
    bookingIntervalMinutes: bookingIntervalInput.getAttribute('value'),
  }).toEqual(defaultValues);

  // 🧪 Buttons should be rendered in the document
  const buttonCancel = privateSlotForm.querySelector('#button-cancel');
  expect(buttonCancel).toBeInTheDocument();

  const buttonSubmit = privateSlotForm.querySelector('#button-submit');
  expect(buttonSubmit).toBeInTheDocument();

  // 🧪 Button Submit should be disabled
  expect(buttonSubmit.hasAttribute('disabled')).toBeTruthy();

  // 🧪 Button Cancel should not be disabled
  expect(buttonCancel.hasAttribute('disabled')).toBeFalsy();

  // 🧪 The duration list dialog should not appear in the document
  const durationList = document.querySelector('#menu- div ul');
  expect(durationList).not.toBeInTheDocument();
};

export const formWithInitialValuesRenderingTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  const privateSlotForm = await canvas.findByTestId(
    'privateslot-form',
    {
      /* Unused queryOptions */
    },
    { timeout: 3000 },
  );
  const durationInput = privateSlotForm.querySelector('#duration-input');

  // 🧪 If initial is provided, default values should be the ones passed in props
  const nameInput = privateSlotForm.querySelector('#name-input');

  const durationMinuteInput = durationInput.querySelector('#duration_minute');

  const durationHourInput = durationInput.querySelector('#duration_hour');

  const durationDayInput = durationInput.querySelector('#duration_day');

  const creditInput = privateSlotForm.querySelector('#credit-input input');

  const peopleCapacityInput = privateSlotForm.querySelector(
    '#people-capacity-input input',
  );

  const bookingIntervalInput = privateSlotForm.querySelector(
    '#booking-interval-input input',
  );

  expect({
    name: nameInput.getAttribute('value'),
    durationMinues: durationMinuteInput.getAttribute('value'),
    durationHours: durationHourInput.getAttribute('value'),
    durationDays: durationDayInput.getAttribute('value'),
    credit: creditInput.getAttribute('value'),
    peopleCapacityUsed: peopleCapacityInput.getAttribute('value'),
    bookingIntervalMinutes: bookingIntervalInput.getAttribute('value'),
  }).toEqual(expectedValues);
};
