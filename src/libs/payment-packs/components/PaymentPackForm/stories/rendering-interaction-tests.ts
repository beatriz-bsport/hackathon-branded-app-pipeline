import { userEvent, within, screen } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import i18n from 'i18next';

import PaymentPackForm from '../PaymentPackForm.component';

import {
  sleep,
  querySelectedElementShouldBeInTheDocument,
} from '../../../../../utils/storybookHelper';

// Rendering Interaction Tests
// The purpose of these tests is to mimic user behavior and check that hidden fields / elements are rendered

export const generalSectionRenderingInteractionTests = async ({
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

  // 🧪 Category - The category options list should not be visible
  const categorySelector = generalSection.querySelector('#value-container');
  const firstCategoryName = args.paymentPackCategories[0].name;
  const secondCategoryName = args.paymentPackCategories[1].name;

  expect(canvas.queryByText(firstCategoryName)).toBeNull();
  expect(canvas.queryByText(secondCategoryName)).toBeNull();

  // 🧪 Category - After clicking on the radio button, the category options list should be displayed
  await sleep(500);
  userEvent.click(categorySelector);

  const firstCategory = await screen.findByText(
    firstCategoryName,
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );
  const secondCategory = await screen.findByText(
    secondCategoryName,
    {
      /*Unused queryOption*/
    },
    { timeout: 3500 },
  );

  expect(firstCategory).toBeInTheDocument();
  expect(secondCategory).toBeInTheDocument();

  // 🧪 Credits - Unlimited - After clicking on the radio button, theoretical margin should be displayed
  const generalRadioGroup = await within(
    generalSection as HTMLElement,
  ).findByRole('radiogroup');
  const generalRadioButtons = await within(generalRadioGroup).findAllByRole(
    'radio',
  );

  // Click on the Unlimited radio button
  userEvent.click(generalRadioButtons[1]);

  const marginalContributionField = generalSection.querySelector(
    '#paymentpack-form-margin-input',
  );
  expect(marginalContributionField).not.toBeNull();

  // 🧪 Credits - Unlimited - After clicking on the radio button, penalty switchfield should not be disabled
  const penaltySwitch = generalSection.querySelector(
    '#paymentpack-form-penalty-switch span span',
  );
  expect(penaltySwitch.getAttribute('aria-disabled')).toBe('false');

  // 🧪 Penalties - After clicking on penalty checkbox, should render the penalty section
  const penaltySwitchInput = generalSection.querySelector(
    '#paymentpack-form-penalty-switch input',
  );

  userEvent.click(penaltySwitchInput);
  expect(generalSection.querySelector('.MuiCollapse-root')).toBeVisible();

  // 🧪 Penalties - When the penalty section is rendered, the cancellation checkbox should be displayed
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-penalty-cancellations-checkbox',
  );

  // 🧪 Penalties - When the penalty section is rendered, the no show checkbox should be displayed
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-penalty-noshow-checkbox',
  );

  // 🧪 Penalties - When clicking on cancellation checkbox, the cancellation input should be displayed
  const cancellationCheckbox = generalSection.querySelector(
    '#paymentpack-form-penalty-cancellations-checkbox',
  );

  userEvent.click(cancellationCheckbox);
  sleep(100);

  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-penality-cancellations-input',
  );

  // 🧪 Penalties - When clicking on cancellation checkbox, the penalty days input should be displayed
  querySelectedElementShouldBeInTheDocument(
    generalSection,
    '#paymentpack-form-penality-days-input',
  );

  // 🧪 Penalties - When the penalty section is rendered, the penalty amount field should be hidden
  const penaltyAmountField = generalSection.querySelector(
    '#paymentpack-form-penality-account-input',
  );
  expect(penaltyAmountField).toBeNull();

  // 🧪 Penalties - When clicking on "charge the member" option on penalty setting,
  // amount to charge field should be rendered
  const penaltySection = generalSection.querySelector('.MuiCollapse-root');
  const penaltyRadioGroup = await within(
    penaltySection as HTMLElement,
  ).findByRole('radiogroup');
  const penaltyRadioButtons = await within(penaltyRadioGroup).findAllByRole(
    'radio',
  );

  // Click on "charge the member"
  userEvent.click(penaltyRadioButtons[1]);
  expect(
    penaltySection.querySelector('#paymentpack-form-penality-account-input'),
  ).not.toBeNull();

  // 🧪 Universal pass - When switched on, unlimited radio button should be disabled
  const isUniversalSwitchField = generalSection.querySelector(
    '#is-universal-pass-grid input',
  );

  userEvent.click(isUniversalSwitchField);
  expect(generalRadioButtons[1]).toBeDisabled();

  // 🧪 Universal pass - When switched on, penalty checkbox should be disabled
  expect(penaltySwitch.getAttribute('aria-disabled')).toBe('true');
};

export const validitySectionRenderingInteractionTests = async ({
  canvasElement,
}: {
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

  // 🧪 Validity - When clicking on Valid from the first booking radio button:
  // Expiration day field should be rendered
  expect(
    validitySection.querySelector('#paymentpack-form-month-expiration-input'),
  ).toBeNull();

  const validityRadioGroups = await within(
    validitySection as HTMLElement,
  ).findAllByRole('radiogroup');
  const startDateRadioButtons = await within(
    validityRadioGroups[1],
  ).findAllByRole('radio');
  const bookingRadioButton = startDateRadioButtons[1];

  userEvent.click(bookingRadioButton);

  const expirationDateField = validitySection.querySelector(
    '#paymentpack-form-month-expiration-input',
  );
  expect(expirationDateField).not.toBeNull();

  // 🧪 Validity - When clicking on  "Make this pass valid during a certain time period"
  // Date fields should be rendered
  const validityOptionsRadioGroup = validityRadioGroups[0];
  const validityOptionsRadioButtons = await within(
    validityOptionsRadioGroup,
  ).findAllByRole('radio');
  const periodValidityOptionRadioButton = validityOptionsRadioButtons[1];

  userEvent.click(periodValidityOptionRadioButton);

  const validityDateStartField = document.getElementsByName('lower_date')[0];
  expect(validityDateStartField).toBeInTheDocument();

  const validityDateEndField = document.getElementsByName('upper_date')[0];
  expect(validityDateEndField).toBeInTheDocument();

  // The validity fields (days/months/years) should not appear
  expect(
    validitySection.querySelector('#paymentpack-form-day-validity-input'),
  ).toBeNull();
  expect(
    validitySection.querySelector('#paymentpack-form-month-validity-input'),
  ).toBeNull();
  expect(
    validitySection.querySelector('#paymentpack-form-year-validity-input'),
  ).toBeNull();

  // 🧪 Universal pass - when switched on, validity period option should be disabled
  const isUniversalSwitchField = paymentPackForm.querySelector(
    '#is-universal-pass-grid input',
  );

  userEvent.click(isUniversalSwitchField);
  expect(periodValidityOptionRadioButton).toBeDisabled();
};

export const restrictionsSectionRenderingInteractionTests = async ({
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
  const restrictionSection = paymentPackForm.querySelector(
    '#paymentpack-form-restrictions-section',
  );

  // 🧪 Switchfields - When clicking on unavailable for purchase, the two other fields should
  // be disabled
  const restrictionsSwitchfields = restrictionSection.querySelectorAll(
    '#restrictions-switchfields-grid input',
  );
  const newMembersOnlySwitchField = restrictionsSwitchfields[0];
  const unavailableForPurchaseSwitchField = restrictionsSwitchfields[1];
  const onsitePaymentSwitchField = restrictionsSwitchfields[2];

  userEvent.click(unavailableForPurchaseSwitchField);
  await sleep(200);

  expect(newMembersOnlySwitchField).toBeDisabled();
  expect(onsitePaymentSwitchField).toBeDisabled();

  // 🧪 VOD - Click on the title, section should be visible -> with one checkbox
  const expandVodButton = restrictionSection.querySelector('button');

  userEvent.click(expandVodButton);
  await sleep(100);

  expect(restrictionSection.querySelector('.MuiCollapse-root')).toBeVisible();

  // 🧪 VOD - Click on the first checkbox, second should appear
  const enableVodCheckBox = restrictionSection.querySelector('#checkbox');

  userEvent.click(enableVodCheckBox);
  await sleep(100);

  expect(
    restrictionSection.querySelectorAll('.MuiCollapse-root')[1],
  ).toBeVisible();

  // 🧪 Categories - When clicking, should display the options list
  const categoriesSelector = restrictionSection.querySelector(
    '#categories-selector div',
  );

  userEvent.click(categoriesSelector);

  const firstOptionInCategoryList = await canvas.findByText(
    args.categoryList[0].name,
  );
  expect(firstOptionInCategoryList).toBeInTheDocument();

  // 🧪 Establishments - When clicking, should display the options list
  const establishmentsSelector = restrictionSection.querySelector(
    '#establishments-selector div',
  );

  userEvent.click(establishmentsSelector);

  const firstOptionInEstablishmentList = await canvas.findByText(
    args.availableEstablishmentList[0].title,
  );
  expect(firstOptionInEstablishmentList).toBeInTheDocument();

  // 🧪 Activities - When clicking, should display the options list
  const activitiesSelector = restrictionSection.querySelector(
    '#activities-selector div',
  );

  userEvent.click(activitiesSelector);

  const firstOptionInActivityList = await canvas.findByText(
    args.metaActivityList[0].name,
  );
  expect(firstOptionInActivityList).toBeInTheDocument();
};

export const advancedSectionRenderingInteractionTests = async ({
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
  const advancedOptionsSection = paymentPackForm.querySelector(
    '#paymentpack-form-advanced-options-section',
  );
  const placeholderText = i18n.t(
    'paymentPack:form.paymentPack.advancedOptions.tag.doNotSelectToAllowAllMembers',
  );

  const expandAdvancedOptionsButton =
    advancedOptionsSection.querySelector('button');

  userEvent.click(expandAdvancedOptionsButton);

  await sleep(200);

  // 🧪 Approved tag selector - On click , should display the options list
  const tagSelectors = await canvas.findAllByText(placeholderText);
  const approvedTagSelector = tagSelectors[0];

  userEvent.click(approvedTagSelector);

  const firstTagInList = await canvas.findByText(args.tagList[0].name);
  expect(firstTagInList).toBeInTheDocument();

  // 🧪 Refused tag selector - On click , should display the options list
  const refusedTagSelector = tagSelectors[1];

  userEvent.click(refusedTagSelector);

  const secondTagInList = await canvas.findByText(args.tagList[1].name);
  expect(secondTagInList).toBeInTheDocument();
};
