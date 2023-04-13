import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

export const formWithErrorTest = async ({
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
  const buttonSubmit = privateSlotForm.querySelector('#button-submit');

  // 🧪 Name - if the name is empty, we can't validate the form
  const nameInput = privateSlotForm.querySelector('#name-input');
  const sessionName = 'Paxtown tournament';
  const wrongSessionName = '';

  userEvent.type(nameInput, wrongSessionName);
  expect(buttonSubmit.hasAttribute('disabled')).toBeTruthy();
  userEvent.type(nameInput, sessionName);

  // 🧪 Credits - if credit is < 0, we can't validate the form
  const creditInput = privateSlotForm.querySelector('#credit-input input');
  const wrongCredit = '-5';

  userEvent.clear(creditInput);
  userEvent.type(creditInput, wrongCredit);
  userEvent.tab();

  expect(buttonSubmit.hasAttribute('disabled')).toBeTruthy();

  userEvent.clear(creditInput);

  // 🧪 People capacity - If people capacity is < 0, we can't validate the form
  const peopleCapacityInput = privateSlotForm.querySelector(
    '#people-capacity-input input',
  );
  const wrongPeopleCapacity = '-5';

  userEvent.clear(peopleCapacityInput);
  userEvent.type(peopleCapacityInput, wrongPeopleCapacity);

  expect(buttonSubmit.hasAttribute('disabled')).toBeTruthy();

  userEvent.clear(peopleCapacityInput);

  // 🧪 Duration if all the duration fields are = 0, we can't validate the form
  const durationDayInput = privateSlotForm.querySelector('#duration_day');
  const durationHourInput = privateSlotForm.querySelector('#duration_hour');
  const durationMinuteInput = privateSlotForm.querySelector('#duration_minute');
  const durationDay = '1';

  userEvent.clear(durationHourInput);
  userEvent.clear(durationDayInput);
  userEvent.clear(durationMinuteInput);

  expect(buttonSubmit.hasAttribute('disabled')).toBeTruthy();

  userEvent.type(durationDayInput, durationDay);

  // 🧪 Boooking interval - if < 0, we can't validate the form
  const bookingIntervalInput = privateSlotForm.querySelector(
    '#booking-interval-input input',
  );
  const wrongBookingInterval = '-30';

  userEvent.type(bookingIntervalInput, wrongBookingInterval);

  expect(buttonSubmit.hasAttribute('disabled')).toBeTruthy();
};
