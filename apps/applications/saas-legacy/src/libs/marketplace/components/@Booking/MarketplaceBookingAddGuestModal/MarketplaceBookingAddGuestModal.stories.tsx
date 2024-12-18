import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import { ComponentStory, Meta } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
import { action } from '@storybook/addon-actions';
import { userEvent, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import i18n from 'i18next';

import MarketplaceBookingAddGuestModal, {
  type Props,
  type AddGuestFormValues,
  MarketplaceBookingAddGuestModalForStorybook,
  AddGuestValidationShema,
} from '.';
import {
  newStoryFromTemplate,
  querySelectedElementShouldBeInTheDocument,
  sleep,
} from '#src/utils/storybookHelper';
import { BOOKING_FOR_GUEST_FREQUENCY } from '#src/libs/offer/types';

import './styles-storybook.css';

const requiredFieldError = i18n.t('booking:guest.form.errors.requiredField');
const invalidEmailError = i18n.t('booking:guest.form.errors.email');

const initialValues: AddGuestFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

const baseArgs = {
  bookingGuestRemainingCount: faker.number.int({ min: 5, max: 20 }),
  bookingGuestFrequency: BOOKING_FOR_GUEST_FREQUENCY.WEEK,
};

export default {
  title: 'Components/Marketplace/@Booking/MarketplaceBookingAddGuestModal',
  component: MarketplaceBookingAddGuestModal,
  decorators: [
    withFormik,
    (Story) => (
      <div className="bs-booking-add-guest-modal-storybook__container">
        <Story />
      </div>
    ),
  ],
  parameters: {
    formik: {
      initialValues,
      enableReinitialize: true,
      validateOnChange: true,
      validateOnBlur: false,
      validationSchema: AddGuestValidationShema,
      handleSubmit: () => {},
    },
  },
  argTypes: {
    bookingGuestFrequency: {
      control: {
        type: 'select',
        options: [
          BOOKING_FOR_GUEST_FREQUENCY.WEEK,
          BOOKING_FOR_GUEST_FREQUENCY.MONTH,
          BOOKING_FOR_GUEST_FREQUENCY.YEAR,
        ],
      },
    },
    onSubmit: action('onSubmit'),
    onCancel: action('onCancel'),
  },
} as Meta<typeof MarketplaceBookingAddGuestModal>;

const BookingAddGuestModalTemplate: ComponentStory<
  typeof MarketplaceBookingAddGuestModal
> = (args: Props) => (
  // @ts-expect-error
  <MarketplaceBookingAddGuestModalForStorybook {...baseArgs} {...args} />
);

export const EmptyForm = newStoryFromTemplate(BookingAddGuestModalTemplate);
EmptyForm.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const addGuestForm = await canvas.findByTestId(
    'add-guest-form',
    {},
    {
      timeout: 3500,
    },
  );

  // Status message with icon
  querySelectedElementShouldBeInTheDocument(
    addGuestForm,
    '#add-guest-modal-message-icon',
  );

  // Guest count info text
  querySelectedElementShouldBeInTheDocument(
    addGuestForm,
    '#add-guest-modal-guest-count',
  );

  // Form fields
  querySelectedElementShouldBeInTheDocument(
    addGuestForm,
    '#add-guest-modal-first-name',
  );
  querySelectedElementShouldBeInTheDocument(
    addGuestForm,
    '#add-guest-modal-last-name',
  );
  querySelectedElementShouldBeInTheDocument(
    addGuestForm,
    '#add-guest-modal-email',
  );

  // Form actions
  const actionButtonsContainer = addGuestForm.querySelector(
    '#add-guest-modal-form-actions',
  );
  const actionsButtons = actionButtonsContainer.querySelectorAll('button');
  expect(actionsButtons.length).toEqual(2);
};

export const ErrorForm = newStoryFromTemplate(BookingAddGuestModalTemplate);
ErrorForm.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const addGuestForm = await canvas.findByTestId(
    'add-guest-form',
    {},
    {
      timeout: 3500,
    },
  );
  const submitFormButton = addGuestForm.querySelector(
    '.bs-booking-add-guest-modal__actions__submit',
  );
  await sleep(300);

  // First name field - user should not be able to submit if the input is empty
  userEvent.click(submitFormButton);
  await sleep(100);
  const firstNameFieldError = addGuestForm.querySelector(
    '#add-guest-modal-first-name-helper-text',
  );
  await sleep(300);
  expect(firstNameFieldError).toBeInTheDocument();
  expect(firstNameFieldError).toHaveTextContent(requiredFieldError);

  // Email field - user should not be able to submit if the input is not a valid email
  const emailInput = addGuestForm.querySelector('#add-guest-modal-email-input');
  userEvent.type(emailInput, faker.string.sample());
  await sleep(100);
  const emailFieldError = addGuestForm.querySelector(
    '#add-guest-modal-email-helper-text',
  );
  await sleep(100);
  expect(emailFieldError).toBeInTheDocument();
  expect(emailFieldError).toHaveTextContent(invalidEmailError);
};

export const WarningStep = newStoryFromTemplate(BookingAddGuestModalTemplate);
WarningStep.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const addGuestForm = await canvas.findByTestId(
    'add-guest-form',
    {},
    {
      timeout: 3500,
    },
  );
  const submitFormButton = addGuestForm.querySelector(
    '.bs-booking-add-guest-modal__actions__submit',
  );
  await sleep(300);

  // User should see a warning when an email hasnt been entered
  const firstNameInput = addGuestForm.querySelector(
    '#add-guest-modal-first-name-input',
  );
  userEvent.type(firstNameInput, faker.person.firstName());
  await sleep(500);
  userEvent.click(submitFormButton);
  await sleep(300);
  querySelectedElementShouldBeInTheDocument(
    addGuestForm,
    '#add-guest-modal-warning-message-icon',
  );
};
