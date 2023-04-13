import { expect } from '@storybook/jest';
import { userEvent, within, screen } from '@storybook/testing-library';

import i18n from 'i18next';

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
