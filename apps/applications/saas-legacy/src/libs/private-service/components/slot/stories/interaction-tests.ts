import { expect } from '@storybook/jest';
import {
  userEvent,
  waitForElementToBeRemoved,
  within,
} from '@storybook/testing-library';

import {
  querySelectedFieldShouldReceiveTheInputValue,
  querySelectedFieldShouldHaveTheExpectedValue,
} from '../../../../../utils/storybookHelper';

import { initialData, wrongInputValues } from './constants';

// 🧪 Duration list - when clicking on an option, it should update the durations inputs
const clickOnOptionShouldUpdateDurationInputs = async (
  selector: string,
  values: {
    day: string;
    hour: string;
    minute: string;
  },
) => {
  const durationDayInput = document.querySelector('#duration_day');
  const durationHourInput = document.querySelector('#duration_hour');
  const durationMinuteInput = document.querySelector('#duration_minute');

  userEvent.click(document.querySelector(selector));

  expect(durationDayInput.getAttribute('value')).toBe(values.day);
  expect(durationHourInput.getAttribute('value')).toBe(values.hour);
  expect(durationMinuteInput.getAttribute('value')).toBe(values.minute);

  // 🧪 Duration list - after clicking on an option, list should disappear
  // Once fullfiled, this promise prove that the list doesn't appear anymore in the document
  await waitForElementToBeRemoved(() =>
    document.querySelector('#menu- div ul'),
  );
};

// 🧪 Duration inputs - When duration day is 1, the other durations values should be 0, event if inputted before
// duration day

const testDurationValuesAfterInput = async (
  element: {
    day: Element | HTMLElement;
    hour: Element | HTMLElement;
    minute: Element | HTMLElement;
  },
  inputValue: {
    day?: string;
    hour?: string;
    minute?: string;
  },
  expectedValue: { day: string; hour: string; minute: string },
) => {
  userEvent.clear(element.day);
  userEvent.clear(element.hour);
  userEvent.clear(element.minute);

  inputValue.minute && userEvent.type(element.minute, inputValue.minute);
  inputValue.hour && userEvent.type(element.hour, inputValue.hour);
  inputValue.day && userEvent.type(element.day, inputValue.day);
  userEvent.tab(); // We need tab to update the value of the numeric input

  expect(element.day.getAttribute('value')).toBe(expectedValue.day);
  expect(element.hour.getAttribute('value')).toBe(expectedValue.hour);
  expect(element.minute.getAttribute('value')).toBe(expectedValue.minute);
};

export const formValidationTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // 🎯 Tests to verify the value that the user inputs is the ones received in the form
  const canvas = within(canvasElement);
  const privateSlotForm = await canvas.findByTestId(
    'privateslot-form',
    {
      /* Unused queryOptions */
    },
    { timeout: 3000 },
  );

  const selectDurationButton = privateSlotForm.querySelector(
    '#duration-preselected-button',
  );

  // 🧪 Name - The value received should be the same as the one inputted
  await querySelectedFieldShouldReceiveTheInputValue(
    privateSlotForm,
    '#name-input',
    initialData.name,
  );

  // 🧪 Credit - The value received should be the same as the one inputted
  await querySelectedFieldShouldReceiveTheInputValue(
    privateSlotForm,
    '#credit-input input',
    initialData.credit,
  );

  // 🧪 People capacity - The value received should be the same as the one inputted
  await querySelectedFieldShouldReceiveTheInputValue(
    privateSlotForm,
    '#people-capacity-input input',
    initialData.people_capacity_used,
  );

  // 🧪 Duration - The value received should be the same as the one inputted
  const durationInput = privateSlotForm.querySelector('#duration-input');

  // 🧪 Duration minute - The value received should be the same as the one inputted
  await querySelectedFieldShouldReceiveTheInputValue(
    durationInput,
    '#duration_minute',
    initialData.duration_minutes,
  );

  // 🧪 Duration hour - The value received should be the same as the one inputted
  await querySelectedFieldShouldReceiveTheInputValue(
    durationInput,
    '#duration_hour',
    initialData.duration_hour,
  );

  // 🧪 Duration day - The value received should be the same as the one inputted
  await querySelectedFieldShouldReceiveTheInputValue(
    durationInput,
    '#duration_day',
    initialData.duration_day,
  );

  // 🧪 Booking interval - The value received should be the same as the one inputted
  await querySelectedFieldShouldReceiveTheInputValue(
    privateSlotForm,
    '#booking-interval-input input',
    initialData.booking_interval_minutes,
  );

  // 🧪 Button Submit - Should not be disabled anymore
  const buttonSubmit = privateSlotForm.querySelector('#button-submit');
  expect(buttonSubmit.hasAttribute('disabled')).toBeFalsy();

  // Duration inputs
  // 🧪 When duration day is 1, the other durations values should be 0
  await testDurationValuesAfterInput(
    {
      day: durationInput.querySelector('#duration_day'),
      hour: durationInput.querySelector('#duration_hour'),
      minute: durationInput.querySelector('#duration_minute'),
    },
    {
      day: initialData.duration_day,
      hour: initialData.duration_hour,
      minute: initialData.duration_minutes,
    },
    {
      day: initialData.duration_day,
      hour: '0',
      minute: '0',
    },
  );

  // 🧪 When duration day is 0, the other durations should be equals to what we entered in inputs
  await testDurationValuesAfterInput(
    {
      day: durationInput.querySelector('#duration_day'),
      hour: durationInput.querySelector('#duration_hour'),
      minute: durationInput.querySelector('#duration_minute'),
    },
    {
      day: '0',
      hour: initialData.duration_hour,
      minute: initialData.duration_minutes,
    },
    {
      day: '0',
      hour: initialData.duration_hour,
      minute: initialData.duration_minutes,
    },
  );

  // 🧪 When duration minute is 24, duration day is 1, duration minute and hours are 0
  await testDurationValuesAfterInput(
    {
      day: durationInput.querySelector('#duration_day'),
      hour: durationInput.querySelector('#duration_hour'),
      minute: durationInput.querySelector('#duration_minute'),
    },
    {
      hour: '24',
    },
    {
      day: '1',
      hour: '0',
      minute: '0',
    },
  );

  // 🧪 When duration minute is 60, duration minute is incremented and second is 0
  await testDurationValuesAfterInput(
    {
      day: durationInput.querySelector('#duration_day'),
      hour: durationInput.querySelector('#duration_hour'),
      minute: durationInput.querySelector('#duration_minute'),
    },
    {
      minute: '60',
    },
    {
      day: '0',
      hour: '1',
      minute: '0',
    },
  );

  // 🧪 Duration list - when clicking on the button, the list should appear
  userEvent.click(selectDurationButton);
  expect(document.querySelector('#menu- div ul')).toBeInTheDocument();

  // 🧪 Duration list - when clicking on an option, it should update the durations inputs
  // Click on the li option for 12 hours

  clickOnOptionShouldUpdateDurationInputs('#menu- div ul [data-value="720"]', {
    day: '0',
    hour: '12',
    minute: '0',
  });

  // 🧪 Duration list - when clicking on an option, it should update the durations inputs
  // Click on the li option for 1h15
  userEvent.click(selectDurationButton);
  clickOnOptionShouldUpdateDurationInputs('#menu- div ul [data-value="75"]', {
    day: '0',
    hour: '1',
    minute: '15',
  });
};

export const formWithWrongValuesTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  // 🎯 Tests to verify that the form doesn't crash if the user inputs wrong values
  const canvas = within(canvasElement);
  const privateSlotForm = await canvas.findByTestId(
    'privateslot-form',
    {
      /* Unused queryOptions */
    },
    { timeout: 3000 },
  );

  // 🧪 Credit - The value should be an empty string when not receiving numeric strings
  querySelectedFieldShouldHaveTheExpectedValue(
    privateSlotForm.querySelector('#credit-input input'),
    wrongInputValues.numeric,
    '',
  );

  // 🧪 People capacity - The value should be an empty string when not receiving numeric strings
  querySelectedFieldShouldHaveTheExpectedValue(
    privateSlotForm.querySelector('#people-capacity-input input'),
    wrongInputValues.numeric,
    '',
  );

  // 🧪 Booking interval - The value should be 10 (default) when not receiving numeric strings
  querySelectedFieldShouldHaveTheExpectedValue(
    privateSlotForm.querySelector('#booking-interval-input input'),
    wrongInputValues.numeric,
    '10',
  );

  // 🧪 Duration - The value should be "0" when not receiving numeric strings
  const durationInput = privateSlotForm.querySelector('#duration-input');

  // 🧪 Minutes
  querySelectedFieldShouldHaveTheExpectedValue(
    durationInput.querySelector('#duration_minute'),
    wrongInputValues.numeric,
    '0',
  );

  // 🧪 Hour
  querySelectedFieldShouldHaveTheExpectedValue(
    durationInput.querySelector('#duration_hour'),
    wrongInputValues.numeric,
    '0',
  );

  // 🧪 Day
  querySelectedFieldShouldHaveTheExpectedValue(
    durationInput.querySelector('#duration_day'),
    wrongInputValues.numeric,
    '0',
  );

  // 🧪 Button Submit should be disabled
  const buttonSubmit = privateSlotForm.querySelector('#button-submit');
  expect(buttonSubmit.hasAttribute('disabled')).toBeTruthy();
};
