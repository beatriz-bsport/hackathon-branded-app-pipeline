import { expect } from '@storybook/jest';
import { userEvent, within, screen } from '@storybook/testing-library';

import i18n from 'i18next';
import moment from 'moment-timezone';

import PaymentPackForm from '../PaymentPackForm.component';

import {
  sleep,
  querySelectedFieldShouldReceiveTheInputValue,
} from '../../../../../utils/storybookHelper';

import { inputValues } from './constants';

export const generalSectionInteractionTests = async ({
  canvasElement,
  args,
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

  // 🧪 Name - The value received should be the same as the input value
  // Need to wait / sleep here otherwise textfield-pass-title will not be available and we'll not be able to interact (type) with it
  await sleep(10);

  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#paymentpack-form-title-input',
    inputValues.name,
  );

  // 🧪 Category - Once selected, the category should appear in the DOM
  const categorySelector = generalSection.querySelector('#value-container');
  const firstCategoryName = args.paymentPackCategories[0].name;

  userEvent.click(categorySelector);

  const firstCategory = await screen.findByText(firstCategoryName);

  userEvent.click(firstCategory);

  expect(canvas.getByText(firstCategoryName)).toBeInTheDocument();

  // 🧪 Category - The recently selected category should replace the one previously selected
  const secondCategoryName = args.paymentPackCategories[1].name;

  userEvent.click(categorySelector);

  const secondCategory = await screen.findByText(secondCategoryName);

  userEvent.click(secondCategory);

  expect(canvas.getByText(secondCategoryName)).toBeInTheDocument();
  expect(canvas.queryByText(firstCategoryName)).toBeNull();

  // 🧪 Price - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#paymentpack-form-price-input',
    inputValues.price,
  );

  // 🧪 VAT - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#paymentpack-form-vat-input',
    inputValues.vat,
  );

  // 🧪 Credit - The value received should be the same as the input value
  const creditsField = generalSection.querySelector(
    '#paymentpack-form-credit-input',
  );

  userEvent.clear(creditsField);
  userEvent.type(creditsField, inputValues.credits);

  // Need to click away to mimic an onBlur event. Here the userEvent.tab won't work ...
  userEvent.click(
    generalSection.querySelector('#paymentpack-form-price-input'),
  );

  expect(creditsField.getAttribute('value')).toBe(inputValues.credits);

  // 🧪 Marginal Contribution - The value received should be the same as the input value
  const generalRadioGroup = await within(
    generalSection as HTMLElement,
  ).findByRole('radiogroup');
  const generalRadioButtons = await within(generalRadioGroup).findAllByRole(
    'radio',
  );

  userEvent.click(generalRadioButtons[1]);
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#paymentpack-form-margin-input',
    inputValues.marginalContribution,
  );

  // 🧪 Penalties - Number of late cancellations - The value received should be the same as the input value
  const penaltySwitchInput = generalSection.querySelector(
    '#paymentpack-form-penalty-switch input',
  );

  userEvent.click(penaltySwitchInput);

  const cancellationCheckbox = generalSection.querySelector(
    '#paymentpack-form-penalty-cancellations-checkbox',
  );

  userEvent.click(cancellationCheckbox);
  await sleep(100);

  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#paymentpack-form-penality-cancellations-input',
    inputValues.penalty.lateCancellation,
  );

  // 🧪 Penalties - Number of days - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#paymentpack-form-penality-days-input',
    inputValues.penalty.days,
  );

  // 🧪 Penalties - Penalty info should be correctly displayed in the DOM
  const penaltyInfo = i18n.t('paymentPack:addPaymentPack.penalityInfo', {
    penalityNumberCancel: parseInt(inputValues.penalty.lateCancellation),
    penalityNumberDay: parseInt(inputValues.penalty.days),
  });

  expect(canvas.queryByText(penaltyInfo)).not.toBeNull();

  // 🧪 Penalties - Blocking period - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    generalSection,
    '#paymentpack-form-penality-days-blocked-input',
    inputValues.penalty.blockingPeriod,
  );

  // 🧪 Penalties - Amount to charge - The value received should be the same as the input value
  const penaltySection = generalSection.querySelector('.MuiCollapse-root');
  const penaltyRadioGroup = await within(
    penaltySection as HTMLElement,
  ).findByRole('radiogroup');
  const penaltyRadioButtons = await within(penaltyRadioGroup).findAllByRole(
    'radio',
  );

  userEvent.click(penaltyRadioButtons[1]);

  const penaltyAmountField = generalSection.querySelector(
    '#paymentpack-form-penality-account-input',
  );

  userEvent.clear(penaltyAmountField);
  await userEvent.type(penaltyAmountField, inputValues.penalty.amount, {
    delay: 1,
  });

  // Need to click away to fire onBlur event. Somehow, userEvent.tab doesn't seem to work here
  userEvent.click(penaltyRadioButtons[1]);

  expect(penaltyAmountField.getAttribute('value')).toBe(
    inputValues.penalty.amount,
  );
};

export const validitySectionInteractionTests = async ({
  canvasElement,
  args,
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
  const validitySection = paymentPackForm.querySelector(
    '#paymentpack-form-validity-section',
  );
  const validityRadioGroups = await within(
    validitySection as HTMLElement,
  ).findAllByRole('radiogroup');
  const validityOptionsRadioGroup = validityRadioGroups[0];
  const validityOptionsRadioButtons = within(
    validityOptionsRadioGroup,
  ).getAllByRole('radio');
  const startDateRadioGroup = within(
    validitySection as HTMLElement,
  ).getAllByRole('radiogroup')[1];
  const startDateRadioButtons =
    within(startDateRadioGroup).getAllByRole('radio');

  // 🧪 Validity - Days - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#paymentpack-form-day-validity-input',
    inputValues.validity.day,
  );

  // 🧪 Validity - Months - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#paymentpack-form-month-validity-input',
    inputValues.validity.month,
  );

  // 🧪 Validity - Years - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#paymentpack-form-year-validity-input',
    inputValues.validity.year,
  );

  // 🧪 Validity - Info message should display the corret information
  const validityInfo = i18n.t(
    'paymentPack:addPaymentPack.validForDuration.year',
    {
      duration_day: parseInt(inputValues.validity.day),
      duration_month: parseInt(inputValues.validity.month),
      duration_year: parseInt(inputValues.validity.year),
    },
  );
  expect(canvas.queryByText(validityInfo)).not.toBeNull();

  // 🧪 Expiration date - The value received should be the same as the input value
  userEvent.click(startDateRadioButtons[1]);
  querySelectedFieldShouldReceiveTheInputValue(
    validitySection,
    '#paymentpack-form-month-expiration-input',
    inputValues.validity.expirationDate,
  );

  // 🧪 Validity date start field - The selected date from the calendar should update the one in the field
  const lowerDateAfterInteraction = moment().date(16).format('L');

  userEvent.click(validityOptionsRadioButtons[1]);
  sleep(100);

  const validityDateStartField = document.getElementsByName('lower_date')[0];

  userEvent.click(validityDateStartField);
  userEvent.click(await screen.findByText('16'));
  userEvent.click(await screen.findByText('OK'));

  expect(validityDateStartField.getAttribute('value')).toBe(
    lowerDateAfterInteraction,
  );

  // 🧪 Validity date end field - The selected date from the calendar should update the one in the field
  const oneMonthFromNowDate = moment().add({ months: 1 });
  const upperDateAfterInteraction = oneMonthFromNowDate.date(16).format('L');
  const validityDateEndField = document.getElementsByName('upper_date')[0];

  userEvent.click(validityDateEndField);
  userEvent.click(await screen.findByText('16'));
  userEvent.click(await screen.findByText('OK'));

  expect(validityDateEndField.getAttribute('value')).toBe(
    upperDateAfterInteraction,
  );
};

export const restrictionsSectionInteractionTests = async ({
  canvasElement,
  args,
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
  const restrictionSection = paymentPackForm.querySelector(
    '#paymentpack-form-restrictions-section',
  );
  await sleep(500);

  // 🧪 Max bookings per day - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    restrictionSection,
    '#max-bookings-per-day',
    inputValues.restrictions.maxBookingPerDay,
  );

  // 🧪 Max bookings per week - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    restrictionSection,
    '#max-bookings-per-week',
    inputValues.restrictions.maxBookingPerWeek,
  );

  // 🧪 Max bookings per month - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    restrictionSection,
    '#max-bookings-per-month',
    inputValues.restrictions.maxBookingPerMonth,
  );

  // 🧪 Max bookings per member - The value received should be the same as the input value
  querySelectedFieldShouldReceiveTheInputValue(
    restrictionSection,
    '#max-purchase-per-member',
    inputValues.restrictions.maxPurchasePerMember,
  );

  // 🧪 Categories selector - The name of the selected category should appear in the control
  const categoriesSelector = restrictionSection.querySelector(
    '#categories-selector div',
  );

  args.categoryList.forEach((category) =>
    expect(canvas.queryByText(category.name)).toBeNull(),
  );

  userEvent.click(categoriesSelector);
  args.categoryList.forEach(async (category) =>
    expect(await canvas.findByText(category.name)).toBeInTheDocument(),
  );
  userEvent.click(await canvas.findByText(args.categoryList[0].name));

  // Click on the "Confirm button"
  userEvent.click(restrictionSection.querySelectorAll('button')[1]);

  expect(
    await canvas.findByText(args.categoryList[0].name),
  ).toBeInTheDocument();

  // 🧪 Categories selector - When clicking on the unselect all, none of the tag should be displayed
  userEvent.click(categoriesSelector);

  // Click on the "Unselect all button"
  userEvent.click(restrictionSection.querySelectorAll('button')[0]);

  // Click on the "Confirm button"
  userEvent.click(restrictionSection.querySelectorAll('button')[1]);

  expect(canvas.queryByText(args.categoryList[0].name)).toBeNull();

  // 🧪 Establishments selector - The name of the selected establishment should appear in the control
  const establishmentsSelector = restrictionSection.querySelector(
    '#establishments-selector div',
  );

  args.availableEstablishmentList.forEach((establishment) =>
    expect(canvas.queryByText(establishment.title)).toBeNull(),
  );

  userEvent.click(establishmentsSelector);
  args.availableEstablishmentList.forEach(async (establishment) =>
    expect(await canvas.findByText(establishment.title)).toBeInTheDocument(),
  );
  userEvent.click(
    await canvas.findByText(args.availableEstablishmentList[0].title),
  );

  // Click on the "Confirm button"
  userEvent.click(restrictionSection.querySelectorAll('button')[1]);

  expect(
    await canvas.findByText(args.availableEstablishmentList[0].title),
  ).toBeInTheDocument();

  // 🧪 Establishments selector - When clicking on the unselect all none of the tag should be displayed
  userEvent.click(establishmentsSelector);

  // Click on the "Unselect all button"
  userEvent.click(restrictionSection.querySelectorAll('button')[0]);

  // Click on the "Confirm button"
  userEvent.click(restrictionSection.querySelectorAll('button')[1]);

  expect(
    canvas.queryByText(args.availableEstablishmentList[0].title),
  ).toBeNull();

  // 🧪 Activities selector - The name of the selected activity should appear in the control
  const activitiesSelector = restrictionSection.querySelector(
    '#activities-selector div',
  );

  args.metaActivityList.forEach((activity) =>
    expect(canvas.queryByText(activity.name)).toBeNull(),
  );

  userEvent.click(activitiesSelector);
  args.metaActivityList.forEach(async (activity) =>
    expect(await canvas.findByText(activity.name)).toBeInTheDocument(),
  );
  userEvent.click(await canvas.findByText(args.metaActivityList[0].name));

  // Click on the "Confirm button"
  userEvent.click(restrictionSection.querySelectorAll('button')[1]);

  expect(
    await canvas.findByText(args.metaActivityList[0].name),
  ).toBeInTheDocument();

  // 🧪 Activities selector - When clicking on the unselect all none of the tag should be displayed
  userEvent.click(activitiesSelector);

  // Click on the "Unselect all button"
  userEvent.click(restrictionSection.querySelectorAll('button')[0]);

  // Click on the "Confirm button"
  userEvent.click(restrictionSection.querySelectorAll('button')[1]);

  expect(canvas.queryByText(args.metaActivityList[0].name)).toBeNull();
};
