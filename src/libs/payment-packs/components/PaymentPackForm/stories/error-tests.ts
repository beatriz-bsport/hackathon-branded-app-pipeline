// @ts-nocheck
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

import i18n from 'i18next';

import { sleep } from '../../../../../utils/storybookHelper';

import { PaymentPackForm } from '../PaymentPackForm.component';

import { inputValues } from './constants';

export const generalSectionErrorsTests = async ({
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
  const actionButtons = paymentPackForm.querySelectorAll(
    '#paymentpack-form-actions button',
  );
  const submitButton = actionButtons[1];
  const nameField = generalSection.querySelector(
    '#paymentpack-form-title-input',
  );

  const testNumericFieldError = async (element: Element, input: string) => {
    // It should be impossible to submit the form when input is negative
    userEvent.clear(element);
    userEvent.type(element, input);
    userEvent.tab();
    await sleep(50);
    userEvent.click(submitButton);
    expect(args.onSubmit).not.toBeCalled();
    userEvent.clear(element);
    userEvent.type(element, '0');
    userEvent.tab();
  };

  // We need to input some value in the name field to potentially submit the form
  await sleep(100);
  userEvent.type(nameField, inputValues.name);

  // 🧪 Price - It should be impossible to submit the form when the price is a negative value
  const priceField = generalSection.querySelector(
    '#paymentpack-form-price-input',
  );
  await testNumericFieldError(priceField, inputValues.wrongNumericValue);

  // 🧪 VAT - It should be impossible to submit the form when the VAT is a negative value
  const vatField = generalSection.querySelector('#paymentpack-form-vat-input');
  await testNumericFieldError(vatField, inputValues.wrongNumericValue);

  // 🧪 Credits - It should be impossible to submit the form when credit is a negative value
  const creditsField = generalSection.querySelector(
    '#paymentpack-form-credit-input',
  );
  await testNumericFieldError(creditsField, inputValues.wrongNumericValue);

  // 🧪 Credits - It should be impossible to submit the form when credit is empty
  userEvent.clear(creditsField);

  await sleep(50);

  userEvent.tab();
  userEvent.click(submitButton);

  expect(args.onSubmit).not.toBeCalled();

  // 🧪 Marginal contribution - It should be impossible to submit the form when we input a negative value
  const generalRadioGroup = await within(
    generalSection as HTMLElement,
  ).findByRole('radiogroup');
  const generalRadioButtons = await within(generalRadioGroup).findAllByRole(
    'radio',
  );

  userEvent.click(generalRadioButtons[1]);

  const marginalContributionField = generalSection.querySelector(
    '#paymentpack-form-margin-input',
  );
  await testNumericFieldError(
    marginalContributionField,
    inputValues.wrongNumericValue,
  );
};

export const validitySectionErrorsTests = async ({
  args,
  canvasElement,
}: {
  args: React.ComponentProps<typeof PaymentPackForm>;
  canvasElement: HTMLElement;
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
  const nameField = generalSection.querySelector(
    '#paymentpack-form-title-input',
  );
  const validitySection = paymentPackForm.querySelector(
    '#paymentpack-form-validity-section',
  );
  const actionButtons = paymentPackForm.querySelectorAll(
    '#paymentpack-form-actions button',
  );
  const submitButton = actionButtons[1];
  const sumOfDaysErrorMessage = i18n.t('paymentPack:addPaymentPack.sumNotZero');

  const testValidityFieldError = async (
    element: Element,
    input: string,
    fieldName: string,
  ) => {
    // It should be impossible to submit the form when input is negative
    // An error message should be displayed
    userEvent.clear(element);
    userEvent.type(element, input);
    userEvent.tab();
    await sleep(50);
    userEvent.click(submitButton);
    expect(args.onSubmit).not.toBeCalled();
    //We can expect the text to be in the doc as it doesn't depends on any translation key
    expect(
      canvas.queryByText(`${fieldName} must be greater than or equal to 0`),
    ).not.toBeNull();
    userEvent.clear(element);
    userEvent.type(element, '0');
    userEvent.tab();
  };
  // We need to input some value in the name field to potentially submit the form
  await sleep(100);
  userEvent.type(nameField, 'Toto');

  // 🧪 Validity - Days - It should be impossible to submit the form when value is negative
  // An error message should be displayed
  const dayValidityField = validitySection.querySelector(
    '#paymentpack-form-day-validity-input',
  );
  await testValidityFieldError(
    dayValidityField,
    inputValues.wrongNumericValue,
    'duration_days',
  );

  // 🧪 Validity - Months - It should be impossible to submit the form when value is negative
  // An error message should be displayed
  const monthValidityField = validitySection.querySelector(
    '#paymentpack-form-month-validity-input',
  );
  await testValidityFieldError(
    monthValidityField,
    inputValues.wrongNumericValue,
    'duration_months',
  );

  // 🧪 Validity - Years - It should be impossible to submit the form when value is negative
  // An error message should be displayed
  const yearValidityField = validitySection.querySelector(
    '#paymentpack-form-year-validity-input',
  );
  await testValidityFieldError(
    yearValidityField,
    inputValues.wrongNumericValue,
    'duration_years',
  );

  // 🧪 Validity - when all fields are set to 0, sumOfDaysErrorMessage should be displayed
  expect(await canvas.findByText(sumOfDaysErrorMessage)).toBeInTheDocument();

  // 🧪 Validity - when all fields are set to 0, it should be impossible to submit the form
  userEvent.click(submitButton);
  expect(args.onSubmit).not.toBeCalled();
  userEvent.type(dayValidityField, '2');

  // Expiration date - It should be impossible to submit the form when field is empty
  const startDateRadioGroup = within(
    validitySection as HTMLElement,
  ).getAllByRole('radiogroup')[1];
  const startDateRadioButtons =
    within(startDateRadioGroup).getAllByRole('radio');

  userEvent.click(startDateRadioButtons[1]);

  const expirationDaysField = validitySection.querySelector(
    '#paymentpack-form-month-expiration-input',
  );

  userEvent.clear(expirationDaysField);
  userEvent.tab();

  await sleep(50);

  userEvent.click(submitButton);

  expect(args.onSubmit).not.toBeCalled();
};

export const restrictionSectionErrorsTests = async ({
  args,
  canvasElement,
}: {
  args: React.ComponentProps<typeof PaymentPackForm>;
  canvasElement: HTMLElement;
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
  const nameField = generalSection.querySelector(
    '#paymentpack-form-title-input',
  );
  const restrictionSection = paymentPackForm.querySelector(
    '#paymentpack-form-restrictions-section',
  );
  const actionButtons = paymentPackForm.querySelectorAll(
    '#paymentpack-form-actions button',
  );
  const submitButton = actionButtons[1];

  const testNumericFieldError = async (element: Element, input: string) => {
    // It should be impossible to submit the form when input is negative
    userEvent.clear(element);
    userEvent.type(element, input);
    userEvent.tab();
    await sleep(50);
    userEvent.click(submitButton);
    expect(args.onSubmit).not.toBeCalled();
    userEvent.clear(element);
    userEvent.tab();
  };

  // We need to input some value in the name field to potentially submit the form
  await sleep(100);
  userEvent.type(nameField, inputValues.name);

  // 🧪 Max bookings per day - It should be impossible to submit the form when value is negative
  const maxBookingsPerDayField = restrictionSection.querySelector(
    '#max-bookings-per-day',
  );
  await testNumericFieldError(
    maxBookingsPerDayField,
    inputValues.wrongNumericValue,
  );

  // 🧪 Max bookings per week - It should be impossible to submit the form when value is negative
  const maxBookingsPerWeekField = restrictionSection.querySelector(
    '#max-bookings-per-week',
  );
  await testNumericFieldError(
    maxBookingsPerWeekField,
    inputValues.wrongNumericValue,
  );

  // 🧪 Max bookings per month - It should be impossible to submit the form when value is negative
  const maxBookingsPerMonthField = restrictionSection.querySelector(
    '#max-bookings-per-month',
  );
  await testNumericFieldError(
    maxBookingsPerMonthField,
    inputValues.wrongNumericValue,
  );

  // 🧪 Max bookings per member - It should be impossible to submit the form when value is negative
  const maxPurchasesPerMemberField = restrictionSection.querySelector(
    '#max-purchase-per-member',
  );
  await testNumericFieldError(
    maxPurchasesPerMemberField,
    inputValues.wrongNumericValue,
  );
};
